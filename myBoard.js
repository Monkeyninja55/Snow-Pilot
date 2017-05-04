//Kush Patel
//Project 1
//CMSC 437

var game = new Game();
myWASD = {
  83: 'down',
  87: 'up',
  65: 'left',
  32: 'space',
  68: 'right',
};

var spriteStore = new function() {
	this.myPilot = new Image();
	this.lazerShot = new Image();
	this.background = new Image();
	this.badShip = new Image();
	this.badShipLazer = new Image();

	var prepNum = 0;
	var spriteNum = 5;
	this.myPilot.src = "file:///C:/Users/Kush/Pictures/dagger.png";
	this.lazerShot.src = "file:///C:/Users/Kush/Pictures/lazer1.png";
	this.background.src = "file:///C:/Users/Kush/Downloads/Ice_Planet_Hoth_by_archangel72367.jpg";
	this.badShip.src = "file:///C:/Users/Kush/Pictures/surveillance%20drone.png";
	this.badShipLazer.src = "file:///C:/Users/Kush/Pictures/lazer2.png";
	
	function prepSprite() {
		prepNum++;
		if (prepNum == spriteNum)
			window.initialize();
	}
	this.myPilot.onload = function()
	{ prepSprite(); };
	
	this.lazerShot.onload = function()
	{ prepSprite(); };
	
	this.background.onload = function()
	{ prepSprite(); };
	
	this.badShip.onload = function()
	{ prepSprite(); };
	
	this.badShipLazer.onload = function()
	{ prepSprite(); };
}();

function createSprite() {
	this.move = function() {};
	this.draw = function() {};	
	this.canvasWidth = 0;
	this.spriteName = "";
	this.canvasHeight = 0;
	this.goingToHit = function(element)
	{ return (this.canHit == element.spriteName); };

	this.speed = 0;
	this.canHit = "";
	this.willHit = false;
	this.initialize = function(x, y, width, height) {
		this.width = width;
		this.height = height;
		this.y = y;
		this.x = x;
	};
}

function myLazer(myElement) {
	this.startAnimate = false; 
	var self = myElement;
	this.draw = function() {
		this.context.clearRect(this.x-2, this.y-2, this.width+3, this.height+3);
		this.y -= this.speed;

		if (this.willHit)
		{ return true; }
		else if (this.y >= this.canvasHeight && self === "badShipLazer")
		{ return true; }
		else if (this.y <= 0 - this.height && self === "lazerShot")
		{ return true; }
		else {
			if (self === "lazerShot")
			{ this.context.drawImage(spriteStore.lazerShot, this.x, this.y); }
			else if (self === "badShipLazer")
			{ this.context.drawImage(spriteStore.badShipLazer, this.x, this.y); }
			return false;
		}
	};

	this.createAi = function(speed, x, y) {
		this.startAnimate = true;
		this.x = x;
		this.speed = speed;
		this.y = y;
	};
	this.clear = function() {
		this.startAnimate = false;
		this.y = 0;
		this.willHit = false;
		this.x = 0;
		this.speed = 0;
	};
}
myLazer.prototype = new createSprite();

function outerRim() {
	this.draw = function() {
		this.context.drawImage(spriteStore.background, this.x, this.y);
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
	this.speed = 0;
}
outerRim.prototype = new createSprite();

function levelLayout(backDrop, levElem) {
	this.bucket = [];
	var fullElem = 10;
	var level = levElem || 0;
	this.levelLim = backDrop || { x: 0, y: 0, width: 0, height: 0 };
	var myElement = [];
	var fullMode = 5;

	this.findObjects = function(sendElem, elements) {
		var index = this.getIndex(elements);
		if (typeof elements === "undefined") {
			console.log("Try Again");
			return;
		}
		if (index != -1 && this.bucket.length)
			this.bucket[index].findObjects(sendElem, elements);
		for (var i = 0, len = myElement.length; i < len; i++)
		{ sendElem.push(myElement[i]); }
		return sendElem;
	};

	this.getAllObjects = function(sendElem) {
		for (var i = 0; i < this.bucket.length; i++)
		{ this.bucket[i].getAllObjects(sendElem); }
		for (var i = 0, len = myElement.length; i < len; i++)
		{ sendElem.push(myElement[i]); }
		return sendElem;
	};

	this.insert = function(elements) {
		if (elements instanceof Array) {
			for (var i = 0, len = elements.length; i < len; i++)
			{ this.insert(elements[i]); }
			return;
		}
		if (typeof elements === "undefined")
		{ return; }
		if (this.bucket.length) {
			var index = this.getIndex(elements);
			if (index != -1) {
				this.bucket[index].insert(elements);
				return;
			}
		}
		myElement.push(elements);

		if (myElement.length > fullElem && level < fullMode) {
			var i = 0;
			if (this.bucket[0] == null)
				this.split();
			while (i < myElement.length) {
				var index = this.getIndex(myElement[i]);
				if (index != -1)
				{ this.bucket[index].insert((myElement.splice(i,1))[0]); }
				else
				{ i++; }
			}
		}
	};

	this.split = function() {
		var splitWidth = (this.levelLim.width / 1.3) || 0;
		var splitHeight = (this.levelLim.height / 1.3) || 0;
		this.bucket[2] = new levelLayout({
			y: this.levelLim.y + splitHeight,
			x: this.levelLim.x,
			width: splitWidth,
			height: splitHeight
		},
		level + 1);
		
		this.bucket[0] = new levelLayout({
			y: this.levelLim.y,
			x: this.levelLim.x + splitWidth,
			width: splitWidth,
			height: splitHeight
		},
		level + 1 );
		this.bucket[3] = new levelLayout({
			y: this.levelLim.y + splitHeight,
			x: this.levelLim.x + splitWidth,
			width: splitWidth,
			height: splitHeight
		},
		level + 1);
		this.bucket[1] = new levelLayout({
			y: this.levelLim.y,
			x: this.levelLim.x,
			width: splitWidth,
			height: splitHeight
		},
		level + 1);
	};
	
	this.getIndex = function(elements) {
		var backCenter = this.levelLim.y + this.levelLim.height / 1.3;
		var frontCenter = (elements.y + elements.height < backCenter && elements.y < backCenter);
		var index = -1;

		var upCenter = this.levelLim.x + this.levelLim.width / 1.3;
		var downCenter = (elements.y > backCenter);
		if (elements.x + elements.width < upCenter && elements.x < upCenter) {
			if (frontCenter)
			{ index = 1; }
			else if (downCenter)
			{ index = 2; }
		}
		else if (elements.x > upCenter) {
			if (frontCenter)
			{ index = 0; }
			else if (downCenter)
			{ index = 3; }
		}
		return index;
	};

	this.clear = function() {
		myElement = [];
		for (var i = 0; i < this.bucket.length; i++)
		{ this.bucket[i].clear(); }
		this.bucket = [];
	};
}

function fullWave(fullMem) {
	var size = fullMem; 
	var sound = [];
	this.get= function(speed, x, y) {
		if(!sound[size - 1].startAnimate) {
			sound[size - 1].createAi(speed, x, y);
			sound.unshift(sound.pop());
		}
	};
	this.createWave = function() {
		var elements = [];
		for (var i = 0; i < size; i++) {
			if (sound[i].startAnimate)
				elements.push(sound[i]);
		}
		return elements;
	};

	this.initialize = function(object) {
		if (object == "badShip") {
			for (var i = 0; i < size; i++) {
				var badShip = new rivalShips();
				badShip.initialize(0,0, spriteStore.badShip.width, spriteStore.badShip.height);
				sound[i] = badShip;
			}
		}
		else if (object == "lazerShot") {
			for (var i = 0; i < size; i++) {
				var lazerShot = new myLazer("lazerShot");
				lazerShot.initialize(0,0, spriteStore.lazerShot.width, spriteStore.lazerShot.height);
				lazerShot.canHit = "badShip";
				lazerShot.spriteName = "lazerShot";
				sound[i] = lazerShot;
			}
		}
		else if (object == "badShipLazer") {
			for (var i = 0; i < size; i++) {
				var lazerShot = new myLazer("badShipLazer");
				lazerShot.initialize(0,0, spriteStore.badShipLazer.width, spriteStore.badShipLazer.height);
				lazerShot.canHit = "myPilot";
				lazerShot.spriteName = "badShipLazer";
				sound[i] = lazerShot;
			}
		}
	};
	this.createSpeed = function(speed1, x1, y1, speed2, x2, y2) {
		if(!sound[size - 2].startAnimate && !sound[size - 1].startAnimate ) {
			this.get(speed1, x1, y1);
			this.get(speed2, x2, y2);
		}
	};
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			if (sound[i].startAnimate) {
				if (sound[i].draw()) {
					sound[i].clear();
					sound.push((sound.splice(i,1))[0]);
				}
			}
			else
			{ break;}
		}
	};
}

function rivalShips() {
	this.spriteName = "badShip";
	var didHit = 0;
	this.startAnimate = false;
	var fireRate = 0.005;
	this.canHit = "lazerShot";

	this.createAi = function(speed, x, y) {
		this.startAnimate = true;
		this.x = x;
		this.speed = speed;
		this.y = y;
		this.leftEdge = this.x - 100;
		this.speedX = 0;
		this.rightEdge = this.x + 100;
		this.bottomEdge = this.y + 200;
		this.speedY = speed;
	};

	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		this.x += this.speedX;
		this.y += this.speedY;
		
		if (this.x <= this.leftEdge) {
			this.speedX = this.speed;
		}
		else if (this.x >= this.rightEdge + this.width) {
			this.speedX = -this.speed;
		}
		else if (this.y >= this.bottomEdge) {
			this.speed = 1.2;
			this.speedX = -this.speed;
			this.y -= 6;
			this.speedY = 0;
		}

		if (!this.willHit) {
			this.context.drawImage(spriteStore.badShip, this.x, this.y);
			didHit = Math.floor(Math.random()*95);
			if (didHit/95 < fireRate)
				this.fire();
			return false;
		}
		else {
			game.myPoints += 500;
			game.explosion.get();
			return true;
		}
	};
	this.fire = function()
	{ game.badShipList.get(-5, this.x+this.width/1.2, this.y+this.height); };
	this.clear = function() {
		this.startAnimate = false;
		this.x = 0;
		this.speed = 0;
		this.y = 0;
		this.speedX = 0;
		this.willHit = false;
		this.speedY = 0;
	};
}
rivalShips.prototype = new createSprite();

function Ship() {
	var counter = 0;
	this.canHit = "badShipLazer";
	this.myList = new fullWave(50);
	var fireRate = 10;
	this.speed = 10;
	this.spriteName = "myPilot";

	this.initialize = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.startAnimate = true;
		this.willHit = false;
		this.myList.initialize("lazerShot");
	};

	this.move = function() {
		counter++;
		if (wasdCode.right || wasdCode.up || wasdCode.left ||  wasdCode.down) {
			this.context.clearRect(this.x, this.y, this.width, this.height);
			if (wasdCode.right) {
				this.x += this.speed;
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			}
			else if (wasdCode.up) {
				this.y -= this.speed;
				if (this.y <= this.canvasHeight/10*5)
					this.y = this.canvasHeight/10*5;
			}
			else if (wasdCode.left) {
				this.x -= this.speed;
				if (this.x <= 0) 
					this.x = 0;
			}
			else if (wasdCode.down) {
				this.y += this.speed;
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
		}

		if (wasdCode.space && counter >= fireRate && !this.willHit) {
			this.fire();
			counter = 0;
		}
		if (!this.willHit) {
			this.draw();
		}
		else {
			this.startAnimate = false;
			game.endOfLev();
		}
	};
	this.draw = function()
	{ this.context.drawImage(spriteStore.myPilot, this.x, this.y); };
	this.fire = function() {
		this.myList.createSpeed(9, this.x+5, this.y, 9, this.x+35, this.y);
		game.lazer.get();
	};
}
Ship.prototype = new createSprite();

function Game() {
	this.initialize = function() {
		this.createOuter = document.getElementById('outerRim');
		this.createRim = document.getElementById('myRim');
		this.createInner = document.getElementById('innerRim');

		if (this.createOuter.getContext) {
			this.rimCanvas = this.createRim.getContext('2d');
			this.innerCanvas = this.createInner.getContext('2d');
			this.outerCanvas = this.createOuter.getContext('2d');
			outerRim.prototype.context = this.outerCanvas;
			outerRim.prototype.canvasWidth = this.createOuter.width;
			outerRim.prototype.canvasHeight = this.createOuter.height;

			rivalShips.prototype.context = this.innerCanvas;
			rivalShips.prototype.canvasWidth = this.createInner.width;
			rivalShips.prototype.canvasHeight = this.createInner.height;
			Ship.prototype.context = this.rimCanvas;
			Ship.prototype.canvasWidth = this.createRim.width;
			Ship.prototype.canvasHeight = this.createRim.height;

			myLazer.prototype.context = this.innerCanvas;
			myLazer.prototype.canvasWidth = this.createInner.width;
			myLazer.prototype.canvasHeight = this.createInner.height;
			this.ship = new Ship();
			this.shipStartX = this.createRim.width/2 - spriteStore.myPilot.width;
			this.badShipArray = new fullWave(12);
			this.badShipArray.initialize("badShip");

			this.shipStartY = this.createRim.height/4*3 + spriteStore.myPilot.height*2;
			this.ship.initialize(this.shipStartX, this.shipStartY, spriteStore.myPilot.width, spriteStore.myPilot.height);
			this.enemyNum();
			this.badShipList = new fullWave(45);
			this.badShipList.initialize("badShipLazer");
			this.myPoints = 0;
			this.background = new outerRim();
			this.background.initialize(0,0);
			this.levelLay = new levelLayout({x:0,y:0,width:this.createInner.width,height:this.createInner.height});

			this.lazer = new audioWave(10);
			this.lazer.initialize("lazerShot");
			this.explosion = new audioWave(20);
			this.explosion.initialize("explosion");
			this.endingSound = new Audio("file:///C:/Users/Kush/Documents/GameSound/sounds/bigboom.mp3");
			this.endingSound.loop = true;
			this.endingSound.volume = 0.12;
			this.endingSound.load();
			this.checkAudio = window.setInterval(function()
			{ checkReadyState(); }, 666);
		}
	};
	this.start = function() {
		this.ship.draw();
		animate();
	};
	this.enemyNum = function() {
		var x = 100;
		var height = spriteStore.badShip.height;
		var width = spriteStore.badShip.width;
		var y = -height;
		var enemyDist = y * 1.2;

		for (var i = 1; i <= 12; i++) {
			this.badShipArray.get(2, x, y);
			x += width + 30;
			if (i % 6 === 0) {
				x = 100;
				y += enemyDist;
			}
		}
	};
	this.endOfLev = function() {
		document.getElementById('restart').style.display = "block";
		this.endingSound.currentTime = 0;
		this.endingSound.play();
	};
	this.restart = function() {
		document.getElementById('restart').style.display = "none";
		this.rimCanvas.clearRect(0, 0, this.createRim.width, this.createRim.height);
		this.outerCanvas.clearRect(0, 0, this.createOuter.width, this.createOuter.height);
		this.innerCanvas.clearRect(0, 0, this.createInner.width, this.createInner.height);
		this.levelLay.clear();
		this.background.initialize(0,0);

		this.badShipArray.initialize("badShip");
		this.ship.initialize(this.shipStartX, this.shipStartY, spriteStore.myPilot.width, spriteStore.myPilot.height);
		this.enemyNum();
		this.badShipList.initialize("badShipLazer");
		this.endingSound.pause();
		this.myPoints = 0;
		this.start();
	};
}

function audioWave(fullMem) {
	var sound = [];
	this.sound = sound;
	var size = fullMem; 
	var myAudio = 0;
	this.get = function() {
		if(sound[myAudio].ended || sound[myAudio].currentTime === 0)
			sound[myAudio].play();
		myAudio = (1 + myAudio) % size;
	};

	this.initialize = function(object) {
		if (object == "lazerShot") {
			for (var i = 0; i < size; i++) {
				lazer = new Audio("file:///C:/Users/Kush/Documents/GameSound/sounds/laser.wav.mp3");
				lazer.load();
				sound[i] = lazer;
			}
		}
		else if (object == "explosion") {
			for (var i = 0; i < size; i++) {
				var explosion = new Audio("file:///C:/Users/Kush/Documents/GameSound/sounds/explosion4.mp3");
				explosion.volume = 0.1;
				explosion.load();
				sound[i] = explosion;
			}
		}
	};
}

function checkReadyState() {
	if (game.endingSound.readyState === 4) {
		window.clearInterval(game.checkAudio);
		document.getElementById('preping').style.display = "none";
		game.start();
	}
}

function animate() {
	document.getElementById('points').innerHTML = game.myPoints;
	game.levelLay.clear();
	game.levelLay.insert(game.badShipArray.createWave());
	game.levelLay.insert(game.ship);
	game.levelLay.insert(game.badShipList.createWave());
	game.levelLay.insert(game.ship.myList.createWave());
	checkHit();

	if (game.badShipArray.createWave().length === 0)
		game.enemyNum();
	if (game.ship.startAnimate) {
		requestAnimFrame( animate );
		game.background.draw();
		game.badShipList.animate();
		game.ship.move();
		game.badShipArray.animate();
		game.ship.myList.animate();
	}
}

function checkHit() {
	var myElement = [];
	game.levelLay.getAllObjects(myElement);
	
	for (var x = 0, len = myElement.length; x < len; x++) {
		game.levelLay.findObjects(elements = [], myElement[x]);
		for (y = 0, length = elements.length; y < length; y++) {
			if ((myElement[x].y + myElement[x].height > elements[y].y && myElement[x].x + myElement[x].width > elements[y].x && myElement[x].x < elements[y].x + elements[y].width && myElement[x].y < elements[y].y + elements[y].height) && myElement[x].canHit === elements[y].spriteName) {
				elements[y].willHit = true;
				myElement[x].willHit = true;
			}
		}
	}
}

wasdCode = {};
for (code in myWASD) {
  wasdCode[myWASD[code]] = false;
}
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (myWASD[keyCode]) {
    e.preventDefault();
    wasdCode[myWASD[keyCode]] = false;
  }
}
document.onkeydown = function(e) {
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (myWASD[keyCode]) {
		e.preventDefault();
    wasdCode[myWASD[keyCode]] = true;
  }
}

window.requestAnimFrame = (function()
{
	return	window.webkitRequestAnimationFrame ||
			window.requestAnimationFrame       ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			window.mozRequestAnimationFrame    ||

			function(callback, dummy)
			{ window.setTimeout(callback, 666); };
})();

function initialize()
{ game.initialize(); }

