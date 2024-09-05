//Recorder controls
const root = document.querySelector(':root');
const body = document.querySelector('body');

let keyChangeNumber = 0;

let keyboard = {};

let holes = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];

let indexes = {
    ' ': 0,
    f: 1,
    d: 2,
    s: 3,
    j: 4,
    k: 5,
    l: 6,
    ';': 7,
    ':': 7
};

let recorder = new Recorder();

let halfKeyIndexes = {
    'c': 0,
    '.': 6,
    '>': 6,
    '/': 7,
    '?': 7
}

let notes = {
    c1: [[0, 0, 0, 0, 0, 0, 0, 1]],
    c1_sharp: [[0, 0, 0, 0, 0, 0, 0, 0.5]],
    d1: [[0, 0, 0, 0, 0, 0, 1, 0]],
    d1_sharp: [[0, 0, 0, 0, 0, 0, 0.5, 0]],
    e1: [[1, 1, 1, 1, 1, 1, 0, 0]],
    f1: [[1, 1, 1, 1, 1, 0, 1, 0]],
    f1_sharp: [[1, 1, 1, 1, 0, 1, 1, 0]],
    g1: [[1, 1, 1, 1, 0, 0, 0, 0]],
    g1_sharp: [[1, 1, 1, 0, 1, 1, 0, 0]],
    a1: [[1, 1, 1, 0, 0, 0, 0, 0]],
    a1_sharp: [[1, 1, 0, 1, 1, 0, 0, 0]],
    b1: [[1, 1, 0, 0, 0, 0, 0, 0]],
    c2: [[1, 0, 1, 0, 0, 0, 0, 0]],
    c2_sharp: [[0, 1, 1, 0, 0, 0, 0, 0]],
    d2: [[0, 0, 1, 0, 0, 0, 0, 0]],
    d2_sharp: [[0.5, 0, 0, 0, 0, 0, 0.5, 0]],
    e2: [[0.5, 1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 1, 1, 1, 0, 0]],
    f2: [[0.5, 1, 1, 1, 1, 0, 1, 0]],
    f2_sharp: [[0.5, 1, 1, 1, 0, 1, 0, 0]],
    g2: [[0.5, 1, 1, 1, 0, 0, 0, 0]],
    g2_sharp: [[0.5, 1, 1, 0, 1, 0, 0, 0]],
    a2: [[0.5, 1, 1, 0, 0, 0, 0, 0]],
    a2_sharp: [[0.5, 1, 1, 0, 0, 1, 1, 0]],
    b2: [[0.5, 1, 1, 0, 1, 1, 0, 0]],
    c3: [[0.5, 1, 0, 0, 1, 1, 0, 0]],
    c3_sharp: [[0.5, 1, 0, 1, 1, 1, 0, 1]],
    d3: [[0.5, 1, 0, 1, 1, 0, 1, 0]],
    d3_sharp: [[0.5, 0, 1, 1, 0, 1, 1, 0]],
    e3: [[0.5, 0, 1, 1, 0, 1, 1, 0]],
    f3: [[0.5, 1, 0, 1, 1, 1, 0, 0]],
    g3: [[0.5, 1, 0, 0, 1, 0, 0, 0]]
}

document.addEventListener('keydown', (event) => {
    if(keyboard[event.key] == true) return;
    event.key = event.key.toLowerCase();
    keyboard[event.key] = true;
    if(Object.keys(indexes).indexOf(event.key) != -1) {
        keyChangeNumber++;
        holes[indexes[event.key]] = 1;
        checkNote();
    } else if(Object.keys(halfKeyIndexes).indexOf(event.key) != -1) {
        keyChangeNumber++;
        holes[halfKeyIndexes[event.key]] = 0.5;
        checkNote();
    } else {
        recorder.sameNote();
    }
});

document.addEventListener('keyup', (event) => {
    if(keyboard[event.key] == false) return;
    keyboard[event.key] = false;
    if(Object.keys(indexes).indexOf(event.key) != -1) {
        keyChangeNumber++;
        holes[indexes[event.key]] = 0;
        checkNote();
    } else if(Object.keys(halfKeyIndexes).indexOf(event.key) != -1) {
        keyChangeNumber++;
        holes[halfKeyIndexes[event.key]] = 0;
        checkNote();
    }
});

let checkNote = () => {
    const num = keyChangeNumber;
    recorder.stopNote();
    setTimeout(() => {
        if(num == keyChangeNumber) {
            Object.keys(notes).forEach(key => {
                let arr = notes[key];
                let incorrectNum = 0;
                for(let i = 0; i < arr.length; i++) {
                    for(let j = 0; j < arr[i].length; j++) {
                        if(arr[i][j] != holes[j]) {
                            incorrectNum++;
                            break;
                        }
                    }
                }
                if(incorrectNum != arr.length) {
                    recorder.playNote(key);
                    return;
                }
            });
        }
    }, Recorder.pauseLength);
}