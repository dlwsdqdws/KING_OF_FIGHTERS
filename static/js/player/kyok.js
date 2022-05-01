import { Player } from '/static/js/player/base.js';
import { GIF } from '/static/js/utils/gif.js';

export class Kyok extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {
        let outer = this;
        let offset = [0, -22, -22, -140, 0, 0, 0];
        let r1 = {
            x1: 120,
            y1: 40,
            x2: 100,  //width
            y2: 20,   //height
        };
        let r2 = {
            x1: - 120 - 100,
            y1: 40,
            x2: 100,
            y2: 20,
        }


        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: 5,
                offset_y: offset[i],
                loaded: false,
                scale: 2,
                attack_r1: r1,
                attack_r2: r2,
                att_start : 16,
                att_t : 1,
                att_v : 1,   //v on x-axis
                att_hp : 10,
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if (i === 3) {
                    //move quicker when jumping
                    obj.frame_rate = 4;
                }
            }
        }
    }
}