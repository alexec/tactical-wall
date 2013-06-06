var wall = {
    "boxNames": [],
    "updateInterval": 3 * 1000, // how often to update the next box
    "fadeTime": 5000, // unused
    "dims": [ // layout of the boxes
        {"rows":0,"cols":0},
        {"rows":1,"cols":1},
        {"rows":1,"cols":2},
        {"rows":2,"cols":2},
        {"rows":2,"cols":2},
        {"rows":2,"cols":3},
        {"rows":2,"cols":3}
    ],
    "statuses":{"red":"btn-danger","green":"btn-success","amber":"btn-warning","none":"btn-inverse"},
    "currentBoxName": "",
    "html":{},
    "start": function() {
        this.currentBoxName=this.boxNames[0];
        for (var i=0; i < this.boxNames.length;i++) {
            var boxName=this.boxNames[i];
            var html = this.format("none", "", "Loading...", "");
            $("body").append("<div id='" + boxName.replace('/', "_") +"0'>"+html+"</div>");
            //$("body").append("<div id='" + boxName +"1' style='display:none;'>Loading...</div>");
            this.html[boxName]=html;
            //this.updateNextBox();
        }
       setInterval(function() {wall.updateNextBox();}, this.updateInterval);
       $(window).resize(function() {wall.resize();});
       this.resize();
    },
    "resize":function() {
        this.width=$(window).width();
        this.height=$(window).height();
        for (var i=0; i < this.boxNames.length;i++) {
            var boxName=this.boxNames[i];
            var style = this.getStyle(i);
            $("#" + boxName.replace('/', "_") +"0").attr("style", this.getStyle(i));
        }
    },
    "getStyle":function(i) {
        var geo=this.getGeo(i);
        //console.log(geo);
        return "position:absolute;left:"+geo.x+"px;top:"+geo.y+"px;width:"+geo.w+"px;height:"+geo.h+"px;";
    },
    "updateNextBox": function() {
        // add random to prevent caching
        $.getJSON("boxes/" + this.currentBoxName + '.json?random' + Math.random(), function(box) {
            wall.setCurrentHtml(wall.htmlFor(box));
        }).error(function(xhr, status, e) {
            wall.setCurrentHtml(wall.format("none","",e,""));
        }).always(function() {
            wall.currentBoxName=wall.getNextBoxName();
            //console.log(wall.currentBoxName);
        });
    },
    "setCurrentHtml":function(html) {
        var i=$("#" + wall.currentBoxName.replace('/', "_") +"0").is(":visible")?1:0;
        var to="#" + wall.currentBoxName.replace('/', "_") +""+0;
            //var from="#" + box.name +""+(1-i);
        if (wall.html[wall.currentBoxName] != html){
            wall.html[wall.currentBoxName] = html;
            $(to).html(html);
            // $(from).fadeOut(this.fadeTime);
            // $(to).fadeIn(this.fadeTime);
        }
    },
    "getNextBoxName":function() {
        return this.boxNames[(this.indexOf(this.currentBoxName) + 1) % this.boxNames.length];
    },
    "indexOf": function(boxName) {
        for (var i=0;i<this.boxNames.length;i++){
            if (this.boxNames[i]==boxName){return i;}
        }
    },
    "htmlFor": function(box) {
        return this.format(box.status,box.header,box.body,box.footer);
    },
    "format": function(status,header,body,footer){
        return "<table class='box "+this.statuses[status]+"'>" +
                "<tr><td class='header'>" + header + "</td></tr>" +
                "<tr><td class='body'>"+ body + "</td></tr>" +
                "<tr><td class='footer'>" + footer + "</td></tr>"+
            "</table>"
    },
    "getGeo": function(i) {
        var d=this.dims[this.boxNames.length];
        //console.log(d);
        return{
            "x": (this.width-2)/d.cols*parseInt(i%d.cols),
            "y": (this.height-2)/d.rows*parseInt(i/d.cols),
            "w": (this.width-2)/d.cols,
            "h": (this.height-2)/d.rows
        };
    }
}