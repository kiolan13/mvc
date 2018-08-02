class Tree {
    constructor(parameters) {
        this.nodes = [];
        this.acell = [];
        this.outid = [];
        this.list = [];
        this.index = 0;

        if (window.XMLHttpRequest) {
            this.xmlhttp = new XMLHttpRequest();
        } else {
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

    }
    init(parameters) {
        parameters["xmlhttp"] = this.xmlhttp;
    }

    initroot() {

        var parameters = [];

        if (window.XMLHttpRequest) {
            this.xmlhttp = new XMLHttpRequest();
        } else {
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        parameters["url"] = "app/drawroot";
        parameters["data"] = "formname=menu";
        parameters["xmlhttp"] = this.xmlhttp;
        parameters["outfunc"] = "out";
        parameters["id"] = "_in";
        parameters["parent"] = this;
        parameters["root"] = this;
        this.nodes = [];
        this.acell = [];
        this.outid = [];
        this.list = [];
        this.type = "en";
        this.parameters = parameters;

    }

    stateIsOk(xmlhttp) {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            return true;
        } else {
            return false;
        }
    }

    load() {
        var parameters = this.parameters,
            url = parameters["url"],
            data = parameters["data"],
            xmlhttp = this.xmlhttp,
            outfunc = parameters["outfunc"],
            result = null;
        xmlhttp.onreadystatechange = (e) => {
            if (!this.stateIsOk(xmlhttp)) {
                return;
            }

            if (xmlhttp.responseText) {
                result = JSON.parse(xmlhttp.responseText);
            }

            parameters["result"] = result;
            //this.data = result;

            if (outfunc != null && outfunc != "undefined") {
                this[outfunc](parameters);
            }
        };

        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(data);

    }


    bind(parameters) {
        var id = parameters["elid"],
            event = parameters["event"],
            infunc = parameters["infunc"],
            label = document.getElementById("intoplabel"),
            el = null;

        try {
            el = document.getElementById(id);
            if (el == null) {
                throw "no el " + id + " " + event + " " + infunc + "; ";
            }
        } catch (err) {
            //label.innerHTML += err.message;
        }


        //root.list[id] = this.index;
        el.addEventListener(event, (e) => {
            parameters["e"] = e;
            this[infunc](parameters);
        });
    }

    outdataset(parameters) {
        var result = parameters["result"],
            pr = result["parameters"],
            label = document.getElementById("intoplabel");


        if (result["parameters"] != null) {
            pr = result["parameters"];
            for (var v in pr) {
                //if (!pr.hasOwnProperty(v)) continue;

                if (pr[v]["id"] == null || pr[v]["event"] == null || pr[v]["infunc"] == null) {
                    //label.innerHTML += "No bind " + v + "; ";
                } else {
                    //label.innerHTML += "Binding " + v + "; ";
                    parameters["name"] = v;
                    parameters["elid"] = pr[v]["id"];
                    parameters["event"] = pr[v]["event"];
                    parameters["infunc"] = pr[v]["infunc"];
                    this.bind(parameters);
                }
            }

        }


        this.pr = result["parameters"];

    }

    out(parameters) {
        var result = parameters["result"],
            id = parameters["id"];
        document.getElementById(id).innerHTML = result["html"];
        this.outdataset(parameters);
    }
    outnoset(parameters) {
        var result = parameters["result"],
            id = parameters["id"];
        document.getElementById(id).innerHTML = result["html"];
    }

    getByIndex(tree, index) {
        var r = null;
        if (tree.index != index) {
            r = this.getByIndex(tree.nodes[0], index);
        } else {
            r = tree;
        }
        return r;
    }
    getByNameFromPr(name) {
        for (var v in this.pr) {
            if (this.pr[v]["name"] === name) {

                return this.pr[v]["id"];
            }
        }
        return null;
    }
    getlistfromElement(id) {
        var childrenNodes = document.getElementById(id).children;
        return childrenNodes;
    }
    getallidfromList(id) {
        var childrenNodes = this.getlistfromElement(id),
            i = 0,
            l = childrenNodes.length,
            result = [];
        for (i = 0; i < l; i++) {
            result.push(childrenNodes[i].title);
        }
        return result;
    }
    getIdfromList(id) {
        var childrenNodes = this.getlistfromElement(id),
            i = 0,
            l = childrenNodes.length,
            r = null,
            result = [];

        for (i = 0; i < l; i++) {
            r = childrenNodes[i];
            if (r.children.length == 0) continue;
            if (r.children[0].checked == true) {
                result.push(r.title);
            }

        }
        return result;

    }
}




var root = new Tree();
root.initroot();
root.load();