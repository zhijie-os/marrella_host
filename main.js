const videoElement = document.getElementById('video_input');

const marrella_gif = document.getElementById('marrella');

window.marrella_gif = marrella_gif

let WIDTH = 1280
let HEIGHT = 720

class Marrella {
    center = { x: 50, y: 50 }
    width = 500
    height = 500
    release = { released: false, above_head: false, count: 0 }
    reveal = { hand_close: false, hand_open: false, count: 0 }

    constructor() {

    }

    update(bodyParts) {
        if (!this.reveal.hand_close || !this.reveal.hand_open) {
            this.revealing(bodyParts)
        }
        // check if need to release
        if (this.reveal.hand_open) {
            this.releasing(bodyParts)
        }

        if (this.release.released) {
            this.swimming(bodyParts)
        }
        else {
            this.following(bodyParts)
        }

    }

    revealing(bodyParts) {
        // it is finished here
        if (this.reveal.hand_open) {
            return
        }

        if (bodyParts[19].visibility > 0.88 && bodyParts[20].visibility > 0.88 && bodyParts[17].visibility > 0.88) {
            let leftHand = { x: bodyParts[19].x * 1280, y: bodyParts[19].y * 720 };
            let rightHand = { x: bodyParts[20].x * 1280, y: bodyParts[20].y * 720 };
            let leftHandPinky = { x: bodyParts[17].x * 1280, y: bodyParts[17].y * 720 }

            let distance = Math.sqrt(Math.pow(leftHand.x - rightHand.x, 2) + Math.pow(leftHand.y - rightHand.y, 2));
            let fistSize = Math.sqrt(Math.pow(leftHand.x - leftHandPinky.x, 2) + Math.pow(leftHand.y - leftHandPinky.y, 2));

            // hand close
            if (distance < 5 * fistSize) {
                // reset
                if (this.reveal.count > 0) {
                    this.reveal.count = 0
                }
                this.reveal.count--
            }
            // hand open
            else {
                // reset
                if (this.reveal.count < 0) {
                    this.reveal.count = 0
                }
                this.reveal.count++
            }

            // continously close for 3 frame
            if (this.reveal.count == -5) {
                // alert("hand_closed")
                this.reveal.hand_close = true
                // reset
                this.reveal.count = 0
            }// continously open for 3 frame
            else if (this.reveal.count == 5) {
                // alert("hand_opened")
                if (this.reveal.hand_close) {
                    this.reveal.hand_open = true
                }
            }


        }
        else {
            this.reveal.count = 0;
        }

        // if hand_open reveal the marrella
        if (this.reveal.hand_open) {
            window.marrella.style.zIndex = '2';
            window.marrella.style.display = 'block'
        }
    }

    releasing(bodyParts) {
        // it is finished here

        if (bodyParts[11].visibility > 0.88 && bodyParts[12].visibility > 0.88 && bodyParts[13].visibility > 0.88 && bodyParts[14].visibility > 0.88) {
            let leftEblow = { x: bodyParts[13].x * 1280, y: bodyParts[13].y * 720 };
            let rightEblow = { x: bodyParts[14].x * 1280, y: bodyParts[14].y * 720 };
            let leftShoulder = { x: bodyParts[11].x * 1280, y: bodyParts[11].y * 720 }
            let rightShoulder = { x: bodyParts[12].x * 1280, y: bodyParts[12].y * 720 }

            // releasing/tracking
            if (leftEblow.y < leftShoulder.y && rightEblow.y < rightShoulder.y) {
                // reset
                this.release.count++
            }
            else {
                // reset
                this.release.count = 0
            }

            // continously close for 5 frame
            if (this.release.count == 5) {
                this.release.released = true
                // reset
                this.releasing = 0
            }
        }
        else {
            this.reveal.count = 0;
        }

    }

    following(bodyParts) {
        let left_index = bodyParts[17]
        let x = left_index.x * WIDTH
        let y = left_index.y * HEIGHT
        this.center.x = x
        this.center.y = y
        window.marrella_gif.style.left = (this.center.x - this.width / 2) + 'px';
        window.marrella_gif.style.top = (this.center.y - this.height / 2) + 'px';
    }

    swimming(bodyParts) {

    }

    back_to_following(bodyParts) {
    }
}

let marrella = new Marrella()
// event loop
function onResults(results) {
    if (!results.poseLandmarks) {
        return;
    }
    marrella.update(results.poseLandmarks)
}

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
	facingMode: 'environment'
});
camera.start();
