import { GameObject } from "/static/js/game_objects/base.js";

export class Player extends GameObject {
    constructor(root, info) {
        super();

        this.root = root;

        this.x = info.x;
        this.y = info.y;
        this.id = info.id;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;
        this.speedy = -1500; //jump init speed

        this.gravity = 50;

        //0 : idle, 1 : move forward, 2 : move back, 3 : jump, 4 : attack, 5 : beaten, 6 : dead
        this.status = 3;  //start from falling

        this.beat = 0;

        this.animations = new Map();
        this.frame_current_cnt = 0;

        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.ctx = this.root.game_map.ctx;

        this.hp = 100;
    }

    start() {

    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }

                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_move() {
        // if (this.status === 3) {
        this.vy += this.gravity;
        // }
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) this.status = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_direction() {
        if (this.status === 6) return;

        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }

    }

    is_attack() {
        // if(this.beat === 1) return ;

        if (this.status === 6) return;

        this.status = 5;

        this.frame_current_cnt = 0;


        this.hp = Math.max(0, this.hp - this.animations.get(this.status).att_hp);

        // this.beat = 1;

        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
        }
    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {
        let obj = this.animations.get(this.status);
        // console.log(obj.att_start);

        if (this.status === 4) {
            // this.status = 0;
            if (this.frame_current_cnt >= obj.att_start && this.frame_current_cnt < obj.att_start + obj.att_t) {
                let players = this.root.players;
                let me = this, you = players[1 - this.id];
                let r1;
                if (this.direction > 0) {
                    r1 = {
                        x1: me.x + obj.attack_r1.x1 + obj.att_v * (this.frame_current_cnt - obj.att_start),
                        y1: me.y + obj.attack_r1.y1,
                        x2: me.x + obj.attack_r1.x1 + obj.att_v * (this.frame_current_cnt - obj.att_start) + obj.attack_r1.x2,
                        y2: me.y + obj.attack_r1.y1 + obj.attack_r1.y2
                    }
                } else {
                    r1 = {
                        x1: me.x + me.width + obj.attack_r2.x1 - obj.att_v * (this.frame_current_cnt - obj.att_start),
                        y1: me.y + obj.attack_r1.y1,
                        x2: me.x + me.width - obj.attack_r1.x1 - obj.att_v * (this.frame_current_cnt - obj.att_start) + obj.attack_r1.x2,
                        y2: me.y + obj.attack_r1.y1 + obj.attack_r1.y2
                    }
                }

                // console.log(r1);

                let r2 = {
                    x1: you.x,
                    y1: you.y,
                    x2: you.x + you.width,
                    y2: you.y + you.height
                };

                if (this.is_collision(r1, r2)) {
                    you.is_attack();
                }
            }else{
                this.beat = 0;
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    render() {
        let status = this.status;

        if (this.status === 1 && this.direction * this.vx < 0){
            // console.log(2);
            status = 2;
        }

        let obj = this.animations.get(status);

        /*    hitting box
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x+150, this.y+40, 350, 20);

        // console.log(obj.att_start);
        if (this.status === 4 && this.frame_current_cnt >= obj.att_start && this.frame_current_cnt < obj.att_start + obj.att_t) {
            // console.log(this.frame_current_cnt);
            this.ctx.fillStyle = this.color;
            let r = obj.attack_r1;
            let rr = obj.attack_r2;
            console.log(r);
            if (this.direction > 0) this.ctx.fillRect(this.x + r.x1 + obj.att_v * (this.frame_current_cnt - obj.att_start), this.y + r.y1, r.x2, r.y2);
            else this.ctx.fillRect(this.x + this.width + rr.x1 - obj.att_v * (this.frame_current_cnt - obj.att_start), this.y + rr.y1, r.x2, r.y2);
        }
        */

        if (obj && obj.loaded) {
            if (this.direction === 1) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();

                //Flip the coordinate
                this.ctx.scale(-1, 1);
                //Translate the coordinate
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
        }

        if (status === 4 || status === 5 || status === 6) {
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                //stop when finishing last frame of attack
                if (status === 6) {
                    this.frame_current_cnt--;
                } else {
                    this.status = 0;
                }
            }

        }

        this.frame_current_cnt++;
    }
}