/*
 * ProdJudge 0.3
 *
 * Copyright (c) 2009 Mikael Bonnier <http://www.df.lth.se.orbin.se/~mikaelb/>.
 * Licensed under the MIT <http://www.opensource.org/licenses/mit-license.php> license.
 * Validated by <http://www.javascriptlint.com/online_lint.php>.
 */
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
var GET_AXIS = 71700,
    GET_IMAGES = 71360,
    GET_ANSWERS = 712040,
    PUT_ANSWERS = 912040;
var nms = [];
var folder = "img/",
    ext = ".jpg",
    lrg = "_l";
    sml = "_s";
function fn(name) {
    return folder + name + sml + ext;
}
function showEnlargement(name) {
    document.getElementById('large').src = folder + name + lrg + ext;
}
function hideEnlargement() {
    document.getElementById('large').src = folder + "spacer.gif";
}
var uidi = 0, uids = [];
var reviewMode = false;
var paper = {}, hline = {}, progressbar = {}, finished = false;
var SCALE = 100000;
var D = 60;
var p = [];    // p is an array with images
var W = 48, H = 48; // width and height of images
var SP = W/2;
var divLeft = {}, divRight = {};
var s = [];    // s is an array with sets (groups of vector-objects)
var vlines = [];
function save() {
    var values = [];
    values['cmd'] = PUT_ANSWERS;
    var txtEmail = document.getElementById("txtEmail");
    values['email'] = txtEmail.value;
	var divimg;
    var x1 = divLeft.offsetWidth + SP;
    var x2 = 12*D - divRight.offsetWidth - SP;
    for (var i = 0; i < nms.length; ++i) {
		divimg = p[i];
		values['pl' + divimg.iid] = ((divimg.attrs.x+SP-x1)*SCALE)/(x2-x1);
		values['pt' + divimg.iid] = divimg.attrs.y;
    }
    var callback = function (json) {
		uids.push(parseInt(json['uid'], 10));
        document.getElementById("btnReview").disabled = undefined;
		resetImgs();
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
function review() {
    var btnReview = document.getElementById("btnReview");
    var btnSave = document.getElementById("btnSave");
    var btnBack = document.getElementById("btnBack");
    var btnNext = document.getElementById("btnNext");
    var txtEmail = document.getElementById("txtEmail");
    if (reviewMode) {
        reviewMode = false;
        btnReview.style.fontWeight = "normal";
        btnSave.disabled = undefined;
        btnBack.disabled = "disabled";
        btnNext.disabled = "disabled";
        resetImgs();
    }
    else {
        reviewMode = true;
        btnReview.style.fontWeight = "bold";
        btnSave.disabled = "disabled";
        btnBack.disabled = undefined;
        btnNext.disabled = undefined;
        uidi = uids.length-1;
        var options = {parameters: {cmd: GET_ANSWERS, uid: uids[uidi], qid: 1}};
        HTTP.get("pj.php", callback, options);
    }
}
function next() {
    ++uidi;
    if (uidi > uids.length-1) {
        uidi = 0;
    }
    var options = {parameters: {cmd: GET_ANSWERS, uid: uids[uidi], qid: 1}};
    HTTP.get("pj.php", callback, options);    
}
function back() {
    --uidi;
    if (uidi < 0) {
        uidi = uids.length-1;
    }
    var options = {parameters: {cmd: GET_ANSWERS, uid: uids[uidi], qid: 1}};
    HTTP.get("pj.php", callback, options);    
}
function getAxis() {
    var callback = function (json) {
        var divQuestion = document.getElementById("divQuestion");
        setText(divQuestion, json['question']);
        divLeft = document.getElementById("divLeft");
        setText(divLeft, json['left']);
        divLeft.style.left = 0 + "px";
        divLeft.style.top = 6*D-9 + "px";
        divRight = document.getElementById("divRight");
        setText(divRight, json['right']);
        divRight.style.left = 12*D - divRight.offsetWidth + "px";
        divRight.style.top = 6*D-9 + "px";
        hline = paper.line(divLeft.offsetWidth + SP, 6*D, 12*D - divRight.offsetWidth - SP, 6*D, {stroke: "green"});
        paper.rect(10*D - divRight.offsetWidth - SP - 1, H - 1, 2*D + 2, SP/2 + 2).toFront().attr({stroke: "white", fill:"gray"});
        progressbar = paper.rect(10*D - divRight.offsetWidth - SP, H, 0, SP/2).toFront().attr({stroke: "green", fill:"green"});
        // paper.rect(0, 0, 12*D, screen.height).toBack().attr({stroke: "rgb(206, 206, 206)", fill: "rgb(206, 206, 206)"});
    };
    var options = {parameters: {cmd: GET_AXIS, qid: 1}};
    HTTP.get("pj.php", callback, options);
}
function progress(i) {
    vlines[i].hide();
    if (p[i].attrs.x < divLeft.offsetWidth) {
        vlines[i].translate(divLeft.offsetWidth - p[i].attrs.x, 0);
        p[i].animate({x: divLeft.offsetWidth}, 700);
    }
    else if (p[i].attrs.x > 12*D - divRight.offsetWidth - W) {
        vlines[i].translate(12*D - divRight.offsetWidth - W - p[i].attrs.x, 0);
        p[i].animate({x: 12*D - divRight.offsetWidth - W}, 700);
    }
    if (!finished) {
        progressbar.animate({width: 2*D*(nms.length-i)/nms.length}, 350);
        if (i === 0) {
            alert("Justera bilderna i förhållande till varandra.");
            document.getElementById("btnSave").disabled = undefined;
            finished = true;
        }
        else {
            p[i-1].show();
        }
    }
}
function getFilenames() {
    var callback = function (json) {
        nms = json['filenames'];
        var iids = json['iids'];
        for (i = 0; i < nms.length; ++i) {
            p[i] = paper.image(fn(nms[i]), 0, 0, W, H);
            p[i]['index'] = i;
            p[i]['iid'] = parseInt(iids[i], 10);
            s[i] = paper.set();
            // vlines[i] = paper.line(SP, -2000, SP, 2000, {stroke: "gray"}).hide();
            vlines[i] = paper.rect(SP, H/2, 1, 6*D-H-H/2).attr({stroke: "gray"}).hide();
            s[i].push(vlines[i], p[i]);
        	p[i].toFront().mousedown(function (event) { if (!reviewMode) { drag(this, s[this.index], event); }}).mouseout(function (event) { 
                if (!window.dragging) { hideEnlargement(); vlines[this.index].hide(); }});
            p[i].mouseover(function (event) { 
                if (!window.dragging) { showEnlargement(nms[this.index]); vlines[this.index].show(); }});
        }
        resetImgs();
    };
    var options = {parameters: {cmd: GET_IMAGES, qid: 1}};
    HTTP.get("pj.php", callback, options);
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
        vlines[i].attr({y: H+H/2, height: 6*D-H-H/2});
	}
    p[nms.length-1].show();
    var txtEmail = document.getElementById("txtEmail");
    txtEmail.style.color = "gray"; 
    txtEmail.value = "email";
    document.getElementById("btnSave").disabled = "disabled";
    progressbar.attr({width: 0});
    finished = false;
}
window.onload = function () {
    Raphael.fn.line = function (x1, y1, x2, y2, params) {
        var paper = this;
        return paper.path(["M", x1, y1, "L", x2, y2]).attr(params);
    };
    paper = Raphael(0, 0, 12*D, screen.height);
    getFilenames();
    document.getElementById("btnSave").onclick = function (event) { save(); };
    document.getElementById("btnNext").onclick = function (event) { next(); };
    document.getElementById("btnBack").onclick = function (event) { back(); };
    document.getElementById("btnReview").onclick = function (event) { review(); };
    document.getElementById("txtEmail").onfocus = function (event) { 
        if (this.value == "email") { this.style.color = "black"; this.value = ""; }};
    getAxis();
};
