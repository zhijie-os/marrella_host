const videoElement = document.getElementById('video_input');

const marrella_gif = document.getElementById('marrella');

window.marrella_gif = marrella_gif

let WIDTH = 1280
let HEIGHT = 720


class Marrella {
    first_follow = true
    center = { x: 150, y: 150 }
    width = 300
    height = 300

    count = 0
    stage = 0

    swimming_count = 50
    // random_dir = Math.random()<0.5?0:1

    constructor() {

    }

    update(bodyParts) {
        // check for hand close
        if (this.stage == 0) {
            // hidden, but follows
            console.log("stage - 0")
            this.hidden_following(bodyParts)
            this.preparing(bodyParts)
        } // hand closed, wait for open
        else if (this.stage == 1) {
            console.log("stage - 1")

            this.hidden_following(bodyParts)
            // this.following(bodyParts)
            this.revealing(bodyParts)
        } // revealed, wait for releasing
        else if (this.stage == 2) {

            console.log("stage - 2")

            this.hidden_following(bodyParts)
            // this.following(bodyParts)
            this.releasing(bodyParts)
        } // released, wait for hands down
        else if (this.stage == 3) {

            console.log("stage - 3")
            this.swimming(bodyParts)
            this.hands_down(bodyParts)
        } // hands down, wait for reattaching
        else if (this.stage == 4) {

            console.log("stage - 4")
            this.swimming(bodyParts)
            this.reattaching(bodyParts)
        }
        else if (this.stage == 5) {
            console.log("stage - 5")

            this.hidden_following(bodyParts)
            // this.following(bodyParts)
            this.hands_down(bodyParts)
        }
        else if (this.stage == 6) {
            console.log("stage - 6")

            this.hidden_following(bodyParts)
            // this.following(bodyParts)
            this.releasing_for_good(bodyParts)
        }
        else if (this.stage == 7) {
            console.log("stage - 7")
            this.center.x += 2
            window.marrella_gif.style.left = (this.center.x - this.width / 2) + 'px';
            // window.marrella_gif.style.top = (this.center.y - this.height / 2) + 'px';
        }
    }


    preparing(bodyParts) {
        if (bodyParts[19].visibility > 0.8 && bodyParts[20].visibility > 0.8 && bodyParts[17].visibility > 0.8) {
            let leftHand = { x: bodyParts[19].x * 1280, y: bodyParts[19].y * 720 };
            let rightHand = { x: bodyParts[20].x * 1280, y: bodyParts[20].y * 720 };
            let leftHandPinky = { x: bodyParts[17].x * 1280, y: bodyParts[17].y * 720 }

            let distance = Math.sqrt(Math.pow(leftHand.x - rightHand.x, 2) + Math.pow(leftHand.y - rightHand.y, 2));
            let fistSize = Math.sqrt(Math.pow(leftHand.x - leftHandPinky.x, 2) + Math.pow(leftHand.y - leftHandPinky.y, 2));

            if (distance < 5 * fistSize) {
                // reset
                this.count++
            }
            else {
                this.count = 0
            }

            if (this.count > 3) {
                this.stage++
                this.count = 0
            }
        }
        else {
            this.count = 0
        }
    }

    revealing(bodyParts) {
        if (bodyParts[19].visibility > 0.8 && bodyParts[20].visibility > 0.8 && bodyParts[17].visibility > 0.8) {
            let leftHand = { x: bodyParts[19].x * 1280, y: bodyParts[19].y * 720 };
            let rightHand = { x: bodyParts[20].x * 1280, y: bodyParts[20].y * 720 };
            let leftHandPinky = { x: bodyParts[17].x * 1280, y: bodyParts[17].y * 720 }

            let distance = Math.sqrt(Math.pow(leftHand.x - rightHand.x, 2) + Math.pow(leftHand.y - rightHand.y, 2));
            let fistSize = Math.sqrt(Math.pow(leftHand.x - leftHandPinky.x, 2) + Math.pow(leftHand.y - leftHandPinky.y, 2));

            if (distance > 5 * fistSize) {
                // reset
                this.count++
            }
            else {
                this.count = 0
            }

            if (this.count > 5) {
                this.stage++
                this.count = 0

                window.marrella.style.zIndex = '2';
                window.marrella.style.display = 'block'
            }
        }
        else {
            this.count = 0
        }
    }

    releasing(bodyParts) {
        // it is finished here

        if (bodyParts[11].visibility > 0.8 && bodyParts[12].visibility > 0.8 && bodyParts[13].visibility > 0.8 && bodyParts[14].visibility > 0.8) {
            let leftEblow = { x: bodyParts[13].x * 1280, y: bodyParts[13].y * 720 };
            let rightEblow = { x: bodyParts[14].x * 1280, y: bodyParts[14].y * 720 };
            let leftShoulder = { x: bodyParts[11].x * 1280, y: bodyParts[11].y * 720 }
            let rightShoulder = { x: bodyParts[12].x * 1280, y: bodyParts[12].y * 720 }

            // releasing/tracking
            if (leftEblow.y < leftShoulder.y && rightEblow.y < rightShoulder.y) {
                // reset
                this.count++
            }
            else {
                // reset
                this.count = 0
            }

            // continously close for 5 frame
            if (this.count > 7) {
                this.stage++
                this.count = 0
            }
        }

    }

    following(bodyParts) {
        if (bodyParts[17].visibility < 0.8) {
            return
        }
        let left_index = bodyParts[17]
        let x = left_index.x * WIDTH
        let y = left_index.y * HEIGHT
        let dif_x = x - this.center.x
        let dif_y = y - this.center.y

        this.center.x += Math.abs(dif_x) > 3 ? (Math.abs(dif_x) / dif_x) * 3 : dif_x
        this.center.y += Math.abs(dif_y) > 10 ? (Math.abs(dif_y) / dif_y) * 10 : dif_y
        window.marrella_gif.style.left = (this.center.x - this.width / 2) + 'px';
        window.marrella_gif.style.top = (this.center.y - this.height / 2) + 'px';
    }

    hidden_following(bodyParts) {


        let left_index = bodyParts[17]
        let x = left_index.x * WIDTH
        let y = left_index.y * HEIGHT

        this.center.x = x
        this.center.y = y
        window.marrella_gif.style.left = (this.center.x - this.width / 2) + 'px';
        window.marrella_gif.style.top = (this.center.y - this.height / 2) + 'px';
    }


    swimming(bodyParts) {
        if (this.swimming_count >= 0) {
            if (this.center.x - 1 >= 0)
                this.center.x -= 1
            if (this.center.y - 1 >= 0)
                this.center.y -= 1
            this.swimming_count--
            if (this.swimming_count == 0)
                this.swimming_count = -30
        }
        else {
            if (this.center.x + 1 < WIDTH)
                this.center.x += 1
            if (this.center.y + 1 < HEIGHT)
                this.center.y += 1
            this.swimming_count++
            if (this.swimming_count == 0)
                this.swimming_count = 30
        }

        window.marrella_gif.style.left = (this.center.x - this.width / 2) + 'px';
        window.marrella_gif.style.top = (this.center.y - this.height / 2) + 'px';
    }

    hands_down(bodyParts) {
        if (bodyParts[11].visibility > 0.8 && bodyParts[12].visibility > 0.8 && bodyParts[13].visibility > 0.8 && bodyParts[14].visibility > 0.8) {
            let leftEblow = { x: bodyParts[13].x * 1280, y: bodyParts[13].y * 720 };
            let rightEblow = { x: bodyParts[14].x * 1280, y: bodyParts[14].y * 720 };
            let leftShoulder = { x: bodyParts[11].x * 1280, y: bodyParts[11].y * 720 }
            let rightShoulder = { x: bodyParts[12].x * 1280, y: bodyParts[12].y * 720 }

            // releasing/tracking
            if (leftEblow.y > leftShoulder.y && rightEblow.y > rightShoulder.y) {
                // reset
                this.count++
            }
            else {
                // reset
                this.count = 0
            }
            // continously close for 5 frame
            if (this.count > 15) {
                this.stage += 1
                this.count = 0
            }
        }
    }

    reattaching(bodyParts) {
        if (bodyParts[11].visibility > 0.8 && bodyParts[12].visibility > 0.8 && bodyParts[13].visibility > 0.8 && bodyParts[14].visibility > 0.8) {
            let leftEblow = { x: bodyParts[13].x * 1280, y: bodyParts[13].y * 720 };
            let rightEblow = { x: bodyParts[14].x * 1280, y: bodyParts[14].y * 720 };
            let leftShoulder = { x: bodyParts[11].x * 1280, y: bodyParts[11].y * 720 }
            let rightShoulder = { x: bodyParts[12].x * 1280, y: bodyParts[12].y * 720 }

            // releasing/tracking
            if (leftEblow.y < leftShoulder.y && rightEblow.y < rightShoulder.y) {
                // reset
                this.count++
            }
            else {
                // reset
                this.count = 0
            }
            // continously close for 5 frame
            if (this.count > 5) {
                this.stage++
                this.count = 0
            }
        }
    }

    releasing_for_good(bodyParts) {
        if (bodyParts[11].visibility > 0.8 && bodyParts[12].visibility > 0.8 && bodyParts[13].visibility > 0.8 && bodyParts[14].visibility > 0.8) {
            let leftEblow = { x: bodyParts[13].x * 1280, y: bodyParts[13].y * 720 };
            let rightEblow = { x: bodyParts[14].x * 1280, y: bodyParts[14].y * 720 };
            let leftShoulder = { x: bodyParts[11].x * 1280, y: bodyParts[11].y * 720 }
            let rightShoulder = { x: bodyParts[12].x * 1280, y: bodyParts[12].y * 720 }

            // releasing/tracking
            if (leftEblow.y < leftShoulder.y && rightEblow.y > rightShoulder.y) {
                // reset
                this.count++
            }
            else {
                // reset
                this.count = 0
            }
            // continously close for 5 frame
            if (this.count > 8) {
                this.stage++
                this.count = 0
            }
        }
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
