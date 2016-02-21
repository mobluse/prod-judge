/*
 * ProdJudge 0.5
 *
 * Copyright (c) 2009 Mikael Bonnier <http://www.df.lth.se.orbin.se/~mikaelb/>.
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 * Validated by <http://www.javascriptlint.com/online_lint.php>.
 */
var inid = 1, qid = 1;
/*
 * Codes according to The Major System.
 * 0 = s, z, soft c
 * 1 = d, t, th
 * 2 = n
 * 3 = m
 * 4 = r
 * 5 = l
 * 6 = j, sh, soft ch, dg, soft g
 * 7 = k, hard ch, hard c, hard g, ng, qu 	
 * 8 = f, v
 * 9 = b, p
 * - = a, e, i, o, u, h, w, y
 */
var GET_TOTAL_NO = 711152,
    GET_AXIS = 71700,
    GET_IMAGES = 71360,
    GET_ANSWERS = 712040,
    PUT_ANSWERS = 912040;
var nms = [];
var folder = "img/",
    ext = ".jpg",
    lrg = "_l";
    sml = "_s";
var uidi = 0, uids = [];
var reviewMode = false;
var paper = {}, hline = {}, progressbarback = {}, progressbar = {}, finished = false;
var SCALE = 100000;
var D = 60;
var p = [];    // p is an array with images
var W = 48, H = 48; // width and height of images
var SP = W/2;
var divLeft = {}, divRight = {};
var s = [];    // s is an array with sets (groups of vector-objects)
var vlines = [];
var totalNo = 0, subNo = 0;
var blinker = 0;
var arrowBlinker = 0;
function fn(name) {
    return folder + name + sml + ext;
}
function showEnlargement(name) {
    document.getElementById('large').src = folder + name + lrg + ext;
}
function hideEnlargement() {
    document.getElementById('large').src = "spacer.gif";
}
function getTotalNo() {
    var callback = function (json) {
        totalNo = parseInt(json['total_no'], 10);
    };
    var options = {parameters: {cmd: GET_TOTAL_NO, inid: inid}};
    HTTP.get("pj.php", callback, options);    
}
function save() {
    clearInterval(arrowBlinker);
    var divArrow = document.getElementById("divArrow");
    divArrow.style.visibility = "hidden";
    var txtEmail = document.getElementById("txtEmail");
    if (txtEmail.value == "email" || txtEmail.value === "") {
        txtEmail.style.color = "red";
        txtEmail.value = "email";
        txtEmail.blur();
        return;
    }
    var values = [];
    values['cmd'] = PUT_ANSWERS;
    values['email'] = txtEmail.value;
    txtEmail.style.visibility = "hidden";
	var divimg;
    var x1 = divLeft.offsetWidth + SP;
    var x2 = 12*D - divRight.offsetWidth - SP;
    for (var i = 0; i < nms.length; ++i) {
		divimg = p[i];
		values['pl' + divimg.iid] = ((divimg.attrs.x+SP-x1)*SCALE)/(x2-x1);
		values['pt' + divimg.iid] = divimg.attrs.y;
    }
    values['qid'] = qid;
    var callback = function (json) {
		uids.push(parseInt(json['uid'], 10));
        ++qid;
        getFilenames();
        getAxis();
    };
    HTTP.post("pj.php", values, callback, null);
}
function callback(json) {
    var txtEmail = document.getElementById("txtEmail");
    txtEmail.value = json['email'];
    txtEmail.style.color = "gray";
    var divimg;
    var coords = json['coords'];
    var x1 = divLeft.offsetWidth + SP;
    var x2 = 12*D - divRight.offsetWidth - SP;
    for (var i = 0; i < nms.length; ++i) {
        divimg = p[i];
        var iid = divimg.iid;
        var j;
        for (j = 0; j < nms.length; ++j) {
            if (coords[j][0] == iid) {
                break;
            }
        }
        s[i].translate((parseInt(coords[j][1], 10)*(x2-x1))/SCALE+x1-SP - divimg.attrs.x, 
            parseInt(coords[j][2], 10) - divimg.attrs.y);
        divimg.show();
    }
}
function getFilenames() {
    if (p.length > 0) {
        for (i = 0; i < nms.length; ++i) {
            p[i].remove();
            s[i].remove();
            vlines[i].remove();
        }
        p = [];
        s = [];
        vlines = [];
    }
    var callback = function (json) {
        console.log(json);
        nms = json['filenames'];
        if (nms.length === 0 || nms[0].length === 0) {
            return;
        }
        var iids = json['iids'];
        for (i = 0; i < nms.length; ++i) {
            p[i] = paper.image(fn(nms[i]), 0, 0, W, H);
            p[i]['index'] = i;
            p[i]['iid'] = parseInt(iids[i], 10);
            s[i] = paper.set();
            // vlines[i] = paper.line(SP, -2000, SP, 2000, {stroke: "gray"}).hide();
            vlines[i] = paper.rect(SP, H/2, 1, 4*D-H-H/2).attr({stroke: "gray"}).hide();
            s[i].push(vlines[i], p[i]);
        	p[i].toFront().mousedown(function (event) { if (!reviewMode) { drag(this, s[this.index], event); }}).mouseout(function (event) { 
                if (!window.dragging) { hideEnlargement(); vlines[this.index].hide(); }});
            p[i].mouseover(function (event) { 
                if (!window.dragging) { showEnlargement(nms[this.index]); vlines[this.index].show(); }});
        }
        resetImgs();
    };
    var options = {parameters: {cmd: GET_IMAGES, qid: qid}};
    HTTP.get("pj.php", callback, options);
}
function getAxis() {
    var callback = function (json) {
        var divQuestion = document.getElementById("divQuestion");
        if (json['question'] === undefined) {
            alert("Thank you very much for your participation.");
            qid = 1;
            subNo = 0;
            getFilenames();
            getAxis();
            var txtEmail = document.getElementById("txtEmail");
            txtEmail.value = "email";
            txtEmail.style.visibility = "visible";
            txtEmail.style.color = "gray";
            return;
        }
        setText(divQuestion, json['question']);
        var divDimension = document.getElementById("divDimension");
        setText(divDimension, json['dimension']);
        divLeft = document.getElementById("divLeft");
        setText(divLeft, json['left']);
        divLeft.style.left = 0 + "px";
        divLeft.style.top = 4*D-11 + "px";
        divRight = document.getElementById("divRight");
        setText(divRight, json['right']);
        divRight.style.left = 12*D - divRight.offsetWidth + "px";
        divRight.style.top = 4*D-11 + "px";
        if (hline['remove']) {
            hline.remove();
            progressbarback.remove();
            progressbar.remove();
        }
        hline = paper.line(divLeft.offsetWidth + SP, 4*D, 12*D - divRight.offsetWidth - SP, 4*D, {stroke: "green", "stroke-width": "2"});
        progressbarback = paper.rect(10*D - divRight.offsetWidth - SP - 1, H - 11, 2*D + 2, 
            SP/2 + 2).toFront().attr({stroke: "white", fill: "rgb(207, 207, 207)"});
        progressbar = paper.rect(10*D - divRight.offsetWidth - SP, H - 10, 2*D*subNo/totalNo, 
            SP/2).toFront().attr({stroke: "green", fill: "green"});
        // progressbar.animate({width: 2*D*subNo/totalNo}, 350);
        // paper.rect(0, 0, 12*D, screen.height).toBack().attr({stroke: "rgb(206, 206, 206)", fill: "rgb(206, 206, 206)"});
        if (json['frontispiece']) {
            setTimeout(function () { 
                alert(json['frontispiece']); 
            }, 800);
        } 
        else {
            blinker = setInterval(blink, 500);
        }
    };
    var options = {parameters: {cmd: GET_AXIS, qid: qid}};
    HTTP.get("pj.php", callback, options);
}
function progress(i) {
    clearInterval(blinker);
    var divDimension = document.getElementById("divDimension");
    divDimension.style.color = "black";
    vlines[i].hide();
    var animate = 0;
    var x = p[i].attrs.x, y = p[i].attrs.y;
    if (x < divLeft.offsetWidth) {
        vlines[i].translate(divLeft.offsetWidth - x, 0);
        animate = 1;
        x = divLeft.offsetWidth;
    }
    else if (x > 12*D - divRight.offsetWidth - W) {
        vlines[i].translate(12*D - divRight.offsetWidth - W - x, 0);
        animate = 1;
        x = 12*D - divRight.offsetWidth - W;
    }
    if (y < 1*D) {
        vlines[i].attr({y: 1*D+H/2, height: 4*D-D-H/2});
        animate = 2;
        y = 1*D;
    }
    else if (y > 7*D) {
        vlines[i].attr({y: 4*D, height: 7*D-4*D+H/2});
        animate = 2;
        y = 7*D;
    }
    if (animate) {
        p[i].animate({x: x, y: y}, 700);
    }
    if (!finished) {
        progressbar.animate({width: 2*D*(subNo + nms.length - i)/totalNo}, 350);
        if (i === 0) {
            setTimeout('alert("You may now adjust your placements.")', 800);
            document.getElementById("btnSave").disabled = undefined;
            document.getElementById("btnSave").focus();
            arrowBlinker = setInterval(blinkArrow, 500);
            finished = true;
            subNo += nms.length;
        }
        else {
            p[i-1].show();
        }
    }
}
function resetImgs() {
    for (i = 0; i < nms.length; ++i) {
        var nm = nms[i];
        var picture = p[i];
        var set = s[i];
        var vline = vlines[i];
        var r = Math.floor(Math.random() * nms.length);
        nms[i] = nms[r];
        p[i] = p[r];
        p[i]['index'] = i;
        s[i] = s[r];
        vlines[i] = vlines[r];
        nms[r] = nm;
        p[r] = picture;
        p[r]['index'] = r;
        s[r] = set;
        vlines[r] = vline;
    }
	for (i = 0; i < nms.length; ++i) {
		s[i].translate(0 - p[i].attrs.x, H - p[i].attrs.y).toFront().hide();
        vlines[i].attr({y: H+H/2, height: 4*D-H-H/2});
	}
    p[nms.length-1].show();
    var txtEmail = document.getElementById("txtEmail");
    txtEmail.style.color = "gray"; 
    document.getElementById("btnSave").disabled = "disabled";
    finished = false;
    // progressbar.attr({width: 0});
}
function blink() {
    var divDimension = document.getElementById("divDimension");
    if (divDimension.style.color == "white") {
        divDimension.style.color = "black";
    }
    else {
        divDimension.style.color = "white";
    }
}
function blinkArrow() {
    var divArrow = document.getElementById("divArrow");
    if (divArrow.style.visibility == "hidden") {
        divArrow.style.visibility = "visible";
    }
    else {
        divArrow.style.visibility = "hidden";
    }
}
window.onload = function () {
    Raphael.fn.line = function (x1, y1, x2, y2, params) {
        var paper = this;
        return paper.path(["M", x1, y1, "L", x2, y2]).attr(params);
    };
    paper = Raphael(0, 0, 12*D, screen.height);
    getTotalNo();
    getFilenames();
    document.getElementById("btnSave").onclick = function (event) { save(); };
    document.getElementById("txtEmail").onfocus = function (event) { 
        if (this.value == "email") { this.style.color = "black"; this.value = ""; }};
    document.getElementById("txtEmail").value = "email";
    getAxis();
};
