/*jshint esversion: 6 */

class Collision {
    constructor() {
        this.simplex = new Simplex();
        this.ABproj = new Vec2();
        this.ACproj = new Vec2();
        this.AO = new Vec2();
        this.direction = new Vec2();
        this.difference = [];
        this.v = '';


    }

    frame(verticesA, verticesB) {

        this.difference = this.Difference(verticesA, verticesB);
        collision(verticesA, verticesB);

    }

    collision(verticesA, verticesB) {

        var simplex = new Simplex(),
            direction = new Vec2(),
            vec2a = new Vec2(),
            vec2b = new Vec2();

        this.difference = this.Difference(verticesA, verticesB);

        //simplex.clear();
        direction = this.sub(verticesA[0], verticesB[0]);
        vec2a = this.support(verticesA, verticesB, direction);
        simplex.add(vec2a);
        direction = this.negate(direction);
        this.v = "";



        while (true) {


            vec2b = this.support(verticesA, verticesB, direction);

            //this.v = this.dot(vec2, this.direction);

            if (this.dot(vec2b, direction) < 0) { //test last simplex passed the origin

                break;
            }

            simplex.add(vec2b);


            var A = simplex.getlast(),
                B = simplex.get_b(),
                AB = this.sub(B, A),
                AO = this.negate(A),
                ABproj = new Vec2(), 
                ACproj = new Vec2();


            if (simplex.points() < 3) {

                ABproj = this.tripple(AB, AO, AB); // direction to the origin
                direction.set(ABproj);
                continue;


            } else { // simplex contains 3 points

                var C = simplex.get_c(),
                    AC = this.sub(C, A),
                    ACproj = new Vec2();


                ABproj = this.negate(this.tripple(AB, AC, AB));
                ACproj = this.negate(this.tripple(AC, AB, AC));


                this.simplex = simplex;
                this.ABproj = ABproj;
                this.ACproj = ACproj;
                this.AO = AO;
                this.direction = direction;


                if (this.dot(ABproj, AO) > 0) {
                    simplex.remove_c();
                    direction.set(ABproj);
                    this.v = "ABproj";
                    continue;
                }
                if (this.dot(ACproj, AO) > 0) {
                    simplex.remove_b();
                    direction.set(ACproj);
                    this.v = "ACproj";
                    continue;
                }

                this.v = "collision";
                return true;



            }

        }

        return false;

    }



    containOrigin(simplex) {

        return true; // this.direction direction modified


    }



    collisionVec2Mesh(vec2p, vertices) {
        var simplex = new Simplex(),
            ABproj = null, //vec2
            ACproj = null, //vec2
            AO = null, //vec2
            direction = null, //vec2
            vec2Bpoint = null; //vec2

        this.v = '';
        direction = this.sub(vec2p, vertices[0]);
        simplex.add(this.supportVec2Mesh(vertices, direction));
        direction = this.negate(direction);


        //this.difference = this.DifferenceVec2Mesh(vec2p, vertices);

        while (true) {


            vec2Bpoint = this.supportVec2Mesh(vertices, direction);
            //this.v = this.dot(this.simplex.getlast(), this.direction);
            //var dt = this.normalize(this.direction);
            //this.v = this.AO.x + ' ' + this.AO.y + " " + this.dot(this.AO, this.direction);
            //console.log(this.dot(this.AO, this.direction));
            AO = this.sub(vec2p, vec2Bpoint);
            if (this.dot(AO, direction) > 0) { //test last simplex passed the origin
                //    this.AO = new Vec2();
                //    this.v += ' fail';
                break;
            }
            simplex.add(vec2Bpoint);



            var A = simplex.get_a(),
                B = simplex.get_b(),
                AB = this.sub(B, A),
                ABproj = new Vec2(),
                ACproj = new Vec2();



            if (simplex.points() < 3) {

                ABproj = this.tripple(AB, AO, AB); // direction to the origin
                direction.set(ABproj);

                continue;

            } // simplex contains 3 points


            var C = new Vec2(),
                AC = new Vec2(),
                ACproj = new Vec2();

            C = simplex.get_c();
            AC = this.sub(C, A);

            ABproj = this.negate(this.tripple(AB, AC, AB));
            ACproj = this.negate(this.tripple(AC, AB, AC));

            //console.log('AB = ' + AB.x + ' ' + AB.y + '   AC = ' + AC.x + ' ' + AC.y);

            //this.simplex = simplex;
            //this.ABproj = ABproj;
            //this.ACproj = ACproj;
            //this.AO = AO;
            //this.direction = direction;

            if (this.dot(ABproj, AO) > 0) {
                simplex.remove_c();
                direction.set(ABproj);
                //this.v = "ABproj";
                continue;
            }
            if (this.dot(ACproj, AO) > 0) {
                simplex.remove_b();
                direction.set(ACproj);
                //this.v = "ACproj";
                continue;
            }

            this.v = "collision";
            return true;

        }

        return false;

    }


    containOriginVec2Mesh(simplex, AO, direction) {


    }

    isEqual(a, b) {
        if(a.x !== b.x || a.y !== b.y) {
            return false;
        }
        return true;
    }
    dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    negate(v) {
        var nv = new Vec2();
        nv.x = -v.x;
        nv.y = -v.y;
        return nv;
    }
    sub(a, b) {
        var c = new Vec2();
        c.x = a.x - b.x;
        c.y = a.y - b.y;
        return c;
    }
    add(a, b) {
        var c = new Vec2();
        c.x = a.x + b.x;
        c.y = a.y + b.y;
        return c;
    }
    mult(vec2, value) {
        var r = new Vec2();
        r.x = vec2.x * value;
        r.y = vec2.y * value;

        return r;
    }
    length(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }
    normalize(a) {
        var v = new Vec2(),
            l = this.length(a);
        v.x = a.x / l;
        v.y = a.y / l;
        return v;
    }
    tripple(a, b, c) {
        var ac = this.dot(a, c),
            ab = this.dot(a, b);
        //(axb)xc = (a*c)b - (b*c)a;
        return this.sub(this.mult(b, ac), this.mult(c, ab));
    }
    distancesquared(vec2a, vec2b) {
        var dx = vec2b.x - vec2a.x,
            dy = vec2b.y - vec2a.y;
        return dx * dx + dy * dy;
    }
    support(verticesA, verticesB, d) {
        var p1 = new Vec2(),
            p2 = new Vec2(),
            p3 = new Vec2();
        p1 = this.getFarthestPointAtDirrection(verticesA, d);
        d = this.negate(d);
        p2 = this.getFarthestPointAtDirrection(verticesB, d);
        p3 = this.sub(p1, p2);
        p3.a = p1;
        p3.b = p2;
        return p3;
    }

    supportVec2Mesh(vertices, d) {

        return this.getFarthestPointAtDirrection(vertices, d);
    }


    getFarthestPointAtDirrection(vertices, d) {
        var i = 0,
            l = vertices.length,
            rd = 0,
            max = -9999999999999,
            index = 0,
            v = new Vec2();
        for (i = 0; i < l; i++) {
            v = vertices[i];
            rd = this.dot(v, d);

            if (rd > max) {
                max = rd;
                index = i;
            }
        }

        return vertices[index];

    }
    Difference(a, b) {
        var i = 0,
            j = 0,
            l = a.length,
            l2 = b.length,
            difference = [];
        //r = new Point(0, 0);
        for (i = 0; i < l; i++) {
            for (j = 0; j < l2; j++) {
                var r = new Vec2();
                r.x = a[i].x - b[j].x;
                r.y = a[i].y - b[j].y;
                difference.push(r);
            }
        }
        return difference;
    }
    DifferenceVec2Mesh(vec2p, b) {
        var i = 0,
            l = b.length,
            difference = [];
        //r = new Point(0, 0);

        for (i = 0; i < l; i++) {
            var r = new Vec2();
            r.x = vec2p.x - b[i].x;
            r.y = vec2p.y - b[i].y;
            difference.push(r);
        }

        return difference;
    }

}
class Simplex {
    constructor() {
        this.simplex = [];
    }
    add(v) {

        this.simplex.unshift(v);

        if (this.points() > 3) {
            this.simplex.splice(3, 1);
        }
    }
    getlast() {
        return this.simplex[0];
    }
    get_a() {
        return this.simplex[0];
    }
    get_b() {
        return this.simplex[1];
    }
    get_c() {
        return this.simplex[2];
    }
    remove_a() {
        this.simplex.splice(0, 1);
    }
    remove_b() {
        this.simplex.splice(1, 1);
    }
    remove_c() {
        this.simplex.splice(2, 1);
    }
    points() {
        return this.simplex.length;
    }
    basePointsArray() {
        var simplex = this.simplex;
        return [simplex[0].a, simplex[0].b, simplex[1].a, simplex[1].b, simplex[2].a, simplex[2].b];
    }
    clear() {
        this.simplex = [];
    }

}