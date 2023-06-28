const Stage = {
    Greeting: 0,
    Shuffle5: 1,
    FishOrRollback: 2,
    Shuffle6: 3,
    Repeat: 4,
    GameOver: 5,
}
const settings = {
    chances: {
        lose: 10,
        win: 7,
        jackpot: 5,
    },
    cardPositions: {
        deckDefault: {
            x: 540,
            y: 540,
            angle: 0,
            scale: 0.5,
        },
        deckUnfolded5: [
            {
                x: 219,
                y: 540,
                angle: 40,
                scale: 1,
            },
            {
                x: 369,
                y: 627,
                angle: 20,
                scale: 1,
            },
            {
                x: 540,
                y: 657,
                angle: 0,
                scale: 1,
            },
            {
                x: 711,
                y: 627,
                angle: -20,
                scale: 1,
            },
            {
                x: 861,
                y: 540,
                angle: -40,
                scale: 1,
            },
        ],
        deckUnfolded6: [
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
                y: 880,
                angle: 0,
                scale: 1,
            },
            {
                x: 600,
                y: 880,
                angle: 0,
                scale: 1,
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
        frameWidth: 270,
        frameHeight: 384,
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
                color: "#110",
                backgroundColor: "#aa3",
                align: "center",
            },
        },
        infoBox: {
            style: {
                fontFamily: "Arial",
                fontSize: "48px",
                fontStyle: "bold",
                color: "#110",
                backgroundColor: "#ffa",
                wordWrap: {width: 1060},
            },
        },
        speechBubble: {
            x: 360,
            y: 60,
            style: {
                fontFamily: "Arial",
                fontSize: "48px",
                fontStyle: "bold",
                color: "#110",
                backgroundColor: "#ffa4",
                wordWrap: {width: 660},
            },
        },
        scoreDisplay: {
            x: 0,
            y: 0,
            style: {
                fontFamily: "Courier",
                fontSize: "72px",
                fontStyle: "bold",
                color: "#110",
                backgroundColor: "#ffa4",
                align: "left",
            },
        },
        scoreUp: {
            style: {
                fontFamily: "Courier",
                fontSize: "72px",
                fontStyle: "bold",
                color: "#0f0",
                backgroundColor: "#0f00",
                align: "left",
            },
        },
        scoreDown: {
            style: {
                fontFamily: "Courier",
                fontSize: "72px",
                fontStyle: "bold",
                color: "#f00",
                backgroundColor: "#f000",
                align: "left",
            },
        },
    },
    coinIcon: {
        x: 215,
        y: 40,
        scale: 0.9,
    },
};
const phrasesMixing = [
    "churning the bolts",
    "pulling out the big boys",
    "charging the wedgers",
    "tugging on the digits",
    "forking the loaves",
    "weeping the garru",
    "flashing the bug eyes",
    "slackening the whiskers",
    "punching the bird",
    "holding the knockers",
    "tickling the wheat",
    "pinching the cotton",
    "freshening up the old man",
    "exposing the girls",
    "shooting off the turret",
];
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
        scene: [mainMenu, playGame, showRules, showCopyright],
    };
    game = new Phaser.Game(gameConfig);
    window.focus();
    console.debug("Loaded window");
}


class mainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        this.buttons = [];
        let button = this.add.text(
            settings.resolution / 2,
            settings.resolution / 2 - 330,
            "\n   START   \n",
            settings.text.buttons.style,
        )
        button.setOrigin(0.5, 0.5);
        button.setInteractive();
        button.on(
            "pointerup",
            () => {this.scene.start("PlayGame");},
            this,
        );
        this.buttons.push(button);
        button = this.add.text(
            settings.resolution / 2,
            settings.resolution / 2,
            "\n   RULES   \n",
            settings.text.buttons.style,
        )
        button.setOrigin(0.5, 0.5);
        button.setInteractive();
        button.on(
            "pointerup",
            () => {this.scene.start("ShowRules");},
            this,
        );
        this.buttons.push(button);
        button = this.add.text(
            settings.resolution / 2,
            settings.resolution / 2 + 330,
            "\n COPYRIGHT \n",
            settings.text.buttons.style,
        )
        button.setOrigin(0.5, 0.5);
        button.setInteractive();
        button.on(
            "pointerup",
            () => {this.scene.start("ShowCopyright");},
            this,
        );
        this.buttons.push(button);
    }
}


class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    preload() {
        console.debug("Loading assets");
        this.load.spritesheet("cards", "cards.png", settings.spriteFrame);
        this.load.image("background", "background.jpg");
        this.load.image("coin", "/favicon.ico");
        console.debug("Loaded assets");
    }

    create() {
        console.debug("Creating game field");
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
            " " + this.score.toString() + "  ",
            settings.text.scoreDisplay.style,
        );
        this.scoreDisplay.setDepth(100);
        this.coinIcon = this.add.image(
            settings.coinIcon.x,
            settings.coinIcon.y,
            "coin",
        );
        this.coinIcon.setDepth(110);
        this.coinIcon.setScale(settings.coinIcon.scale);
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
                this.stage = Stage.Greeting;
                this.scene.start("MainMenu");
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
            "Up for a game o' catcrawlers, outlander?"
            + " Full six rollback gets the girl!\n[tap to bet 100c.]"
        );
        this.inputAllowed = true;
    }

    playShuffle5() {
        this.updateScore(-100);
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
                        ...settings.cardPositions.deckUnfolded5[i],
                    });
                }
            },
            ...settings.cardPositions.deckUnfolded5[0],
        });
        timeline.play();
        this.typewrite(
            "Okay, "
            + phrasesMixing[Math.floor(Math.random() * phrasesMixing.length)]
            + " and "
            + phrasesMixing[Math.floor(Math.random() * phrasesMixing.length)]
            + "! Now pick a card!"
        );
    }

    playFishOrRollback() {
        this.firstCardRank = Math.floor(Math.random() * 5) + 1;
        const firstCardText = cardRanks[this.firstCardRank];
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
            "And we got "
            + aOrAn(firstCardText)
            + "! Fishing with the "
            + firstCardText
            + " or rolling back, traveller?"
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
                        ...settings.cardPositions.deckUnfolded6[i],
                    });
                }
            },
            ...settings.cardPositions.deckUnfolded6[0],
        });
        timeline.play();
        const firstCardText = cardRanks[this.firstCardRank];
        if (this.playersChoice == 1) {
            this.typewrite(
                "Okay, pulling out! And we're fishing with the "
                + firstCardText
                + ", "
                + phrasesMixing[
                    Math.floor(Math.random() * phrasesMixing.length)
                ]
                + " and "
                + phrasesMixing[
                    Math.floor(Math.random() * phrasesMixing.length)
                ]
                + "... Now pick a card!"
            );
        }
        else {
            this.typewrite(
                "Okay, "
                + phrasesMixing[
                    Math.floor(Math.random() * phrasesMixing.length)
                ]
                + "! Cats in the house! And we're rolling back with the "
                + firstCardText
                + "! Rolling, rolling... Now pick a card!"
            );
        }
    }

    playRepeat() {
        const secondCardRank = getSecondCardRank(
            this.firstCardRank,
            this.playersChoice,
        );
        const secondCardText = cardRanks[secondCardRank];
        let winAmount = 0;
        let winText = "dryout";
        let playAgainText = (
            "! Bad luck, roamer. Chance at a catback and play again?"
            + "\n[Tap to bet 100c.]"
        );
        if (
            secondCardRank - this.firstCardRank == this.playersChoice
            && (secondCardRank - 3) ** 2 == 9
        ) {
            winAmount = 600;
            winText = "full six";
            playAgainText = (
                "! Holy crap! Close stroke gets the girl! 600 Cats!"
                + " Going for a hot chain, outlander? Play again?"
                + "\n[Tap to bet 100c.]"
            );
        }
        else if (
            (secondCardRank - this.firstCardRank) * this.playersChoice > 0
        ) {
            winAmount = 200;
            winText = "clean lick";
            playAgainText = (
                "! 200 Cats, congratulations, drifter... Playing again?"
                + "\n[Tap to bet 100c.]"
            );
        }
        if (this.score + winAmount < 100) {
            playAgainText = (
                "! Bad luck, roamer. Come back when you have more cats."
                + "\nNext player!"
            );
            this.stage = Stage.GameOver;
        }
        this.tweens.add({
            targets: this.cardsInGame.hand[1],
            duration: 500,
            onComplete: () => {
                this.cardsInGame.hand[1].setFrame(secondCardRank);
                this.cardsInGame.hand[1].setDepth(50);
                this.updateScore(winAmount);
                this.inputAllowed = true;
            },
            ease: "Cubic.easeOut",
            ...settings.cardPositions.hand[1],
        });
        this.typewrite(
            "And it's "
            + aOrAn(winText)
            + " with "
            + aOrAn(secondCardText)
            + playAgainText
        );
    }

    playGameOver() {
        this.typewrite(
            "You have nothing left to bet. Come back when you have more cats."
            + "\nNext player!\n[Refresh the page to reset the game]"
        );
        this.inputAllowed = true;
    }

    updateScore(amount) {
        if (amount == 0) {
            return;
        }
        this.score += amount;
        let scoreText = this.score.toString();
        for (let i = 2; i < 5; i++) {
            if (scoreText.length < i) {
                scoreText = " " + scoreText;
            }
        }
        scoreText += "  ";
        let amountText = amount.toString();
        let style = null;
        if (amount >= 0) {
            style = settings.text.scoreUp.style;
            amountText = "+" + amountText;
        }
        else {
            style = settings.text.scoreDown.style;
        }
        let floatingText = this.add.text(
            settings.text.scoreDisplay.x,
            settings.text.scoreDisplay.y,
            amountText,
            style,
        );
        floatingText.setDepth(90);
        this.tweens.add({
            targets: floatingText,
            duration: 1000,
            y: settings.text.scoreDisplay.y + 150,
            onStart: () => {
                this.scoreDisplay.text = scoreText;
            },
            onComplete: () => {
                floatingText.destroy();
            },
        });
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


function getSecondCardRank(firstCardRank, playersChoice) {
    const chances = settings.chances;
    let sectors = [];
    let totalChance = 0;
    let chance = 0;
    if (firstCardRank - 2 * playersChoice == 3) {
        // Player tries to win the jackpot.
        if (playersChoice == -1) {
            sectors.push(chances.jackpot);
            totalChance += chances.jackpot;
        }
        for (let i = 0; i < 5; i++) {
            sectors.push(chances.lose);
            totalChance += chances.lose;
        }
        if (playersChoice == 1) {
            sectors.push(chances.jackpot);
            totalChance += chances.jackpot;
        }
    }
    else {
        chance = playersChoice == -1 ? chances.win : chances.lose;
        for (let i = 0; i < firstCardRank; i++) {
            sectors.push(chance);
            totalChance += chance;
        }
        chance = chances.win + chances.lose - chance;
        for (let i = firstCardRank; i < 6; i++) {
            sectors.push(chance);
            totalChance += chance;
        }
    }
    chance = Math.random() * totalChance;
    for (let rank = 0; rank < 6; rank++) {
        chance -= sectors[rank];
        if (chance < 0) {
            return rank + (rank >= firstCardRank);
        }
    }
    return 6;
}


function aOrAn(text) {
    if (["a", "e", "i", "o", "u"].includes(text[0])) {
        return "an " + text;
    }
    return "a " + text;
}


class showRules extends Phaser.Scene {
    constructor() {
        super("ShowRules");
    }

    create() {
        let text = (
            "1. The first rule of Catcrawlers: Don't try to play Catcrawlers."
            + " No, you've gotta breathe Catcrawlers, feel it in your bones."
            + " Don't even attempt to tug those digits"
            + " 'til you've charged those wedgers,"
            + " because you sure as hell can't lick a SPADE"
            + " 'til you've understood the stone die on a spiritual level."
            + " Yes, the depth of Catcrawlers will be beyond most"
            + " in these outlands."
            + "\n2. Serious this time. The goal is to figure out the rules."
            + " The dealer tries to confuse you and get some easy cats."
            + " But when you understand the rules,"
            + " you will start winning more that you lose."
            + "\n3. If you still want the explanation,"
            + " it's easy to find on the Internet."
            + ' Just search "Catcrawlers rules".'
            + "\n[Tap to return to main menu.]"
        );
        let textBox = this.add.text(
            settings.resolution / 2,
            settings.resolution / 2,
            text,
            settings.text.infoBox.style,
        )
        textBox.setOrigin(0.5, 0.5);
        this.input.on(
            "pointerup",
            () => {this.scene.start("MainMenu");},
            this,
        );
    }
}


class showCopyright extends Phaser.Scene {
    constructor() {
        super("ShowCopyright");
    }

    create() {
        let text = (
            "This mini-game has been implemented by a Kenshi(TM) fan"
            + " for non-commercial purposes."
            + " It is a visualization of a mini-game"
            + " already existing inside the game of Kenshi (by Lo-Fi Games)."
            + ' Copyrights for the mini-game title ("Catcrawlers")'
            + ", the dealer species and dialog belong to Lo-Fi Games."
            + " The implementation author is not affiliated with Lo-Fi Games."
            + "\nAuthor: Evgenii Denisov a.k.a. el71Gato."
            + "\n[Tap to return to main menu.]"
        );
        let textBox = this.add.text(
            settings.resolution / 2,
            settings.resolution / 2,
            text,
            settings.text.infoBox.style,
        )
        textBox.setOrigin(0.5, 0.5);
        this.input.on(
            "pointerup",
            () => {this.scene.start("MainMenu");},
            this,
        );
    }
}
