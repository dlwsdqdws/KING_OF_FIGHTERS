import {Player} from '/static/js/player/base.js';
import {GIF} from '/static/js/utils/gif.js';

export class Mais extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {
        let outer = this;
        let offset = [0, -22, -22, -140, -110, 0, 0];

        let r1 = {
            x1: 150,
            y1: 40,
            x2: 60,
            y2: 20,
        };
        let r2 = {
            x1: - 150 - 60,
            y1: 40,
            x2: 60,
            y2: 20,
        }

        for(let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/mai/${i}.gif`);
            this.animations.set(i, {
                gif : gif,
                frame_cnt : 0,
                frame_rate : 5,
                offset_y : offset[i],
                loaded : false,
                scale : 2.1,
                attack_r1: r1,
                attack_r2: r2,
                att_start : 20,
                att_t : 20,
                att_v : 17,
                att_hp : 2,
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if(i === 0){
                    obj.frame_rate = 6;
                }

                if (i === 3) {
                    //move quicker when jumping
                    obj.frame_rate = 6;
                }

                if(i === 4){
                    obj.frame_rate = 3;
                }
            }
        }
    }
}