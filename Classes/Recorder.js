class Recorder {
    // Static variable to hold the frequencies for each note
    static noteFrequencies = {
        c1: 261.63, c1_sharp: 277.18, d1: 293.66, d1_sharp: 311.13, e1: 329.63,
        f1: 349.23, f1_sharp: 369.99, g1: 392.00, g1_sharp: 415.30, a1: 440.00,
        a1_sharp: 466.16, b1: 493.88, c2: 523.25, c2_sharp: 554.37, d2: 587.33,
        d2_sharp: 622.25, e2: 659.25, f2: 698.46, f2_sharp: 739.99, g2: 783.99,
        g2_sharp: 830.61, a2: 880.00, a2_sharp: 932.33, b2: 987.77, c3: 1046.50,
        c3_sharp: 1108.73, d3: 1174.66, d3_sharp: 1244.51, e3: 1318.51, f3: 1396.91,
        g3: 1567.98
    };

    static pauseLength = 0;
    static tongueLength = 35;

    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
            latencyHint: 'interactive'
        });        
        this.currentOscillator = null;  // Holds the currently playing oscillator
        this.currentGainNode = null;  // Holds the gain node for volume control
        this.currentNote = null; // Track the currently playing note
    }

    playNote(note) {
        // Check if a note is currently being played
        if (this.currentOscillator) {
            this.stopNote();
        }

        // Store the note that is currently being played
        this.currentNote = note;

        // Create a new oscillator for the note
        this.currentOscillator = this.audioContext.createOscillator();
        this.currentOscillator.type = 'sine';  // Set waveform type

        // Set the frequency of the note
        this.currentOscillator.frequency.setValueAtTime(
            Recorder.noteFrequencies[note], 
            this.audioContext.currentTime
        );

        // Create a gain node to control volume
        this.currentGainNode = this.audioContext.createGain();
        this.currentGainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Set volume

        // Connect the oscillator to the gain node and then to the audio context
        this.currentOscillator.connect(this.currentGainNode);
        this.currentGainNode.connect(this.audioContext.destination);

        // Start playing the note
        this.currentOscillator.start();
    }

    stopNote() {
        // Check if a note is currently playing
        if (this.currentOscillator) {
            this.currentOscillator.stop(this.audioContext.currentTime);  // Stop the note
            this.currentOscillator.disconnect();  // Disconnect to free resources
            this.currentOscillator = null;  // Clear the oscillator reference
            this.currentGainNode.disconnect();  // Disconnect the gain node
            this.currentGainNode = null;  // Clear the gain node reference
            this.currentNote = null; // Clear the current note reference
        }
    }

    sameNote() {
        if (this.currentNote) {
            let temp = this.currentNote;
            this.stopNote();  // Stop the currently playing note
            setTimeout(() => {
                this.playNote(temp);  // Play the same note again
            }, Recorder.tongueLength);
        }
    }

    changeVolume(percent) {
        if (this.currentGainNode) {
            this.currentGainNode.gain.setValueAtTime(percent, this.audioContext.currentTime);
        }
    }
}
