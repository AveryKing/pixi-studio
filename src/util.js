PIXI.Graphics.prototype.drawDashedPolygon = function(polygons, x, y, rotation, dash, gap, offsetPercentage){
    var i;
    var p1;
    var p2;
    var dashLeft = 0;
    var gapLeft = 0;
    if(offsetPercentage>0){
        var progressOffset = (dash+gap)*offsetPercentage;
        if(progressOffset < dash) dashLeft = dash-progressOffset;
        else gapLeft = gap-(progressOffset-dash);
    }
    var rotatedPolygons = [];
    for(i = 0; i<polygons.length; i++){
        var p = {x:polygons[i].x, y:polygons[i].y};
        var cosAngle = Math.cos(rotation);
        var sinAngle = Math.sin(rotation);
        var dx = p.x;
        var dy = p.y;
        p.x = (dx*cosAngle-dy*sinAngle);
        p.y = (dx*sinAngle+dy*cosAngle);
        rotatedPolygons.push(p);
    }
    for(i = 0; i<rotatedPolygons.length; i++){
        p1 = rotatedPolygons[i];
        if(i == rotatedPolygons.length-1) p2 = rotatedPolygons[0];
        else p2 = rotatedPolygons[i+1];
        var dx = p2.x-p1.x;
        var dy = p2.y-p1.y;
        var len = Math.sqrt(dx*dx+dy*dy);
        var normal = {x:dx/len, y:dy/len};
        var progressOnLine = 0;
        this.moveTo(x+p1.x+gapLeft*normal.x, y+p1.y+gapLeft*normal.y);
        while(progressOnLine<=len){
            progressOnLine+=gapLeft;
            if(dashLeft > 0) progressOnLine += dashLeft;
            else progressOnLine+= dash;
            if(progressOnLine>len){
                dashLeft = progressOnLine-len;
                progressOnLine = len;
            }else{
                dashLeft = 0;
            }
            this.lineTo(x+p1.x+progressOnLine*normal.x, y+p1.y+progressOnLine*normal.y);
            progressOnLine+= gap;
            if(progressOnLine>len && dashLeft == 0){
                gapLeft = progressOnLine-len;
            }else{
                gapLeft = 0;
                this.moveTo(x+p1.x+progressOnLine*normal.x, y+p1.y+progressOnLine*normal.y);
            }
        }
    }
}
PIXI.Graphics.prototype.drawDashedCircle = function (radius, x, y, rotation, dash, gap, offsetPercentage) {
    var circum = radius * 2 * Math.PI;
    var stepSize = dash+gap;
    var chunks = Math.ceil(circum / stepSize);
    var chunkAngle = (2*Math.PI)/chunks;
    var dashAngle = (dash/stepSize) * chunkAngle;
    var offsetAngle = offsetPercentage*chunkAngle;
    var a = offsetAngle;
    var p = {x:radius*Math.cos(a), y:radius*Math.sin(a)};
    this.moveTo(x + p.x, y + p.y);
    for (var i = 0; i < chunks; i++) {
        a = chunkAngle*i+offsetAngle;
        this.arc(x, y, radius, a, a+dashAngle);
        p = {x:radius*Math.cos(a+chunkAngle), y:radius*Math.sin(a+chunkAngle)};
        this.moveTo(x + p.x, y + p.y);
    }
}


// create app
var app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    backgroundColor: 0x808080
});
document.body.appendChild(app.view);


var polygons = [];
polygons.push({x:-50, y:-50});
polygons.push({x:-50, y:50});
polygons.push({x:50, y:50});
polygons.push({x:75, y:0});
polygons.push({x:50, y:-50});


var body = new PIXI.Graphics();
app.stage.addChild(body);

var rotation = 0;

function animate(time) {
    rotation += 0.005;
    body.clear();
    body.lineStyle(1, 0x00FF00, 0.7);
    var offsetInterval = 750;
    var offset = (Date.now()%offsetInterval+1)/offsetInterval;
    body.drawDashedPolygon(polygons, 200, 100, rotation, 10, 5, offset);
    body.drawDashedCircle(40, 350, 100, rotation, 10, 5, offset);
    requestAnimationFrame(animate);
}
animate();


