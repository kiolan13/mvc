
var Tree = function(parameters) {

    this.xmlhttp = null;
    this.nodes = [];
    this.parent = null;
    this.id = null;
    this.index = 0;
    this.outid = null;
    this.acell = [];
    this.target = null;
    this.list = {};

    this.label = null;
    this.init(parameters);

}

Tree.prototype.init = function(parameters) {
    if (parameters != null) {

        this.xmlhttp = parameters["xmlhttp"];
        this.parent = parameters["parent"];
        this.id = parameters["id"];
        this.type = parameters["type"];
        parameters["response"] = this.response;
        parameters["that"] = this;
        parameters["setid"] = true;
        if (this.parent != null) {
            this.index = this.parent.index + 1;
        }
        this.parameters = parameters;

    }

}

Tree.prototype.initroot = function() {
    var parameters = [];

    if (window.XMLHttpRequest) {
        this.xmlhttp = new XMLHttpRequest();
    } else {
        this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    this.label = document.getElementById("intoplabel");

    parameters["url"] = "index/drawformfromclass";
    parameters["id"] = "root";
    parameters["data"] = "formname=menu";
    parameters["outfunc"] = this.out;
    parameters["xmlhttp"] = this.xmlhttp;
    parameters["that"] = this;
    this.id = parameters["id"];
    this.name = "root";
    this.parameters = parameters;

    this.load();


}

Tree.prototype.load = function() {
    var parameters = this.parameters,
        that = parameters["that"],
        xmlhttp = that.xmlhttp,
        url = parameters["url"],
        outfunc = parameters["outfunc"],
        data = parameters["data"],
        result = "";

    xmlhttp.onreadystatechange = function(e) {

        if (!that.stateIsOk(xmlhttp)) {
            return;
        }

        result = JSON.parse(xmlhttp.responseText);
        parameters["result"] = result;


        if (result["outid"] != "undefined") {
            that.outid = result["outid"];
        }


        if (outfunc != null && outfunc != "undefined") {
            outfunc(parameters);
        }
    }

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);

}

Tree.prototype.loadnoid = function() {
    var parameters = this.parameters,
        that = parameters["that"],
        xmlhttp = that.xmlhttp,
        url = parameters["url"],
        outfunc = parameters["outfunc"],
        data = parameters["data"],
        result = "";

    xmlhttp.onreadystatechange = function(e) {
        if (!that.stateIsOk(xmlhttp)) {
            return;
        }

        result = JSON.parse(xmlhttp.responseText);
        parameters["result"] = result;

        if (outfunc != null && outfunc != "undefined") {
            outfunc(parameters);
        }
    }

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);

}


Tree.prototype.stateIsOk = function(xmlhttp) {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        return true;
    } else {
        return false;
    }
}


Tree.prototype.bind = function(parameters) {
    var that = parameters["that"],
        id = parameters["id"],
        event = parameters["event"],
        infunc = parameters["infunc"],
        el = document.getElementById(id);
    that.acell.push(el);
    root.list[id] = that.index;
    el.addEventListener(parameters["event"], function(e) {
        parameters["e"] = e;
        infunc(parameters);

    });
}

Tree.prototype.delete = function(parameters) {
    var that = parameters["that"];
    document.getElementById(that.id).innerHTML = "";
    if (that.parent != null) {
        that.parent.nodes = [];
    }
}




Tree.prototype.getByIndex = function(tree, index) {
    r = null;
    if (tree.index != index) {
        r = root.getByIndex(tree.nodes[0], index);
    } else {
        r = tree;
    }
    return r;
}

Tree.prototype.outprepare = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        acell = result["acell"],
        i = 0,
        l = 0;

    if (acell != null) {

        for (var v in acell) {

            if (!acell.hasOwnProperty(v)) continue;

            parameters["id"] = acell[v]["id"];
            parameters["name"] = v;
            parameters["event"] = acell[v]["event"];
            parameters["infunc"] = that[acell[v]["infunc"]];
            that.bind(parameters);
        }

    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Tree.prototype.out = function(parameters) {
    var that = parameters["that"],
        result = parameters["result"],
        id = parameters["id"];

    document.getElementById(id).innerHTML = result["html"];
    that.outprepare(parameters);

}

Tree.prototype.outlistEd = function(parameters) {
    var that = parameters["that"],
        id = parameters["id"],
        e = parameters["e"],
        //index = root.list[e.target.id],
        result = parameters["result"];
    document.getElementById(id).innerHTML = result["html"];
    //that = root.getByIndex(root, index);
    that.outprepare(parameters);
    parameters["url"] = "index/drawparseform";
    parameters["id"] = that.outid["in"]["id"];
    parameters["outfunc"] = that.out;
    parameters["data"] = "formname=loop&type=en";
    that.loadnoid();
}

Tree.prototype.outcatnew = function(parameters) {
        var that = parameters["that"],
            id = parameters["id"],
            result = parameters["result"];
        document.getElementById(id).innerHTML = result["html"];
        that.outprepare(parameters);
        parameters["url"] = "index/drawformfromclass";
        parameters["id"] = that.outid["in"]["id"];
        parameters["outfunc"] = that.outlistEd;
        parameters["data"] = "formname=listEd";
        parameters["parent"] = that;
        parameters["target"] = parameters["parent"];
        that.nodes[0] = new Tree(parameters);
        that.nodes[0].load();
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


Tree.prototype.inmenunew = function(parameters) {
    var that = null,
        e = parameters["e"],
        index = root.list[e.target.id];
    that = root.getByIndex(root, index);
    parameters["id"] = that.outid["in"]["id"];
    parameters["parent"] = that;


    that.nodes[0] = new catTree(parameters);
    that.nodes[0].load();
}

Tree.prototype.inmenuop = function(parameters) {
    var that = null,
        e = parameters["e"],
        index = root.list[e.target.id];

    that = root.getByIndex(root, index);
    parameters["that"] = that;
    parameters["id"] = that.outid["in"]["id"];
    parameters["parent"] = that;


    that.nodes[0] = new listEdTree(parameters);
    that.nodes[0].load();

}

Tree.prototype.inlistEdsf = function(parameters) {
    var that = null,
        e = parameters["e"],
        searchstring = e.target.value,
        index = root.list[e.target.id];

    that = root.getByIndex(root, index);
    parameters["url"] = "index/assumption";
    parameters["id"] = that.outid["in"]["id"];
    parameters["outfunc"] = that.out;
    parameters["data"] = "formname=loop&type=en&searchstring=" + searchstring;
    that.loadnoid(parameters);


}
Tree.prototype.incatsave = function() {

}

var menuTree = function(parameters) {
    Tree.call(this, parameters);
}

menuTree.prototype = Object.create(Tree.prototype);
menuTree.prototype.constructor = menuTree;
menuTree.prototype.init = function(parameters) {
  

    if (parameters == null) {
        var parameters = [];
    }
    if (parameters["parent"] != "undefined" && parameters["parent"] != null) {
       
        this.parent = parameters["parent"];
        this.index = this.parent.index + 1;
    }

    this.xmlhttp = parameters["xmlhttp"];
    this.id = parameters["id"];

    parameters["url"] = "index/drawformfromclass";
    parameters["id"] = "root";
    parameters["data"] = "formname=menu";
    parameters["outfunc"] = this.out;
    parameters["that"] = this;


}

var catTree = function(parameters) {
    Tree.call(this, parameters);
}

catTree.prototype = Object.create(Tree.prototype);
catTree.prototype.constructor = catTree;
catTree.prototype.init = function(parameters) {
    var that = parameters["that"];
        

    if (parameters["parent"] != "undefined") {
        this.parent = parameters["parent"];
        this.index = this.parent.index + 1;
    }

    this.xmlhttp = parameters["xmlhttp"];
    this.id = parameters["id"];

    parameters["that"] = this;
    parameters["url"] = "index/drawformfromclass";
    parameters["outfunc"] = that.outcatnew;
    parameters["data"] = "formname=cat";
    this.parameters = parameters;
}

var listEdTree = function(parameters) {
    Tree.call(this, parameters);
}

listEdTree.prototype = Object.create(Tree.prototype);
listEdTree.prototype.constructor = listEdTree;
listEdTree.prototype.init = function(parameters) {

    if (parameters["parent"] != "undefined") {
        this.parent = parameters["parent"];
        this.index = this.parent.index + 1;
    }

    this.xmlhttp = parameters["xmlhttp"];
    this.id = parameters["id"];

    parameters["that"] = this;
    parameters["url"] = "index/drawformfromclass";
    parameters["outfunc"] = this.outlistEd;
    parameters["data"] = "formname=listEd";
    this.parameters = parameters;
}




var root = new menuTree(null);
root.initroot();
