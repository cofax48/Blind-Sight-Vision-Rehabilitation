import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import controlP5.*;
import ddf.minim.*;

final String APP_VER_STR = "0.1.4";

AudioPlayer toggleSound;
AudioPlayer proximitySound;

PrintWriter outputFile;
ControlP5 cp5;

int targetSize = 200;
int targetX;
int targetY;
int blink = 0;

color targetColor1 = color(0);
color targetColor2 = color(255);
color bkColor = color(30);

int screenSizeX;
int screenSizeY;

int sessionStartTime = 0;
int lastToggleTime = 0;
int lastProximityTime = 0;
int lastLogPosTime = 0;

boolean inverted = false;
boolean checker = false;

float maxDistance;

public enum AppState { SETUP, INTRO, SESSION, OUTRO }
AppState appState = AppState.SETUP;

String dateTimeStr;
String fileName;
String userName;
String administratorName;
String userNotes;

String statusText = "";

//
boolean feebackEnabled = false;
void enableFeedback(boolean enabled)
{
	if (enabled)
	{
		feebackEnabled = true;
		proximitySound.loop();
	}
	else
	{
		feebackEnabled = false;
		proximitySound.pause();
		enableVibrator(false);
	}
}

//
void mousePressed()
{
	if (appState == AppState.SESSION && millis() - sessionStartTime > 3000)
	{
		if (!feebackEnabled)
			enableFeedback(true);
		else if (getVibratorEnabled())
			enableFeedback(false);
	}
}

//
void writePos(float x, float y)
{
	outputFile.println((int)x + "," + (int)(screenSizeY - y) +  ",");
}

//this is effectively a new trial in the same session
void setNewTargetPos()
{
	outputFile.println("//Trial Begin =-=--=-=-==-=-=-=-=-=-");
	targetX = int(random(screenSizeX - targetSize)) + targetSize / 2;
	targetY = int(random(screenSizeY - targetSize)) + targetSize / 2;

    int halfSize = targetSize/2;

	//write out screen border loop
	writePos(0, screenSizeY);
	writePos(0, 0);
	writePos(screenSizeX, 0);
	writePos(screenSizeX, screenSizeY);
	writePos(0, screenSizeY);

	//write out target border loop
	writePos(targetX - halfSize, targetY - halfSize);
	writePos(targetX + halfSize, targetY - halfSize);
	writePos(targetX + halfSize, targetY + halfSize);
	writePos(targetX - halfSize, targetY + halfSize);
	writePos(targetX - halfSize, targetY - halfSize);
}

//
void showIntroScreen()
{
	statusText = "";
	appState = AppState.INTRO;
	PFont font = createFont("arial", 20);

	cp5 = new ControlP5(this);

	cp5.addTextfield("user_name")
		.setPosition(100,100)
		.setSize(200,40)
		.setFont(font)
		.setFocus(true)
		.setColor(255)
		.setAutoClear(false)
		.setCaptionLabel("Enter Name:")
        .getCaptionLabel().align(ControlP5.LEFT, ControlP5.TOP_OUTSIDE)
		;

	cp5.addBang("begin_btn")
		.setPosition(240,170)
		.setSize(80,40)
		.setFont(font)
        .setCaptionLabel("BEGIN")
		.getCaptionLabel().align(ControlP5.CENTER, ControlP5.CENTER)
		;
}

//
void showOutroScreen()
{
	statusText = "";
	appState = AppState.OUTRO;
	PFont font = createFont("arial", 20);

	cp5 = new ControlP5(this);

	cp5.addTextfield("administrator_name")
		.setPosition(100,300)
		.setSize(200,40)
		.setFont(font)
		.setFocus(false)
		.setColor(255)
		.setAutoClear(false)
		.setCaptionLabel("Enter Administrator Name:")
        .getCaptionLabel().align(ControlP5.LEFT, ControlP5.TOP_OUTSIDE)
		;

	cp5.addTextfield("user_notes")
		.setPosition(100,400)
		.setSize(400, 40)
		.setFont(font)
		.setFocus(false)
		.setColor(255)
		.setAutoClear(false)
        .setCaptionLabel("Enter Notes:")
        .getCaptionLabel().align(ControlP5.LEFT, ControlP5.TOP_OUTSIDE)
		;

	cp5.addBang("send_btn")
		.setPosition(240,470)
		.setSize(100,40)
		.setFont(font)
        .setCaptionLabel("SEND")
		.getCaptionLabel().align(ControlP5.CENTER, ControlP5.CENTER)
		;

	cp5.addBang("discard_btn")
        .setColor(new CColor().setForeground(0xffaa0000))
		.setPosition(240,600)
		.setSize(100,40)
		.setFont(font)
        .setCaptionLabel("DISCARD")
		.getCaptionLabel().align(ControlP5.CENTER, ControlP5.CENTER)
		;
}

//
void clearCP5()
{
	List list = cp5.getAll();
	for (Object controller:list)
		((ControllerInterface)controller).remove();
}

//
void begin_btn()
{
	userName = cp5.get(Textfield.class,"user_name").getText();
	clearCP5();
    beginSession();
}

//
void send_btn()
{
	administratorName = cp5.get(Textfield.class,"administrator_name").getText();
	userNotes = cp5.get(Textfield.class,"user_notes").getText();
	clearCP5();
    thread("outroThread");
}

//
void discard_btn()
{
	outputFile.flush(); // Writes the remaining data to the file
	outputFile.close(); // Finishes the file
	exit(); // Stops the program
}

//
void setupThread()
{
    statusText = "Loading Sounds";
	Minim minim = new Minim(this);
    toggleSound = minim.loadFile("adbildep.wav");
    proximitySound = minim.loadFile("Select.wav");

	String portName = getArduinoPort();
	arduinoPort = new Serial(this, portName, 115200);

    statusText = "creating positions log file";
    fileName = "positions_" + dateTimeStr + ".csv";
	outputFile = createWriter(fileName);

 	setNewTargetPos();

	maxDistance = sqrt(sq(screenSizeX) + sq(screenSizeY));

	noLoop();
	showIntroScreen();
	loop();
}

//
void setup()
{
    fullScreen();
	screenSizeX = width;
	screenSizeY = height;

	Date date = new Date();
	DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd_HHmm");
	dateTimeStr = dateFormat.format(date);

    thread("setupThread");
}

//
void beginSession()
{
	statusText = "";
    sessionStartTime = millis();
    appState = AppState.SESSION;
    enableFeedback(true);
}

//
void outroThread()
{
	statusText = "preparing csv file";
	outputFile.flush(); // Writes the remaining data to the file
	outputFile.close(); // Finishes the file
	statusText = "preparing email";
    sendMail();
	exit(); // Stops the program
}

//
void endSession()
{
	enableFeedback(false);
	enableLight(false);
	showOutroScreen();
}

//
void keyPressed()
{
    if (appState == AppState.SESSION)
    {
		//end session
		if ((key >= 'a' && key <= 'z') ||
			(key >= '0' && key <= '9') ||
			key == ESC ||
			key == ' ')
		{
			endSession();
		}

		if (key == 'C')
			checker = !checker;

		if (keyCode == UP)
			targetSize *= 2;

		if (keyCode == DOWN)
			targetSize /= 2;

		if (keyCode == LEFT)
			setNewTargetPos();
	}

	//disable built-in escape quitting program
	if (key == ESC)
		key = 0;
}

//
final int toggleInterval = 500;
final int logPosInterval = 300;
float prevMouseX = 0, prevMouseY = 0;
void drawSession()
{
    int halfSize = targetSize/2;
	background(bkColor);

	if (millis() - lastToggleTime > toggleInterval)
	{
		inverted = !inverted;
		lastToggleTime = millis();

		if (inverted)
			enableLight(!lightEnabled);

		toggleSound.rewind();
		toggleSound.play();
	}

	if (checker)
	{
		fill(inverted ? targetColor2 : targetColor1);
		rect(targetX - halfSize, targetY - halfSize, halfSize, halfSize);
		rect(targetX, targetY, halfSize, halfSize);

		fill(inverted ? targetColor1 : targetColor2);
		rect(targetX, targetY - halfSize, halfSize, halfSize);
		rect(targetX - halfSize, targetY, halfSize, halfSize);
	}
	else
	{
		fill(inverted ? targetColor2 : targetColor1);
		rect(targetX - halfSize, targetY - halfSize, targetSize, targetSize);
	}

    float dx = max(abs(targetX - mouseX) - halfSize, 0);
    float dy = max(abs(targetY - mouseY) - halfSize, 0);
	float dist = sqrt(sq(dx) + sq(dy));
	float proximityFrequency;

	float normalizedDist = dist / maxDistance;

	if (normalizedDist == 0.0)
		proximityFrequency = 15;
	else if (normalizedDist < 0.1)
		proximityFrequency = 6;
	else if (normalizedDist < 0.15)
		proximityFrequency = 4;
	else if (normalizedDist < 0.2)
		proximityFrequency = 3.5;
	else if (normalizedDist < 0.25)
		proximityFrequency = 3;
	else if (normalizedDist < 0.3)
		proximityFrequency = 2.5;
	else if (normalizedDist < 0.4)
		proximityFrequency = 2;
	else if (normalizedDist < 0.5)
		proximityFrequency = 1;
	else
		proximityFrequency = 0.5;

	int proximityInterval = int(1000.0f / proximityFrequency);

	/*
	//debug info on screen
	textSize(32);
	text(normalizedDist, 10, 30);
	text(proximityFrequency, 10, 70);
	text(proximityInterval, 10, 110);
	*/

	proximitySound.setLoopPoints(0, proximityInterval);

	enableVibrator(feebackEnabled && (dist == 0));

	//only save mouse pos when changes and enough time has passed
	if ((mouseX != prevMouseX || mouseY != prevMouseY) && (millis() - lastLogPosTime > logPosInterval))
	{
		writePos(mouseX, mouseY);
		prevMouseX = mouseX;
		prevMouseY = mouseY;
        lastLogPosTime = millis();
	}
}

//
void drawSetup()
{
    background(0);
	fill(255);
	textSize(32);
	text(statusText, 100, 100);
}

//
void drawIntro()
{
    background(0);
    fill(255);
    textSize(32);
    text("APP VER: " + APP_VER_STR, 300, 650);
    text(" FW VER: " + fwVerStr, 300, 700);
}

//
void drawOutro()
{
    background(0);
	fill(255);
	textSize(32);
	text(statusText, 100, 100);
}

//
void draw()
{
    switch (appState)
    {
    case SETUP: drawSetup(); break;
    case INTRO: drawIntro(); break;
    case SESSION: drawSession(); break;
    case OUTRO: drawOutro(); break;
    }
}
