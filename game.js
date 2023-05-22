const Stage = {
    Greeting: 0,
    Shuffle5: 1,
    FishOrRollback: 2,
    Shuffle6: 3,
    Repeat: 4,
    GameOver: 5,
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
                y: 900,
                angle: 0,
                scale: 0.7,
            },
            {
                x: 600,
                y: 900,
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
            contents: [
                "\n  Fish!  \n",
                "\nRollback!\n",
            ],
            xes: [
                270,
                810,
            ],
            y: 540,
            style: {
                fontFamily: "Courier",
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
        scoreDisplay: {
            x: 1080,
            y: 0,
            style: {
                fontFamily: "Courier",
                fontSize: "48px",
                fontStyle: "bold",
                color: "black",
                backgroundColor: "#aaaaaa44",
                align: "right",
            },
        },
    },
};
const phrasesMixing = [
    "mixing cards",
];
const phrasesShuffle6 = {
    fish: [
        "Fish",
        "fishing",
    ],
    rollback: [
        "Rollback",
        "rolling",
    ],
};
const cardRanks = [
    "wolf's tail",
    "buxom red",
    "chubby nine",
    "stoneroller",
    "hungry gutter",
    "arrow in the neck",
    "plank",
];

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
        this.cardsInGame = {
            deck: [],
            hand: [],
            stash: [],
        };
        this.firstCardRank = 0;
        this.buttons = [];
        this.score = 500;
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
        for (let depth = 10; depth < 17; depth++) {
            let card = this.add.sprite(
                settings.cardPositions.deckDefault.x,
                settings.cardPositions.deckDefault.y,
                "cards",
                7,
            );
            card.setScale(settings.cardPositions.deckDefault.scale);
            card.setDepth(depth);
            card.setInteractive(this.input.makePixelPerfect());
            this.cardsInGame.deck.push(card);
        }
        this.speechBubble = this.add.text(
            settings.text.speechBubble.x,
            settings.text.speechBubble.y,
            "",
            settings.text.speechBubble.style,
        );
        this.speechBubble.setDepth(30);
        this.scoreDisplay = this.add.text(
            settings.text.scoreDisplay.x,
            settings.text.scoreDisplay.y,
            this.score.toString() + "c.",
            settings.text.scoreDisplay.style,
        );
        this.scoreDisplay.setDepth(100);
        this.scoreDisplay.setOrigin(1, 0);
        this.playStage();
        this.input.on("pointerup", this.handleInput, this);
        console.debug("Created game field");
    }

    playStage() {
        console.debug("Playing stage " + this.stage.toString());
        this.inputAllowed = false;
        this.resetSpeechBubble();
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
        let indexInDeck = -1;
        switch (this.stage) {
            case Stage.Greeting:
            case Stage.Repeat:
                this.stage = Stage.Shuffle5;
                break;
            case Stage.Shuffle5:
                if (!this.cardsInGame.deck.includes(clickedObject)) {
                    console.debug("Clicked not on a card");
                    this.inputAllowed = true;
                    return;
                }
                indexInDeck = this.cardsInGame.deck.indexOf(clickedObject);
                this.cardsInGame.deck.splice(indexInDeck, 1);
                this.cardsInGame.hand.push(clickedObject);
                this.stage = Stage.FishOrRollback;
                break;
            case Stage.FishOrRollback:
                if (!this.buttons.includes(clickedObject)) {
                    console.debug("Clicked not on a button");
                    this.inputAllowed = true;
                    return;
                }
                this.playersChoice = (
                    clickedObject.text == settings.text.buttons.contents[0]
                    ? 1
                    : -1
                );
                this.stage = Stage.Shuffle6;
                break;
            case Stage.Shuffle6:
                if (!this.cardsInGame.deck.includes(clickedObject)) {
                    console.debug("Clicked not on a card");
                    this.inputAllowed = true;
                    return;
                }
                indexInDeck = this.cardsInGame.deck.indexOf(clickedObject);
                this.cardsInGame.deck.splice(indexInDeck, 1);
                this.cardsInGame.hand.push(clickedObject);
                this.stage = Stage.Repeat;
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
            "Hello, drifter! Wanna play catcrawlers?\n[tap to bet 100c.]"
        );
        this.inputAllowed = true;
    }

    playShuffle5() {
        this.score -= 100;
        this.updateScoreDisplay();
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
        timeline.add({
            targets: this.cardsInGame.deck[0],
            x: settings.resolution * Math.random(),
            y: settings.resolution * Math.random(),
            duration: 500,
            onStart: () => {
                for (let i = 0; i < 5; i++) {
                    this.cardsInGame.deck[i].setDepth(i + 10);
                }
                this.cardsInGame.deck.slice(1).forEach((card) => {
                    this.tweens.add({
                        targets: card,
                        x: settings.resolution * Math.random(),
                        y: settings.resolution * Math.random(),
                        duration: 500,
                    });
                });
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
        this.typewrite(
            "Now we are "
            + phrasesMixing[Math.floor(Math.random() * phrasesMixing.length)]
            + " and "
            + phrasesMixing[Math.floor(Math.random() * phrasesMixing.length)]
            + "! Now pick a card!"
        );
    }

    playFishOrRollback() {
        this.firstCardRank = Math.floor(Math.random() * 5) + 1;
        let firstCardText = cardRanks[this.firstCardRank];
        this.tweens.add({
            targets: this.cardsInGame.hand[0],
            duration: 500,
            onComplete: () => {
                this.cardsInGame.hand[0].setFrame(this.firstCardRank);
                this.cardsInGame.hand[0].setDepth(50);
                for (let i = 0; i < 2; i++) {
                    let button = this.add.text(
                        settings.text.buttons.xes[i],
                        settings.text.buttons.y,
                        settings.text.buttons.contents[i],
                        settings.text.buttons.style,
                    )
                    this.buttons.push(button);
                    button.setDepth(120);
                    button.setOrigin(0.5);
                    button.setInteractive();
                }
                this.inputAllowed = true;
            },
            ease: "Cubic.easeOut",
            ...settings.cardPositions.hand[0],
        });
        this.typewrite(
            "It is the "
            + firstCardText
            + "! Do you fish with the "
            + firstCardText
            + " or rollback?"
        );
    }

    playShuffle6() {
        this.buttons.forEach((button) => {button.destroy();});
        this.buttons.splice(2);
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
        while (this.cardsInGame.stash.length > 0) {
            let card = this.cardsInGame.stash.pop();
            this.cardsInGame.deck.push(card);
            timeline.add({
                targets: card,
                duration: 500,
                onStart: () => {card.setFrame(7);},
                ...settings.cardPositions.deckDefault,
            });
        }
        timeline.add({
            targets: this.cardsInGame.deck[0],
            x: settings.resolution * Math.random(),
            y: settings.resolution * Math.random(),
            duration: 500,
            onStart: () => {
                for (let i = 0; i < 6; i++) {
                    this.cardsInGame.deck[i].setDepth(i + 10);
                }
                this.cardsInGame.deck.slice(1).forEach((card) => {
                    this.tweens.add({
                        targets: card,
                        x: settings.resolution * Math.random(),
                        y: settings.resolution * Math.random(),
                        duration: 500,
                    });
                });
            },
        });
        timeline.add({
            targets: [...this.cardsInGame.deck],
            duration: 500,
            onStart: () => {
                for (let i = 0; i < 6; i++) {
                    this.cardsInGame.deck[i].setDepth(15 - i);
                }
            },
            ...settings.cardPositions.deckDefault,
        });
        timeline.add({
            targets: this.cardsInGame.deck[0],
            duration: 500,
            onStart: () => {
                for (let i = 1; i < 6; i++) {
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
        let phrases = (
            this.playersChoice == 1
            ? phrasesShuffle6.fish
            : phrasesShuffle6.rollback
        );
        this.typewrite(
            phrases[0]
            + " it is! Now we are "
            + phrasesMixing[Math.floor(Math.random() * phrasesMixing.length)]
            + ", "
            + phrasesMixing[Math.floor(Math.random() * phrasesMixing.length)]
            + ", "
            + phrases[1]
            + ", "
            + phrases[1]
            + "... Now pick a card!"
        );
    }

    playRepeat() {
        // TODO: Make the dealer cheat.
        let secondCardRank = Math.floor(Math.random() * 6);
        if (secondCardRank >= this.firstCardRank) {
            secondCardRank++;
        }
        let secondCardText = cardRanks[secondCardRank];
        let winAmount = 0;
        let winText = "dry out.";
        let playAgainText = "Wanna play again?\n[Tap to bet 100c.]";
        if (
            secondCardRank - this.firstCardRank == this.playersChoice
            && (secondCardRank - 3) ** 2 == 9
        ) {
            winAmount = 600;
            winText = "get a full six!";
        }
        else if (
            (secondCardRank - this.firstCardRank) * this.playersChoice > 0
        ) {
            winAmount = 200;
            winText = "lick it!";
        }
        this.score += winAmount;
        if (this.score < 100) {
            playAgainText = "Sorry, you lost all your cats. Next player!";
            this.stage = Stage.GameOver;
        }
        this.tweens.add({
            targets: this.cardsInGame.hand[1],
            duration: 500,
            onComplete: () => {
                this.cardsInGame.hand[1].setFrame(secondCardRank);
                this.cardsInGame.hand[1].setDepth(50);
                this.updateScoreDisplay();
                this.inputAllowed = true;
            },
            ease: "Cubic.easeOut",
            ...settings.cardPositions.hand[1],
        });
        this.typewrite(
            "It is the "
            + secondCardText
            + "! You "
            + winText
            + " "
            + playAgainText
        );
    }

    playGameOver() {
        this.typewrite("Next player!");
        this.inputAllowed = true;
    }

    updateScoreDisplay() {
        this.scoreDisplay.text = this.score.toString() + "c.";
    }

    resetSpeechBubble() {
        this.time.removeAllEvents();
        this.speechBubble.text = "";
    }

    typewrite(text) {
        const length = text.length;
        let i = 0;
        this.time.addEvent({
            callback: () => {
                this.speechBubble.text += text[i];
                ++i;
            },
            callbackScope: this,
            repeat: length - 1,
            delay: 50,
        });
    }
}
