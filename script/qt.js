var Qt = function(x, y, width, height, currentlevel, maxlevel, context) {


    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.currentlevel = currentlevel;
    this.maxlevel = maxlevel;
    this.context = context;
    this.hw;
    this.hh;
    this.nodes;
    this.label;

    this.init();
}

Qt.prototype.init = function() {


    this.hw = this.width / 2;
    this.hh = this.height / 2;
    this.nodes = [];
    //this.split();
    this.label = document.getElementById("intoplabel");

}

Qt.prototype.split = function() {

    var x = this.x,
        y = this.y,
        hw = this.hw,
        hh = this.hh,
        level = this.currentlevel + 1,
        maxlevel = this.maxlevel,
        context = this.context;


    this.nodes[0] = new Qt(x, y, hw, hh, level, maxlevel, context);
    this.nodes[1] = new Qt(x + hw, y, hw, hh, level, maxlevel, context);
    this.nodes[2] = new Qt(x + hw, y + hh, hw, hh, level, maxlevel, context);
    this.nodes[3] = new Qt(x, y + hh, hw, hh, level, maxlevel, context);

}

Qt.prototype.insert = function() {

    var i = 0,
        l = 4,
        q = {};

    if (this.currentlevel <= this.maxlevel) {
        for (i = 0; i < l; i++) {
            //q.split();
            if (this.nodes.length < 3) {
                this.split();
            }

            q = this.nodes[i];
            q.draw();
            q.insert();
        }

    }
}
Qt.prototype.draw = function() {

    var context = this.context;
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.stroke();
    context.closePath();


}

Qt.prototype.insertPoint = function(mousex, mousey) {

    var index,
        q;


    index = this.getIndexPoint(mousex, mousey);

    if (index === -1) {
        return;
    }

    if (this.nodes.length < 1) {
        this.split();
    }


    if (this.currentlevel <= this.maxlevel) {


        q = this.nodes[index];
        q.insertPoint(mousex, mousey);
        q.draw();

    }


}

Qt.prototype.getIndexPoint = function(mousex, mousey) {


    var result,
        x = this.x,
        y = this.y,
        width = this.width,
        height = this.height,
        hw = this.hw,
        hh = this.hh,
        ex = x + hw,
        ey = y + hh,
        tx,
        ty;


    //if (mousex <= x || mousex >= ex || mousey < y || mousey > ey) {
    //    result = -1;
    //return result;
    //}

    tx = mousex <= x + hw ? true : false;
    ty = mousey <= y + hh ? true : false;


    result = this.getIndexFlags(tx, ty);
    //this.label.innerHTML += " " + mousex + " " + ex + " " + result + "| ";

    return result;

}

Qt.prototype.insertRectangle = function(rect) {
    var indexes = [],
        i = 0,
        l = 0,
        q = null;

    if (this.nodes.length < 1) {
        this.split();
    }

    indexes = this.getIndexRectangle(rect);



    if (this.currentlevel <= this.maxlevel) {

        l = indexes.length;
        for (i = 0; i < l; i++) {
            q = this.nodes[indexes[i]];
            q.insertRectangle(rect);
            q.draw();
        }


    }



}

Qt.prototype.getIndexRectangle = function(rect) {
    var result = [],
        x = this.x,
        y = this.y,
        width = this.width,
        height = this.height,
        hw = this.hw,
        hh = this.hh,
        stx,
        sty,
        etx,
        ety,
        sv,
        ev;


    stx = rect.x <= x + hw ? true : false;
    sty = rect.y <= y + hh ? true : false;
    etx = rect.x + rect.width <= x + hw ? true : false;
    ety = rect.y + rect.height <= y + hh ? true : false;

    sv = this.getIndexFlags(stx, sty);
    ev = this.getIndexFlags(etx, ety);



    if (sv === 0) {
        if (ev === 0) {
            result.push(0);
        } else if (ev === 1) {
            result.push(0, 1);
        } else if (ev === 3) {
            result.push(0, 3);
        } else {
            result.push(0, 1, 2, 3);
        }

    } else if (sv === 1) {
        if (ev === 1) {
            result.push(1);
        } else {
            result.push(1, 2);
        }
    } else if (sv === 3) {
        if (ev === 3) {
            result.push(3);
        } else {
            result.push(2, 3);
        }
    } else {
        result.push(2);
    }

    

    return result;

}

Qt.prototype.getIndexFlags = function(tx, ty) {
    var result;

    if (tx && ty) {
        result = 0;
    } else if (ty) {
        result = 1;
    } else if (tx) {
        result = 3;
    } else {
        result = 2;
    }

    return result;

}