"use strict";
var App = function() {

    var that = this;

    this.xmlhttp = null;
    this.type = "";

}
App.prototype.init = function() {
    var that = this,
        parameters = [];

    parameters["that"] = that;

    if (window.XMLHttpRequest) {
        that.xmlhttp = new XMLHttpRequest();
    } else {
        that.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    that.type = "en";
    that.outindexform(parameters);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.prototype.bind = function(parameters) {
    var element = parameters["element"],
        response = parameters["response"];
    element.addEventListener(parameters["event"], function(e) {
        parameters["e"] = e;
        response(parameters);
    });
}

App.prototype.stateIsOk = function(xmlhttp) {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        return true;
    } else {
        return false;
    }
}
App.prototype.response = function(parameters) {
    var that = parameters["that"],
        xmlhttp = that.xmlhttp,
        result = "",
        inEl = null,
        outfunc = null;
    if (!that.stateIsOk(xmlhttp)) {
        return;
    }
    result = xmlhttp.responseText;
    inEl = parameters["inEl"];
    inEl.innerHTML = result;
    outfunc = parameters["outfunc"];
    if (outfunc != null && outfunc != "undefined") {
        outfunc(parameters);
    }
}
App.prototype.open = function(inparameters) {
    var that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        url = inparameters["url"],
        data = inparameters["data"];
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);
}
App.prototype.xht = function(parameters) {
    var that = parameters["that"],
        xmlhttp = that.xmlhttp,
        response = parameters["response"];
    if (parameters["response"] !== null) {
        xmlhttp.onreadystatechange = function(e) {
            response(parameters);
        }
    }
    this.open(parameters);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.prototype.innewbutton = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        chd = document.getElementById("inchbox"),
        v = "";
    parameters["that"] = that;
    parameters["url"] = "index/drawform";
    parameters["response"] = that.response;
    parameters["inEl"] = inparameters["inEl"];
    parameters["type"] = that.type;
    v = that.checkboxget();
    if (v === "en") {
        parameters["data"] = "formname=entity";
        parameters["outfunc"] = that.outeNtt;
    } else if (v === "at") {
        parameters["data"] = "formname=attribute";
        parameters["outfunc"] = that.outaTtr;
    }
    that.xht(parameters);
}
App.prototype.inopb = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        cb = 0,
        v = "";
    parameters["that"] = that;
    parameters["inEl"] = document.getElementById("_in");
    parameters["outfunc"] = that.outlistEd;
    parameters["type"] = that.type;
    that.inlistEd(parameters);
}
App.prototype.inDelete = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        elements = null,
        result = [],
        e = inparameters["e"],
        parent = e.target.parentNode,
        v = "";
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["url"] = "index/delete";
    parameters["response"] = null;
    parameters["inEl"] = null;
    parameters["outfunc"] = null;
    elements = that.getchildById(parent.id, "_in_sT").children;
    result = that.checkboxgetAll(elements);
    parameters["data"] = "deleteids=" + result.join() + "&type=" + parameters["type"];
    if (result.length !== 0) {
        that.xht(parameters);
    }
}
App.prototype.inEdit = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        divarray = null,
        outparameters = null,
        result = [],
        e = inparameters["e"],
        parent = e.target.parentNode,
        url = "",
        v = "";
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["url"] = "index/listEdById";
    parameters["response"] = that.response;
    parameters["inEl"] = document.getElementById("_in");
    parameters["outfunc"] = null;
    divarray = that.getchildById(parent.id, "_in_sT").children;
    result = that.checkboxgetAll(divarray);
    parameters["data"] = "ids=" + result.join() + "&type=" + parameters["type"] + "&formname=loop";
    that.xht(parameters);
}
App.prototype.inSave = function(inparameters) {
    var that = inparameters["that"],
        parameters = [],
        n = document.getElementById("name").value,
        t = document.getElementById("text").value;
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["url"] = "index/insert";
    parameters["data"] = "name=" + n + " &text=" + t + "&type=" + parameters["type"];
    parameters["response"] = that.inSave;
    parameters["outfunc"] = null;
    that.xht(parameters);
}
App.prototype.inBox = function(inparameters) {
    var that = inparameters["that"],
        e = inparameters["e"],
        id = inparameters["id"],
        v = "";
    that.checkboxclear(id);
    e.target.checked = true;
    v = that.checkboxget();;
    that.type = v;
    document.getElementById("_in").innerHTML = "";
}
App.prototype.inlistEd = function(inparameters) {
    var parameters,
        that;

    parameters = [];
    that = inparameters["that"];
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["url"] = "index/drawform";
    parameters["data"] = "formname=listEd";
    parameters["response"] = that.response;
    parameters["inEl"] = inparameters["inEl"];
    parameters["outfunc"] = inparameters["outfunc"];
    that.xht(parameters);
}
App.prototype.insSev = function(inparameters) {
    var that = inparameters["that"],
        parameters = [],
        e = inparameters["e"],
        parent = e.target.parentNode,
        searchfield = that.getchildById(parent.id, "listEdsearchfield"),
        searchstring = "",
        v = "";
    searchstring = searchfield.value;
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["url"] = "index/assumption";
    parameters["data"] = "searchstring=" + searchstring + "&type=" + parameters["type"] + "&formname=loop";
    parameters["response"] = that.response;
    parameters["inEl"] = that.getchildById(parent.id, "_in_sT");
    //parameters["outfunc"] = null;
    that.xht(parameters);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
App.prototype.outindexform = function(inparameters) {
    var parameters = [],
        that = inparameters["that"];
    parameters["that"] = that;
    parameters["id"] = "inchbox";
    that.checkboxevents(parameters);
    parameters["type"] = "en";
    parameters["inEl"] = document.getElementById("_in");
    parameters["event"] = "click";
    parameters["response"] = that.innewbutton;
    parameters["element"] = document.getElementById("innewb");
    this.bind(parameters);
    parameters["response"] = that.inopb;
    parameters["element"] = document.getElementById("inopb");
    this.bind(parameters);
}
App.prototype.outlistEd = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        result = "";
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["element"] = document.getElementById("listEdsearchfield");
    parameters["event"] = "keyup";
    parameters["response"] = that.insSev;
    that.bind(parameters);
    document.getElementById("listEdattraddbutton").style.display = "none";
    parameters["element"] = document.getElementById("listEdeditbutton");
    parameters["event"] = "click";
    parameters["response"] = that.inEdit;
    that.bind(parameters);
    parameters["element"] = document.getElementById("listEdattrdeletebutton");
    parameters["response"] = that.inDelete;
    that.bind(parameters);
    parameters["url"] = "index/drawparseform";
    parameters["data"] = "formname=loop&type=" + parameters["type"];
    parameters["response"] = that.response;
    parameters["inEl"] = document.getElementById("_in_sT");
    parameters["outfunc"] = null;
    that.xht(parameters);
}
App.prototype.outeNtt = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        inEl = inparameters["inEl"];
    if (!that.stateIsOk(xmlhttp)) {
        return;
    }
    inEl.innerHTML = xmlhttp.responseText;
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["event"] = "click";
    parameters["element"] = document.getElementById("eNlistaTed");
    parameters["response"] = null;
    that.bind(parameters);
    parameters["element"] = document.getElementById("eNsave");
    parameters["response"] = that.inSave;
    that.bind(parameters);
}
App.prototype.outaTtr = function(inparameters) {
    var parameters = [],
        that = inparameters["that"],
        xmlhttp = that.xmlhttp,
        inEl = inparameters["inEl"];
    if (!that.stateIsOk(xmlhttp)) {
        return;
    }
    inEl.innerHTML = xmlhttp.responseText;
    parameters["that"] = that;
    parameters["type"] = inparameters["type"];
    parameters["element"] = document.getElementById("aTsave");
    parameters["event"] = "click";
    parameters["response"] = that.inSave;
    that.bind(parameters);
}
App.prototype.outSave = function(parameters) {
        document.getElementById("name").value = "";
        document.getElementById("text").value = "";
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
App.prototype.getpresented = function(presented) {
    var i = 0,
        l = presented.length,
        result = [];
    for (i = 0; i < l; i++) {
        result.push(presented[i].title);
    }
    return result;
}
App.prototype.sortIsThere = function(toadd, presented) {
    var i = 0,
        j = 0,
        l = 0,
        l2 = 0,
        found = false,
        result = [];
    l = toadd.length;
    l2 = presented.length;
    for (i = 0; i < l; i++) {
        for (j = 0; j < l2; j++) {
            if (toadd[i] === presented[j]) {
                found = true;
                break;
            }
        }
        if (!found) {
            result.push(toadd[i]);
        } else {
            found = false;
        }
    }
    return result;
}
App.prototype.addarrtoarr = function(a, b) {
    var i = 0,
        l = b.length;
    for (i = 0; i < l; i++) {
        a.push(b[i]);
    }
    return a;
}
App.prototype.getchildById = function(parentid, childrenid) {
    var i = 0,
        v = document.getElementById(parentid).children,
        l = v.length;
    for (i = 0; i < l; i++) {
        if (v[i].id === childrenid) {
            return v[i];
        }
    }
    return null;
}
App.prototype.remove = function() {}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.prototype.checkboxevents = function(inparameters) {
    var i = 0,
        that = inparameters["that"],
        id = inparameters["id"],
        chboxes = document.getElementById(id).children,
        l = chboxes.length,
        parameters = [];
    parameters["that"] = that;
    parameters["event"] = "click";
    parameters["response"] = that.inBox;
    parameters["id"] = inparameters["id"];
    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {
            parameters["element"] = chboxes[i];
            that.bind(parameters);
        }
    }
}
App.prototype.checkboxclear = function(id) {
    var i = 0,
        chboxes = document.getElementById(id).children,
        l = chboxes.length;
    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {
            chboxes[i].checked = true ? false : false;
        }
    }
}
App.prototype.checkboxget = function() {
    var i = 0,
        chboxes = document.getElementById("inchbox").children,
        l = chboxes.length;
    for (i = 0; i < l; i++) {
        if (chboxes[i].type === "checkbox") {
            if (chboxes[i].checked === true) {
                return chboxes[i].id;
            }
        }
    }
    return -1;
}

App.prototype.checkboxgetAll = function(chboxes) {
    var i = 0,
        l = chboxes.length,
        result = [];
    for (i = 0; i < l; i++) {
        if (chboxes[i].children[0].type === "checkbox") {
            if (chboxes[i].children[0].checked === true) {
                result.push(chboxes[i].title);
            }
        }
    }
    return result;
}



