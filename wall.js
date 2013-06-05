var wall = {
    "moduleNames": [],
    "fadeTime": 5000,
    "dims": [
        {"rows":0,"cols":0},
        {"rows":1,"cols":1},
        {"rows":1,"cols":2},
        {"rows":2,"cols":2},
        {"rows":2,"cols":2},
        {"rows":2,"cols":3},
        {"rows":2,"cols":3}
    ],
    "statuses":{"red":"btn-danger","green":"btn-success","amber":"btn-warning"},
    "html":{},
    "start": function() {
        this.width=$(window).width();
        this.height=$(window).height();
        for (var i=0; i < this.moduleNames.length;i++) {
            var moduleName=this.moduleNames[i];
            var geo=this.getGeo(i);
            //console.log(geo);
            var style = "position:absolute;left:"+geo.x+"px;top:"+geo.y+"px;width:"+geo.w+"px;height:"+geo.h+"px;";
            $("body").append("<div id='" + moduleName +"0' style='" + style+"'>Loading...</div>");
            $("body").append("<div id='" + moduleName +"1' style='" + style+"display:none;'>Loading...</div>");
            this.html[moduleName]="";
        }
        this.updateModules();
        setInterval(function() {wall.updateModules();}, 10000);
    },
    "updateModules": function() {
        for (var i=0; i < this.moduleNames.length;i++) {
            var moduleName=this.moduleNames[i];
            this.updateModule(moduleName);
        }
    },
    "updateModule": function(moduleName) {
        // add random to prevent caching
        $.getJSON(moduleName + '.json?random' + Math.random(), function(module) {
            var i=$("#" + module.name +"0").is(":visible")?1:0;
            console.log(moduleName+" "+i)
            var to="#" + module.name +""+i;
            var from="#" + module.name +""+(1-i);
            var html1=wall.htmlFor(module);
            if (wall.html[module.name] != html1){
                $(to).html(html1);
                $(from).fadeOut(this.fadeTime);
                $(to).fadeIn(this.fadeTime);
            }
        }).error(function(xhr, status, e) {alert(e);});
    },
    "indexOf": function(moduleName) {
        for (var i=0;i<this.moduleNames.length;i++){
            if (this.moduleNames[i]==moduleName){return i;}
        }
    },
    "htmlFor": function(module) {
        return "<table class='pane "+this.statuses[module.status]+"'>" +
            "<tr><td class='header'>" + module.header + "</td></tr>" +
            "<tr><td class='body'>"+ module.body + "</td></tr>" +
            "<tr><td class='footer'>" + module.footer + "</td></tr>"+
        "</table>";
    },
    "getGeo": function(i) {
        var d=this.dims[this.moduleNames.length];
        //console.log(d);
        return{
            "x": (this.width-2)/d.cols*parseInt(i%d.cols),
            "y": (this.height-2)/d.rows*parseInt(i/d.cols),
            "w": (this.width-2)/d.cols,
            "h": (this.height-2)/d.rows
        };
    }
}