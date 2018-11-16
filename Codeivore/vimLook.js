var myFont;
function preload() {
  myFont = loadFont('droid.ttf');
  numberFont = loadFont('DroidSansMono.ttf');
}

var textAnimation = "Hello, welcome to Codeviore!";
var index = 0;
var currString = "";
var cursorWidth;
var invisible = false;
var currBlink = 0;
var maxBlink = 8;

var startLineGo = 0;
var normalEnd = 21;
var startLineStop = 30;

function setup() {
	createCanvas(windowWidth,windowHeight);
	frameRate(10);
}

function draw() {
	clear();
	background(46,43,43);
	var numberHeight = 25;
	var numFit = Math.floor(windowHeight / numberHeight);

	fill(230,230,230);
	textSize(15);
	textFont( numberFont );
	text('		 1', 0, 25);
	for( var i = 1 ; i < numFit - 2; ++i ) {
		text('	~', 0 , numberHeight * (i + 1));
	}

	if( startLineGo < startLineStop ) {
		if( startLineGo < normalEnd ) {
			var barThickness = 21;
			var barHeight = windowHeight - 2 * barThickness;
			var shortBarWidth = 110;
			fill(132,132,132);
			rect(0, barHeight, windowWidth, barThickness);
			noStroke();
			fill(47,226,70);
			rect(0, barHeight, shortBarWidth, barThickness);
			triangle(shortBarWidth,barHeight,shortBarWidth,barHeight + barThickness,
					 shortBarWidth + 20, barHeight + barThickness/2);
			fill(23,135,38);
			textSize(20);
			textFont(myFont);
			text('NORMAL', 16, barHeight + 18);
			startLineGo++;
		}
		else {
			var barThickness = 21;
			var barHeight = windowHeight - 2 * barThickness;
			var shortBarWidth = 110;
			fill(31,129,222);
			rect(0, barHeight, windowWidth, barThickness);
			noStroke();
			fill(255,255,255);
			rect(0, barHeight, shortBarWidth, barThickness);
			triangle(shortBarWidth,barHeight,shortBarWidth,barHeight + barThickness,
					 shortBarWidth + 20, barHeight + barThickness/2);
			fill(31,129,222);
			textSize(20);
			textFont(myFont);
			text('INSERT', 16, barHeight + 18);
			startLineGo++
		}
		currBlink++;
		if( currBlink == maxBlink ) {
			currBlink = 0;
			invisible = !invisible;
		}
		if( invisible ) {
			fill(46,43,43);
		}
		else {
			fill(230,230,230);
		}
		rect(80, 10, 10.2, 18);
	}
	else {
		if( startLineGo == startLineStop ) {
			startLineGo++;
			currBlink = 0;
		}
		var barThickness = 21;
		var barHeight = windowHeight - 2 * barThickness;
		var shortBarWidth = 110;
		fill(31,129,222);
		rect(0, barHeight, windowWidth, barThickness);
		noStroke();
		fill(255,255,255);
		rect(0, barHeight, shortBarWidth, barThickness);
		triangle(shortBarWidth,barHeight,shortBarWidth,barHeight + barThickness,
				 shortBarWidth + 20, barHeight + barThickness/2);
		fill(31,129,222);
		textSize(20);
		textFont(myFont);
		text('INSERT', 16, barHeight + 18);


		if( index < textAnimation.length) {
			fill(230,230,230);
			textSize(17);
			textFont(numberFont);
			currString += textAnimation.charAt(index);
			text(currString, 80, 25);
			cursorWidth = textWidth(textAnimation.substring(1,2));
			rect(80 + textWidth(currString), 10, cursorWidth, 18);
			index++;
		}
		else {
			fill(230,230,230);
			textSize(17);
			textFont(numberFont);
			text(textAnimation, 80,25);
			currBlink++;
			if( currBlink == maxBlink ) {
				currBlink = 0;
				invisible = !invisible;
			}
			if( invisible ) {
				fill(46,43,43);
			}
			else {
				fill(230,230,230);
			}
			rect(80 + textWidth(currString), 10, cursorWidth , 18);
		}
	}
}

function windowResize() {
	resizeCanvas(windowWidth, windowHeight);
}