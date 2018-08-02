/*jshint esversion: 6 */


class Core {

	// ______________________________
	//|Controller -> Model <- View <-|
	//
	constructor() {
		this.controller = new Controller();
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

        this.dr_vertices(this.model.player.mesh.vertices);
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
	dr_vertices(vertices, color = '#000000', width = 5, offset = new Vec2()) {
		var i = 0,
			l = vertices.length;

		for (i = 0; i < l; i++) {
			this.cross(vertices[i], 6, color, width, offset);
		}
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
	arc(coord, radius, color, width, offset = new Vec2()) {
		this.context.lineWidth = width;
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.arc(coord.x + offset.x, coord.y + offset.y, radius, 12, 0, 2 * Math.PI);
		this.context.stroke();
		this.context.closePath();
	}
	line(start, end, color, width) {
		this.context.lineWidth = width;
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(start.x, start.y);
		this.context.lineTo(end.x, end.y);
		this.context.stroke();
		this.context.closePath();
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
	constructor() {

		this.model = new Model();
		this.view = new View(this.model);
		this.input = new Input(this.model);

	}

	init() {

		setInterval((e) => {
			this.frame();

		}, 1000 / 60);


	}
	frame() {

		this.input.frame();
		this.model.frame();

		this.view.frame();

	}


}

class Input {
	constructor(model) {

		this.model = model;
		this.canvas = document.getElementById("canvas");
		this.boundrect = this.canvas.getBoundingClientRect();
		this.actions = [];
		this.px = 0;
		this.py = 0;
		this.dx = 0;
		this.dy = 0;



		document.addEventListener("mousemove", (e) => {

			model.mouse.x = e.clientX - this.boundrect.left;
			model.mouse.y = e.clientY - this.boundrect.top;



		});
		this.canvas.addEventListener("mousedown", (e) => {


		});
		document.addEventListener("mouseup", (e) => {

		});
		document.addEventListener("keydown", (e) => {
			this.actions[e.keyCode] = true;
		});
		document.addEventListener("keyup", (e) => {
			this.actions[e.keyCode] = false;

		});
		document.addEventListener("wheel", (e) => {

			this.wheelvalue = e.deltaY;
		});
		document.getElementById("mcreate").addEventListener("click", (e) => {
			this.mcreate();
		});

	}

	inprocess() {
		this.dx = this.model.mouse.x - this.px;
		this.dy = this.model.mouse.y - this.py;
		this.px = this.model.mouse.x;
		this.py = this.model.mouse.y;
       
		if (this.actions[87]) this.model.player.up();
		if (this.actions[65]) this.model.player.left();
		if (this.actions[83]) this.model.player.down();
		if (this.actions[68]) this.model.player.right();
	}


	frame() {
        this.inprocess();
	}
	mcreate() {
		this.actions.mcreate = true;
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


class Model {

	constructor() {

		this.meshes = [];
		this.cl = new Collision();
		this.mselected = [];
		this.difference = [];
		this.mouse = new Vec2();
		this.d = new Vec2();
		this.player = new Creature(10, 10, 50, 50, "player");
	}

	frame() {

		this.collisions();
	}

	collisions() {



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
	addmesh(coord) {
		var m = new Mesh(coord.x, coord.y, 0, 0);
		this.meshes.push(m);
	}

	clRectPoints(meshes) {
		var i = 0,
			l = meshes.length;
		for (i = 0; i < l; i++) {
			if (this.cl_rectpoint(meshes[i], this.mouse)) {
				meshes[i].overp = true;

			} else {
				meshes[i].overp = false;
			}
		}
	}

	cl_rectpoint(mesh, point) {
		if (mesh.vertices[0].x > point.x || mesh.vertices[0].y > point.y || mesh.vertices[2].x < point.x || mesh.vertices[2].y < point.y) {
			return false;
		} else {
			return true;
		}
	}
}



class Mesh {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.vertices = [];
		this.vertices[0] = new Vec2();
		this.vertices[1] = new Vec2();
		this.vertices[2] = new Vec2();
		this.vertices[3] = new Vec2();
		this.overp = false;
		this.refresh();

	}
	refresh() {
		this.vertices[0].x = this.x;
		this.vertices[0].y = this.y;
		this.vertices[1].x = this.x;
		this.vertices[1].y = this.y + this.h;
		this.vertices[2].x = this.x + this.w;
		this.vertices[2].y = this.y + this.h;
		this.vertices[3].x = this.x + this.w;
		this.vertices[3].y = this.y;
	}
	translate(x, y) {
		var i = 0,
			l = this.vertices.length;
		for (i = 0; i < l; i++) {
			this.vertices[i].x += x;
			this.vertices[i].y += y;
		}
		this.x += x;
		this.y += y;
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
		//minx = Math.round(minx).toFixed(2);
		//miny = Math.round(miny).toFixed(2);
		//maxx = Math.round(maxx).toFixed(2);
		//maxy = Math.round(maxy).toFixed(2);
		this.x = minx;
		this.y = miny;
		this.w = maxx - minx;
		this.h = maxy - miny;
		//this.label.innerHTML = minx + " " + maxx;
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

class Vec2 {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	negate() {
		this.x = -this.x;
		this.y = -this.y;
	}
	set(coord) {
		this.x = coord.x;
		this.y = coord.y;
	}
}

class Creature {
	constructor(x, y, w, h, name) {
		this.name = name;
		this.velocity = 3;
		this.mesh = new Mesh(x, y, w, h);
	}
	translate(x, y) {
		this.mesh.translate(x, y);
	}
    right() {
		this.translate(this.velocity, 0);
	}
	left() {
		this.translate(-this.velocity, 0);
	}
	down() {
		this.translate(0, this.velocity);
	}
	up() {
		this.translate(0, -this.velocity);
	}

}

var core = new Core();