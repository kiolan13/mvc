/*jshint esversion: 6 */
class Core {
    // ______________________________
    //|Controller -> Model <- View <-|

    constructor() {

        this.model = new Model();
        this.view = new View(this.model);
        this.controller = new Controller(this.model, this.view);
        this.controller.init();

    }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Controller {

    constructor(model, view) {

        this.model = model;
        this.view = view;

    }

    init() {

        this.request = new Request();
        this.observer = new ObserverController(this.model, this.view, this.request)
        this.input = new InputController(this.model, this.view, this.request, this.observer);

        setInterval((e) => {
            this.frame();
        }, 1000 / 30);
    }
    frame() {
        this.input.frame();
        this.model.frame();
        this.view.frame();
    }
}
class InputController extends Controller {

    constructor(model, view, request, observer) {

        super(model, view);
        this.request = request;
        this.observer = observer;
        this.canvas = document.getElementById("canvas");
        this.boundrect = this.canvas.getBoundingClientRect();

        document.addEventListener("mousemove", (e) => {

            model.setmouse(e.clientX - this.boundrect.left, e.clientY - this.boundrect.top);

        });
        this.canvas.addEventListener("mousedown", (e) => {

            this.observer.notify(e.type);

        });
        document.addEventListener("mouseup", (e) => {
            this.observer.notify(e.type);

        });
        document.addEventListener("keydown", (e) => {

            this.observer.notify(e.type);
            //if (e.keyCode == 46) {}
        });
        document.addEventListener("wheel", (e) => {
            //this.request['wheelvalue'] = e.deltaY;
        });
        document.getElementById("Createrect").addEventListener("mousedown", (e) => {
            this.observer.set('mousedown', 'CreaterectCommandController');
        });
        document.getElementById("Createfigure").addEventListener("mousedown", (e) => {
            this.observer.set('mousedown', 'CreatefigureCommandController');
        });
    }

    frame() {
        this.dx = this.model.mouse.x - this.px;
        this.dy = this.model.mouse.y - this.py;
        this.px = this.model.mouse.x;
        this.py = this.model.mouse.y;
    }
}
class ObserverController extends Controller {
    constructor(model, view, request) {

        super(model, view);
        this.model = model;
        this.view = view;
        this.request = request;
        this.commandex = new CommandExController(model, view, this);
        this.responces = [];


        this.set("drag", "DragMeshCommandController");

    }
    set(eventName, responce) {
        this.responces[eventName] = responce;

    }
    remove(eventName) {

    }
    clear() {
        this.responces["mousedown"] = '';
        this.responces["mouseup"] = '';
    }
    //string event
    notify(event) {
        //console.log(eventName);
        if (this.responces[event]) {

            this.commandex.use(this.responces[event]);

        } else if (event === "mousedown") {

            this.commandex.use(this.responces["drag"]);
        }
    }



}
class CommandExController extends Controller {
    constructor(model, view, observer) {

        super(model, view);
        this.model = model;
        this.view = view;
        this.observer = observer;
    }
    use(str) {

        //parameters - array;
        //console.log(str);
        var array = this.parse(str);

        this.execute(array[0], array[1]);
    }
    parse(string) {
        var classname = '',
            methodname = '';
        if (string.match('::')) {
            var array = string.split('::');
            classname = array[0];
            methodname = array[1];
        } else {
            classname = string;
        }

        return [classname, methodname];
    }

    execute(classname, methodname) {
        var factory = new CommandCreateFactoryController(this.model, this.view, this.observer),
            command = null;
        try {
            command = factory.getCommand(classname);
            if (command === null) {
                throw new Error('command not created');
            }
            if (methodname !== '' && command[methodname]) {
                return command[methodname]();
            }

            return command.execute();

        } catch (e) {
            console.log(e.message + " " + e.lineNumber);
        }


    }
}

class CommandFactoryController extends Controller {
    constructor(model, view, observer) {
        super(model, view);
        this.observer = observer;
    }
}

class CommandCreateFactoryController extends CommandFactoryController {
    constructor(model, view, observer) {
        super(model, view, observer);
    }

    getCommand(classname) {


        try {
            if (!Config.classes[classname]) {
                throw new Error("bad classname " + classname);
            }
            //if (Registry.has(classname)) {
            //    return Registry.getCommand(classname);
            //}
            var result = new Config.classes[classname](this.model, this.view, this.observer);
            //Registry.setCommand(result);
            if (!result) {
                throw new Error("Error command creation " + classname);
            }
            return result;

        } catch (e) {
            console.log(e.message + " " + e.lineNumber);
        }

    }
}

class CommandController extends Controller {
    constructor(model, view, observer) {
        super(model, view);
        this.observer = observer;
        this.name = this.constructor.name;
    }
    execute() {

    }
}
class CreaterectCommandController extends CommandController {
    constructor(model, view, observer) {
        super(model, view, observer);

    }
    execute() {
        this.model.addmeshrect(this.model.mouse);
        this.model.properties['mresize'] = true;
        this.observer.set('mouseup', 'CreaterectCommandController::end');


    }
    end() {
        //this.observer.set('mousedown', '');
        //this.observer.set('mouseup', '');
        this.observer.clear();
        this.model.properties['mresize'] = false;
    }

}
class CreatefigureCommandController extends CommandController {
    constructor(model, view, observer) {
        super(model, view, observer);
    }
    execute() {
        this.model.addmeshfigure(this.model.mouse);
        this.model.properties.maddline = true;
        this.observer.set('mousedown', 'CreatefigureCommandController::maddvertice');

    }
    maddvertice() {
        if (this.model.properties.maddlineclose) {
            this.observer.clear();
            this.model.properties.maddline = false;
            this.model.properties.maddlineclose = false;
            this.model.meshes[this.model.meshes.length - 1].finished = true;
        } else {
            this.model.meshes[this.model.meshes.length - 1].addvertice(this.model.mouse);
        }
    }
}
class DragMeshCommandController extends CommandController {
    constructor(model, view, observer) {
        super(model, view, observer);
    }
    execute() {
        //console.log("drag");
        this.model.properties['drag'] = true;
        this.observer.set('mouseup', 'DragMeshCommandController::end');
    }
    end() {
        this.model.properties['drag'] = false;
        this.model.properties['mfirst'] = true;
        this.observer.clear();
    }
}




class Request {

    constructor() {
        this.values = [];
        this.command = {};
        this.type = '';
        this.mdrag = false;
        this.indrag = false;
        this.mfirst = false;
        this.px = 0;
        this.py = 0;
        this.dx = 0;
        this.dy = 0;


    }
    setcommand(key, value) {
        if (key == '') {
            this.command = {};
            return;
        }
        this.command[key] = value;
    }
    getcommand() {}

}



class Registry {

    constructor() {}
    static setCommand(command) {
        if (!this.has(command.name)) {
            this.values.set(command.name, command);
        }
    }
    static getCommand(key) {
        if (this.has(key)) {
            return this.values.get(key);
        }
        return null;
    }
    static has(key) {
        return this.values.has(key);
    }

}
Registry.values = new Map();

class Config {
    constructor() {}

}
Config.classes = {
    CreaterectCommandController,
    CreatefigureCommandController,
    DragMeshCommandController
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Model {
    constructor() {
        this.cl = new Collision();
        this.properties = new Properties();
        this.meshes = [];
        this.difference = [];
        this.mouse = new Vec2();
        this.dmouse = new Vec2();
        this.d = new Vec2();
    }

    frame() {

        this.process();
        this.collisions();
    }

    process() {

        if (this.properties['maddline']) {
            if (this.cl.distancesquared(this.meshes[this.meshes.length - 1].vertices[0], this.mouse) < 50) {
                this.properties['maddlineclose'] = true;
            } else {
                this.properties['maddlineclose'] = false;
            }
        } else if (this.properties['mresize']) {
            this.meshes[this.meshes.length - 1].resize(this.mouse);
        } else if (this.properties['drag']) {
            var indexes = this.properties.activeindexes,
                i = 0,
                l = indexes.length;

            for (i = 0; i < l; i++) {

                if (this.properties['mfirst']) {
                    this.dmouse.set(this.mouse);
                    this.properties['mfirst'] = false;
                }
                this.meshes[indexes[i]].translate(this.mouse.x - this.dmouse.x, this.mouse.y - this.dmouse.y);
            }
            this.dmouse.set(this.mouse);


        }

    }

    collisions() {

        var i = 0,
            l = this.meshes.length,
            result = false;

        this.properties.activeindexes = [];
        this.properties.cldetected = [];

        for (i = 0; i < l; i++) {

            result = this.cl.collisionVec2Mesh(this.mouse, this.meshes[i].vertices);
            //console.log(result);
            if (result) {
                this.properties.activeindexes.push(i);
            }
        }

        if (this.meshes.length == 2) {
            result = this.cl.collision(this.meshes[0].vertices, this.meshes[1].vertices);
            if (result) {
                var arr = this.cl.simplex.basePointsArray();

                for(var i = 0; i < 6; i++) {
                    var a = arr[i],
                        b = null;
                    for(var j = i + 1; j < 6; j++) {
                        b = arr[j];
                        if(this.cl.isEqual(a, b)) {
                            this.properties.cldetected.push(a);
                        }
                    }

                }


            }
        }
        //console.log(this.properties.activeindexes);

    }

    getSelectedIndexes() {
        var i = 0,
            l = this.meshes.length;
        this.mselected = [];
        for (i = 0; i < l; i++) {
            if (this.meshes[i].overp === true) {
                this.mselected.push(i);
            }
        }
    }
    drags(dx, dy) {
        var i = 0,
            l = this.mselected.length;
        for (i = 0; i < l; i++) {
            this.meshes[this.mselected[i]].x += dx;
            this.meshes[this.mselected[i]].y += dy;
            this.meshes[this.mselected[i]].refresh();
        }
    }
    addmeshrect(coord) {
        this.meshes.push(new Rectangle(coord, 0, 0));
    }
    addmeshfigure(coord) {
        this.meshes.push(new Poligon(coord));
    }

    cl_rectpoint(r, point) {
        if (r.vertices[0].x > point.x || r.vertices[0].y > point.y || r.vertices[2].x < point.x || r.vertices[2].y < point.y) {
            return false;
        } else {
            return true;
        }
    }
    setmouse(x, y) {
        //this.dmouse.set(this.mouse);
        this.mouse.setPoints(x, y);
    }
}
class Mesh {
    constructor() {
        this.vertices = [];
        this.overp = false;
    }
    translate(x, y) {
        var i = 0,
            l = this.vertices.length;
        for (i = 0; i < l; i++) {
            this.vertices[i].x += x;
            this.vertices[i].y += y;
        }
        //this.x += x;
        //this.y += y;
    }
}
class Rectangle extends Mesh {
    constructor(coord, w, h) {
        super();
        this.x = coord.x;
        this.y = coord.y;
        this.w = w;
        this.h = h;
        this.vertices = [];
        this.finished = true;
        this.vertices[0] = new Vec2(coord.x, coord.y);
        this.vertices[1] = new Vec2(coord.x, coord.y + h);
        this.vertices[2] = new Vec2(coord.x + w, coord.y + h);
        this.vertices[3] = new Vec2(coord.x + w, coord.y);
        //this.refresh();
    }
    refresh() {
        this.vertices[0].x = this.x;
        this.vertices[0].y = this.y;
        this.vertices[1].x = this.x;

        this.vertices[1].y = this.y + this.h;
        this.vertices[2].x = this.x + this.w;
        this.vertices[2].y = this.y + this.h;
        this.vertices[1].x = this.x + this.w;
        this.vertices[1].y = this.y;

    }

    rotate(origin, angle) {
        var i = 0,
            l = this.vertices.length,
            cos = Math.cos(angle),
            sin = Math.sin(angle),
            t = new Vec2(),
            vertice = new Vec2();
        for (i = 0; i < l; i++) {
            vertice = this.vertices[i];
            t.x = vertice.x - origin.x;
            t.y = vertice.y - origin.y;
            vertice.x = (t.x * cos - t.y * sin) + origin.x;
            vertice.y = (t.x * sin + t.y * cos) + origin.y;
        }
        this.getaabb();
    }
    getaabb() {
        var i = 0,
            l = this.vertices.length,
            minx = 1024,
            miny = 1024,
            maxx = 0,
            maxy = 0,
            v = {};
        for (i = 0; i < l; i++) {
            v = this.vertices[i];
            if (v.x < minx) {
                minx = v.x;
            }
            if (v.x > maxx) {
                maxx = v.x;
            }
            if (v.y < miny) {
                miny = v.y;
            }
            if (v.y > maxy) {
                maxy = v.y;
            }
        }

        this.x = minx;
        this.y = miny;
        this.w = maxx - minx;
        this.h = maxy - miny;

    }
    resize(coord) {
        this.vertices[2].x = coord.x;
        this.vertices[2].y = coord.y;
        this.w = this.vertices[2].x - this.vertices[0].x;
        this.h = this.vertices[2].y - this.vertices[0].y;
        this.vertices[1].x = this.vertices[0].x;
        this.vertices[1].y = this.vertices[0].y + this.h;
        this.vertices[3].x = this.vertices[0].x + this.w;
        this.vertices[3].y = this.vertices[0].y;
    }
}

class Poligon extends Mesh {
    constructor(v) {
        super();
        this.vertices = [];
        this.finished = false;
        this.vertices.push(new Vec2(v.x, v.y));
    }
    addvertice(v) {
        this.vertices.push(new Vec2(v.x, v.y));
    }
}
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.a = null;
        this.b = null;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
    }
    set(coord) {
        this.x = coord.x;
        this.y = coord.y;
    }
    setPoints(x, y) {
        this.x = x,
            this.y = y;
    }
}
class Properties {
    constructor() {
        this.activeindexes = [];
        this.maddline = false;
        this.maddlineclose = false;
        this.drag = false;
        this.mfirst = true;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class View {
    constructor(model) {
        this.model = model;
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.center = new Vec2(this.width / 2, this.height / 2);
        this.label = document.getElementById("intoplabel");
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    frame() {
        this.clear();
        this.cross(this.model.mouse, 25);
        this.cross(this.center, 10, '#ff0000');
        //this.arc(this.center, 2, '#ff0000', 1);
        this.dr_mesheslines(this.model.meshes);


        if (this.model.properties.maddline) {
            this.dr_addline();
            if (this.model.properties.maddlineclose) {
                this.arc(this.model.meshes[this.model.meshes.length - 1].vertices[0], 5, '#550000', 1);
            }
        }

        this.debugdraw(this.center);

    }
    cross(center, size, color = '#000000', width = 0.5, offset = new Vec2()) {
        var hs = size / 2;
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.beginPath();
        this.context.moveTo(center.x - hs + offset.x, center.y + offset.y);
        this.context.lineTo(center.x + hs + offset.x, center.y + offset.y);
        this.context.moveTo(center.x + offset.x, center.y - hs + offset.y);
        this.context.lineTo(center.x + offset.x, center.y + hs + offset.y);
        this.context.stroke();
        this.context.closePath();
        this.context.strokeStyle = '#000000';
    }
    dr_meshes(meshes) {
        var i = 0,
            l = meshes.length,
            color = '';
        for (i = 0; i < l; i++) {
            if (meshes[i].overp) {
                color = '#ff0000';
            } else {
                color = '#000000';
            }
            this.dr_vertices(meshes[i].vertices, color);
        }
    }
    dr_mesheslines(meshes) {
        var i = 0,
            l = meshes.length,
            finished = true,
            color = '';
        for (i = 0; i < l; i++) {
            finished = meshes[i].finished;
            //if (meshes[i].overp) {
            //  color = '#ff0000';
            //} else {
            //  color = '#000000';
            //}
            this.dr_verticeslines(meshes[i].vertices, finished);
        }
    }
    dr_vertices(vertices, color = '#000000', width, offset = new Vec2()) {
        var i = 0,
            l = vertices.length;
        for (i = 0; i < l; i++) {
            this.cross(vertices[i], 6, color, width, offset);
        }
    }
    dr_verticeslines(vertices, finished = true, color = '#000000', width = 1, offset = new Vec2()) {
        var i = 0,
            l = vertices.length;
        this.context.lineWidth = width;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(vertices[0].x, vertices[0].y);
        for (i = 1; i < l; i++) {
            this.context.lineTo(vertices[i].x, vertices[i].y);
        }
        if (finished) {
            this.context.lineTo(vertices[0].x, vertices[0].y);
        }
        this.context.stroke();
        this.context.closePath();
    }
    dlabel(...args) {
        var s = '';
        for (var arg in arguments) {
            if (arguments.hasOwnProperty(arg)) {
                s += arguments[arg] + ' ';
            }
        }
        this.label.innerHTML = s;
    }
    debugdraw(offset = new Vec2()) {
        this.dr_vertices(this.model.cl.difference, '#0000ff', 0.3, offset);
        //if (this.model.meshes.length === 1) {
        var cl = this.model.cl;
        this.line(cl.simplex.get_a(), cl.add(cl.simplex.get_a(), cl.direction), "#00ffff", 0.5, offset);
        //this.line(cl.simplex.get_a(), cl.add(cl.simplex.get_a(), cl.AO), "#ffff00", 0.7, offset);
        this.line(cl.simplex.get_a(), cl.add(cl.simplex.get_a(), cl.ABproj), "#0000ff", 0.5, offset);
        this.line(cl.simplex.get_a(), cl.add(cl.simplex.get_a(), cl.ACproj), "#00ff00", 0.5, offset);
        this.arc(cl.simplex.get_a(), 3, '#ff0000', 1, offset);
        this.arc(cl.simplex.get_b(), 3, '#0000ff', 2, offset);
        if (cl.simplex.points() > 2) {
            this.arc(cl.simplex.get_c(), 3, '#00ff00', 3, offset);
        }
        //if(this.model.properties.cldetected.length > 0) {
        //    this.arc(this.model.properties.cldetected[0], 5, '#ffff00', 4);
        //}

        this.dlabel(cl.v);
        //}
    }
    arc(coord, radius, color, width, offset = new Vec2()) {
        this.context.lineWidth = width;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.arc(coord.x + offset.x, coord.y + offset.y, radius, 12, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.closePath();
    }
    line(start, end, color, width, offset = new Vec2()) {
        this.context.lineWidth = width;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(start.x + offset.x, start.y + offset.y);
        this.context.lineTo(end.x + offset.x, end.y + offset.y);
        this.context.stroke();
        this.context.closePath();
    }
    dr_addline() {
        var m = this.model.meshes[this.model.meshes.length - 1];
        this.line(m.vertices[m.vertices.length - 1], this.model.mouse);
    }
}
var core = new Core();