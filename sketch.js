let g;

let frames = 60;

let game_w, game_h;
//let wh_ratio;

let img;

let slide_rate = 60;

let useLocalImage = true;
let sf = 1;

let updating = false;
let playing = false;
let shuffling = false;
let toShuffle;
let completed = false;

let debug = false;

//let options;
let canvas;

let rows = 3;
let columns = 3;
let shuffleNum;

let table;
let tableLevelArray = [];

let timerValue = 5;
let timer;
let timerflag = true;
//let timerValueX;

let timer2;
let timer2_second = 0;
let timer2_min = 0;
let timerString = '';
let startCount = true;

let timerHeader = document.getElementById('timerHeader');
let keyHeader = document.getElementById('keyArrowIcon');
let noticeWin = document.getElementById('noticeWin');
let noticeContent = document.getElementById('noticeContent');

let csvIndex = 0;

let loadingFlag = true;

//let currentLevel;

let blinkFlag;

let levelSelect = false;
let tableLength;

let tp = false;

let timer3;

function preload() {
    table = loadTable('config.csv', 'csv', 'header', function() {
        img = loadImage("./imagedata/" + table.getString(csvIndex, 1));
        tableLength = table.getRows().length;
    });
}

function resizeImage() {
    img.resize(1500, 1500);
}

function timeIt() {
    if (timerValue > 0) {
        timerValue--;
    }
    print(timerValue)
    timerHeader.innerHTML = timerValue;
}

function timer2F() {
    if (timer2_second == 59) {
        timer2_second = 0;
        timer2_min = timer2_min + 1;
    } else {
        timer2_second = timer2_second + 1;
    }
    timerString = str(timer2_min) + 'mins ' + str(timer2_second) + 's';
}

function newPicture() {
    resizeImage();
    rows = table.getString(csvIndex, 2);
    columns = table.getString(csvIndex, 3);
    timer = setInterval(timeIt, 1000);
    shuffleNum = tr ? int(table.getString(csvIndex, 0)) + 1 : 20 + (int(table.getString(csvIndex, 0)) - 1) * 10;

    timerHeader.innerHTML = 5;
    noticeWin.style.visibility = 'hidden';
}

async function camOnOff() {
    tp = document.getElementById('toggleCam').checked;
    if (tp) {
        pose_init();
        document.getElementById("camArea").style.visibility = 'visible';
        document.getElementById("label-container").style.visibility = 'visible';
        document.getElementById("label-container-b").style.visibility = 'visible';
    } else {
        await webcam.stop();
        document.getElementById("camArea").style.visibility = 'hidden';
        document.getElementById("label-container").style.visibility = 'hidden';
        document.getElementById("label-container-b").style.visibility = 'hidden';
    }
}

function buttonClicked() {
    let value = document.getElementById('levelSelector').value;
    csvIndex = tableLevelArray.indexOf(value);

    if (levelSelect) {
        levelSelect = false;
        /*let r = floor(random(tableLength));
        while (r == csvIndex/* || int(table.getString(r, 0)) <= int(table.getString(csvIndex, 0))) {
            r = floor(random(tableLength));
        }*/
        let r = csvIndex + 1;

        if (r == tableLength) {
            alert('Game Finished');
            r = 0;
        }
        csvIndex = r;
        document.getElementById('levelSelector').selectedIndex = r;
    }

    img = loadImage("./imagedata/" + table.getString(csvIndex, 1), function() {
        loadingFlag = true;

        updating = false;
        playing = false;
        shuffling = false;
        completed = false;
        toShuffle = 0;

        window.clearInterval(timer);
        timerflag = true;
        timerValue = 5;

        window.clearInterval(timer2);
        timer2_second = 0;
        timer2_min = 0;
        timerString = '';
        startCount = true;

        keyHeader.innerHTML = '';

        newPicture();
        setupGrid();

        /*document.getElementById("levelSelector").disabled = true;
        document.getElementById("levelSelector").disabled = false;*/

    });
}

function levelButtonSetup() {
    let temp = document.getElementById("levelSelector");
    temp.innerHTML = '';
    tableLevelArray = [];
    for (let r = 0; r < table.getRowCount(); r++) {
        var name = table.getString(r, 1);
        name = split(name, '.');
        append(tableLevelArray, name[0]);
        levelName = 'lv' + str(table.getString(r, 0)) + ' ' + name[0];
        temp.innerHTML += "<option value =\"" + name[0] + "\">" + levelName + "</option>";
    }
}

function toggleButton() {
    blinkFlag = document.getElementById('toggleID').checked;
}

function setup() {
    if (windowHeight - 56 < windowWidth) {
        canvas = createCanvas(windowHeight - 56, windowHeight - 56);
    } else {
        canvas = createCanvas(windowWidth, windowWidth);
    }
    canvas.position(0, 56);
    newPicture();
    levelButtonSetup();
    setupGrid();
    //timerValueX = width - 45;
    toggleButton();

    timer3 = setInterval(timer3F, detectionFrameRate);
}

function draw() {
    background(255);
    if (tp) {
        canvas.position((windowWidth - width) / 2, 56);
    } else {
        canvas.position(0, 56);
    }
    if (timerValue == 0) {
        if (timerflag) {
            window.clearInterval(timer);
            timerflag = false;
            startShuffle();
            loadingFlag = false;

        } else if (!shuffling && startCount) {
            startCount = false;
            timer2 = setInterval(timer2F, 1000);
            timerString = '0mins 0s';
            textSize(15);
        }
        timerHeader.innerHTML = timerString;
    }
    if (img) {
        if (g) {
            //g.update();
            g.show();
        }
        if (shuffling) {
            if (toShuffle > 0) {
                if (!updating) {
                    addMove();
                    --toShuffle;
                }
            } else if (toShuffle == 0 && g.isCompleted()) {
                if (!updating) {
                    addMove();
                    print('reShuffle');
                }
            } else if (!updating) {
                shuffling = false;
                playing = true;
                frameRate(frames);

            }
        } else if (playing) {
            if (!updating) {
                if (g.isCompleted()) {
                    completed = true;
                    print("Puzzle complete");
                    playing = false;
                    window.clearInterval(timer2);
                }
            }
        } else if (completed) {
            noticeContent.innerHTML = '<strong>Used Time:</strong> ' + str(timerString);
            noticeWin.style.visibility = 'visible';
        }
    }
}

function setupGrid() {
    print("setupGrid");
    updating = false;
    playing = false;
    shuffling = false;
    completed = false;
    let sf_w = 1;
    if (img.width > width) {
        sf_w = width / img.width;
    }

    let sf_h = 1;
    if (img.height * sf_w > height) {
        sf_h = height / (img.height * sf_w);
    }
    sf = sf_w * sf_h;
    game_w = floor(sf * img.width);
    game_h = floor(sf * img.height);
    frameRate(frames);
    g = new Grid(0, 0, rows, columns, game_w, game_h, false);
    g.initialiseGrid();
}

function keyMove(keyName) {
    for (let key in g.elements) {
        if (g.elements[key]) {
            if (g.elements[key].moveByKey(keyName)) {
                break;
            }
        }
    }
}

function keyPressed() {
    if (loadingFlag) return;
    //if (!tp) {
        if (key == "ArrowUp" || key == "ArrowDown" || key == "ArrowLeft" || key == "ArrowRight") {
            if (!updating && !completed) {
                keyMove(key);
                if (key == "ArrowUp") {
                    keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z\" fill=\"#44d88d\"/>";
                } else if (key == "ArrowDown") {
                    keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M14.496 5.975l-.001 14.287-6.366-6.367L6 16.021l10.003 10.004L26 16.029 23.871 13.9l-6.366 6.368V5.977z\" fill=\"#44d88d\"/>";
                } else if (key == "ArrowLeft") {
                    keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M26.025 14.496l-14.286-.001 6.366-6.366L15.979 6 5.975 16.003 15.971 26l2.129-2.129-6.367-6.366h14.29z\" fill=\"#44d88d\"/>";
                } else if (key == "ArrowRight") {
                    keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M5.975 17.504l14.287.001-6.367 6.366L16.021 26l10.004-10.003L16.029 6l-2.128 2.129 6.367 6.366H5.977z\" fill=\"#44d88d\"/>";
                }
            }
        }
        if (key == "f") {
            if (completed && blinkFlag) {
                levelSelect = true;
                buttonClicked();
            }
        }
    //}
}

function startShuffle() {
    loadingFlag = true;
    shuffling = true;
    toShuffle = shuffleNum;
    frameRate(tr ? /*int(table.getString(csvIndex, 0)) * 2 + 2*/4 : 2000); // lower the frame rate so we can see the moves shuffling
}

function addMove() {
    let r, c;
    let blank_row = g.blank.row;
    let blank_col = g.blank.col;
    do {
        if (random([1, 2]) == 1) {
            do {
                r = /*tr ? blank_row + random([-1, 1]) : */floor(random(g.num_rows));
            } while (r == blank_row);
            c = blank_col;
        } else {
            do {
                c = /*tr ? blank_col + random([-1, 1]) : */floor(random(g.num_cols));
            } while (c == blank_col);
            r = blank_row;
        }
    } while (tr && ((r == prevBlank[0] && c == prevBlank[1]) || /*r < 0 || c < 0 || r >= g.num_rows || c >= g.num_cols*/(abs(r - blank_row) != 1 && abs(c - blank_col) == 0) || (abs(r - blank_row) == 0 && abs(c - blank_col) != 1)))
    prevBlank = [blank_row, blank_col];
    let e = g.getElementAt(r, c);
    e.touched();
}

function touchStarted() {
    if (loadingFlag || completed) return;
    for (let key in g.elements) {
        if (g.elements[key]) {
            g.elements[key].checkTouched(mouseX, mouseY);
        }
    }
}

let timer3Flag = true;

function timer3F() {
    timer3Flag = true;
}

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = "./my-pose-model/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";
let model, webcam, ctx, labelContainer, maxPredictions;
let labelContainerResult;

let camFrameRate = 500;
let detectionFrameRate = 1000;
let xkeyList = [];
let xkeyListLen = 2;
let xkeyShifted;

async function pose_init() {
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 300;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(pose_loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function pose_loop(timestamp) {
    webcam.update(); // update the webcam frame
    console.log('capture');
    await predict();
    if (tp) {
        setTimeout(window.requestAnimationFrame, camFrameRate, pose_loop);//temp
    }
}

let xkey;

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    if (timer3Flag) {
        timer3Flag = false;
        const prediction = await model.predict(posenetOutput);
        
        let temp = 0;
        let highestProb;
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
            // console.log(str(classPrediction).split(': ')[0])
            if (float(str(classPrediction).split(': ')[1]) > temp) {
                temp = float(str(classPrediction).split(': ')[1]);
                console.log(temp);
                xkey = i;
                highestProb =str(classPrediction).split(': ')[0] 
            }
        }
        // console.log(highestProb)
        document.getElementById('label-container-b').innerHTML = highestProb.toUpperCase();
        // if (highestProb.lo) {
        //     document.getElementById('label-container-b').innerHTML = 'RIGHT';
        // } else if (xkey == '1') {
        //     document.getElementById('label-container-b').innerHTML = 'LEFT';
        // } else if (xkey == '2') {
        //     document.getElementById('label-container-b').innerHTML = 'UP';
        // } else if (xkey == '3') {
        //     document.getElementById('label-container-b').innerHTML = 'DOWN';
        // } else if (xkey == '4') {
        //     document.getElementById('label-container-b').innerHTML = 'NEXT';
        // } else {
        //     document.getElementById('label-container-b').innerHTML = 'NORMAL';
        // }


        let b = true;
        xkeyList.push(xkey);
        while (xkeyList.length > xkeyListLen) {
            xkeyShifted = xkeyList.shift();
        }
        for (let i = 0; i < xkeyListLen; i++) if (xkeyList[i] != xkey) {
            b = false;
            break;
        }
        if (xkeyShifted == xkey) b = false;
        if (b) {

            if (str(xkey) == '4' || str(xkey) == '5') {
                if (str(xkey) == '4') {
                    if (completed && blinkFlag) {
                        levelSelect = true;
                        buttonClicked();
                    }
                }
            } else {
                if (str(xkey) == '1') {
                    xkey = 'ArrowRight';
                } else if (str(xkey) == '0') {
                    xkey = 'ArrowLeft';
                } else if (str(xkey) == '2') {
                    xkey = 'ArrowUp';
                } else if (str(xkey) == '3') {
                    xkey = 'ArrowDown';
                }
                if (playing && !updating && !completed) {
                    keyMove(xkey);
                    if (xkey == "ArrowUp") {
                        keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M17.504 26.025l.001-14.287 6.366 6.367L26 15.979 15.997 5.975 6 15.971 8.129 18.1l6.366-6.368v14.291z\" fill=\"#44d88d\"/>";
                    } else if (xkey == "ArrowDown") {
                        keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M14.496 5.975l-.001 14.287-6.366-6.367L6 16.021l10.003 10.004L26 16.029 23.871 13.9l-6.366 6.368V5.977z\" fill=\"#44d88d\"/>";
                    } else if (xkey == "ArrowLeft") {
                        keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M26.025 14.496l-14.286-.001 6.366-6.366L15.979 6 5.975 16.003 15.971 26l2.129-2.129-6.367-6.366h14.29z\" fill=\"#44d88d\"/>";
                    } else if (xkey == "ArrowRight") {
                        keyHeader.innerHTML = "<path data-name=\"layer1\" d=\"M5.975 17.504l14.287.001-6.367 6.366L16.021 26l10.004-10.003L16.029 6l-2.128 2.129 6.367 6.366H5.977z\" fill=\"#44d88d\"/>";
                    }
                }
            }
        }
    }

    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

let tr = false;
let prevBlank = [];

function remember() {
    tr = document.getElementById('toggleRemember').checked;
    buttonClicked();
}
