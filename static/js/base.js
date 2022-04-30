import {GameMap} from '/static/js/game_map/base.js';
import {Kyok} from '/static/js/player/kyok.js';

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);

        this.game_map = new GameMap(this);
        this.players = [
            new Kyok(this, {
                id : 0,
                x : 200,
                y : 0, 
                width  : 120,
                height : 200,
                color : 'blue',
            }),
            new Kyok(this, {
                id : 1,
                x : 900,
                y : 0, 
                width  : 120,
                height : 200,
                color : "red",
            })
        ];
    }
}

export {
    KOF
}