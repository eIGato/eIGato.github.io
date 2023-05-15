const Stage = {
    Greeting: 0,
    Shuffle5: 1,
    FishOrRollback: 3,
    Shuffle6: 4,
    Repeat: 6,
    GameOver: 7,
}
const settings = {
    cardPositions: {
        deckDefault: {
            x: 540,
            y: 540,
            angle: 0,
            scale: 0.5,
        },
        deckUnfolded: [
            {
                x: 219,
                y: 540,
                angle: 40,
                scale: 1,
            },
            {
                x: 337,
                y: 613,
                angle: 24,
                scale: 1,
            },
            {
                x: 470,
                y: 652,
                angle: 8,
                scale: 1,
            },
            {
                x: 610,
                y: 652,
                angle: -8,
                scale: 1,
            },
            {
                x: 743,
                y: 613,
                angle: -24,
                scale: 1,
            },
            {
                x: 861,
                y: 540,
                angle: -40,
                scale: 1,
            },
        ],
        hand: [
            {
                x: 920,
                y: 840,
                angle: 0,
                scale: 0.7,
            },
            {
                x: 600,
                y: 840,
                angle: 0,
                scale: 0.7,
            },
        ],
        stash: [
            {
                x: 160,
                y: 840,
                angle: 0,
                scale: 0.5,
            },
            {
                x: 350,
                y: 840,
                angle: 0,
                scale: 0.5,
            },
        ],
    },
    resolution: 1080,
    spriteFrame: {
        frameWidth: 334,
        frameHeight: 440,
    },
    text: {
        buttons: {
            x1: 270,
            x2: 810,
            y: 810,
            style: {
                fontFamily: "Arial",
                fontSize: "72px",
                fontStyle: "bold",
                color: "black",
                backgroundColor: "#999933",
                align: "center",
            },
        },
        speechBubble: {
            x: 100,
            y: 100,
            style: {
                fontFamily: "Arial",
                fontSize: "72px",
                fontStyle: "bold",
                color: "black",
                backgroundColor: "#aaaaaa44",
                wordWrap: {width: 880},
            },
        },
    },
};

let game;


window.onload = function() {
    console.debug("Loading window");
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "catcrawlers",
            width: settings.resolution,
            height: settings.resolution,
        },
        scene: playGame,
    };
    game = new Phaser.Game(gameConfig);
    window.focus();
    console.debug("Loaded window");
}


class playGame extends Phaser.Scene {
    constructor() {
        console.debug("Constructing game");
        super("PlayGame");
        this.stage = Stage.Greeting;
        this.inputAllowed = false;
        this.cardsToChoose = [];
        console.debug("Constructed game");
    }

    preload() {
        console.debug("Loading assets");
        this.load.spritesheet("cards", "cards.png", settings.spriteFrame);
        this.load.image("background", "background.jpg");
        console.debug("Loaded assets");
    }

    create() {
        console.debug("Creating game field");
        this.background = this.add.image(
            settings.resolution / 2,
            settings.resolution / 2,
            "background",
        );
        this.background.setDepth(-127);
        this.cardsInGame = {
            deck: [],
            hand: [],
            stash: [],
        };
        for (let depth = 10; depth < 17; depth++) {
            let card = this.add.sprite(
                settings.cardPositions.deckDefault.x,
                settings.cardPositions.deckDefault.y,
                "cards",
                7,
            );
            card.setScale(settings.cardPositions.deckDefault.scale);
            card.setDepth(depth);
            this.cardsInGame.deck.push(card);
        }
        this.speechBubble = this.add.text(
            settings.text.speechBubble.x,
            settings.text.speechBubble.y,
            "",
            settings.text.speechBubble.style,
        );
        this.speechBubble.setDepth(30);
        this.playStage();
        this.input.on("pointerup", this.handleInput, this);
        console.debug("Created game field");
    }

    playStage() {
        console.debug("Playing stage " + this.stage.toString());
        this.inputAllowed = false;
        switch (this.stage) {
            case Stage.Greeting:
                this.playGreeting();
                break;
            case Stage.Shuffle5:
                this.playShuffle5();
                break;
            case Stage.FishOrRollback:
                this.playFishOrRollback();
                break;
            case Stage.Shuffle6:
                this.playShuffle6();
                break;
            case Stage.Repeat:
                this.playRepeat();
                break;
            case Stage.GameOver:
                this.playGameOver();
                break;
            default:
                throw new Error("Unreachable code");
        }
        console.debug("Played stage " + this.stage.toString());
    }

    handleInput(pointer, currentlyOver) {
        console.debug("Got input on stage " + this.stage.toString());
        if (!this.inputAllowed) {
            console.debug("Input not allowed");
            return;
        }
        this.inputAllowed = false;
        let clickedObject = currentlyOver[currentlyOver.length - 1]
        switch (this.stage) {
            case Stage.Greeting:
            case Stage.Repeat:
                this.stage = Stage.Shuffle5;
                break;
            case Stage.Shuffle5:
                if (!this.cardsToChoose.includes(clickedObject)) {
                    this.inputAllowed = true;
                    return;
                }
                this.animateAddToHand(clickedObject);
                this.animateRevealCard();
                this.stage = Stage.FishOrRollback;
                break;
            case Stage.FishOrRollback:
                if (!this.buttons.includes(clickedObject)) {
                    this.inputAllowed = true;
                    return;
                }
                this.playersChoice = clickedObject.text == "Fish" ? 1 : -1;
                this.stage = Stage.Shuffle6;
                break;
            case Stage.Shuffle6:
                if (!this.cardsToChoose.includes(clickedObject)) {
                    this.inputAllowed = true;
                    return;
                }
                this.animateAddToHand(clickedObject);
                this.defineGameResult();
                if (this.score > 0) {
                    this.stage = Stage.Repeat;
                }
                else {
                    this.stage = Stage.GameOver;
                }
                break;
            case Stage.GameOver:
                break;
            default:
                throw new Error("Unreachable code");
        }
        this.time.addEvent({
            callback: this.playStage,
            callbackScope: this,
            delay: 0,
        });
        console.debug("Handled input");
    }

    playGreeting() {
        this.typewrite(
            "Hello, drifter! Wanna play catcrawlers?\n[tap to bid 100c.]",
            () => {this.inputAllowed = true;},
        );
    }

    playShuffle5() {
        this.speechBubble.text = "";
        let timeline = this.tweens.chain({
            onComplete: () => {this.inputAllowed = true;},
            ease: "Cubic.easeOut",
            paused: true,
            tweens: [{
                targets: [...this.cardsInGame.deck],
                duration: 500,
                ...settings.cardPositions.deckDefault,
            }],
        });
        while (this.cardsInGame.hand.length > 0) {
            let card = this.cardsInGame.hand.pop();
            this.cardsInGame.deck.push(card);
            timeline.add({
                targets: card,
                duration: 500,
                onStart: () => {card.setFrame(7);},
                ...settings.cardPositions.deckDefault,
            });
        }
        for (let i = 0; i < 2; i++) {
            let card = this.cardsInGame.deck.pop();
            card.setDepth(0);
            this.cardsInGame.stash.push(card);
            timeline.add({
                targets: card,
                duration: 500,
                onComplete: () => {card.setFrame(i * 6);},
                ...settings.cardPositions.stash[i],
            });
        }
        // FIXME: Add separate positions.
        timeline.add({
            targets: [...this.cardsInGame.deck],
            x: settings.resolution * Math.random(),
            y: settings.resolution * Math.random(),
            duration: 500,
            onStart: () => {
                for (let i = 0; i < 5; i++) {
                    this.cardsInGame.deck[i].setDepth(i + 10);
                }
            },
        });
        timeline.add({
            targets: [...this.cardsInGame.deck],
            duration: 500,
            onStart: () => {
                for (let i = 0; i < 5; i++) {
                    this.cardsInGame.deck[i].setDepth(15 - i);
                }
            },
            ...settings.cardPositions.deckDefault,
        });
        timeline.add({
            targets: this.cardsInGame.deck[0],
            duration: 500,
            onStart: () => {
                for (let i = 1; i < 5; i++) {
                    this.tweens.add({
                        targets: this.cardsInGame.deck[i],
                        duration: 500,
                        ...settings.cardPositions.deckUnfolded[i],
                    });
                }
            },
            ...settings.cardPositions.deckUnfolded[0],
        });
        timeline.play();
    }

    playFishOrRollback() {
        deck = Phaser.Utils.Array.NumberArray(0, 6);
        this.tweens.add({
            targets: cardsInGame[0],
            x: game.config.width / 2,
            duration: 500,
            ease: "Cubic.easeOut",
        });
    }

    typewrite(text, onComplete = () => {}) {
        const length = text.length;
        let i = 0;
        this.time.addEvent({
            callback: () => {
                this.speechBubble.text += text[i];
                ++i;
                if (i == length) {
                    onComplete();
                }
            },
            callbackScope: this,
            repeat: length - 1,
            delay: 100,
        });
    }
}
