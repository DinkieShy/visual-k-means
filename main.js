
var graphSizeX = 500;
var graphSizeY = 500;
var totalPoints = 100;
var data = [];
var pointRadius = 2.5;
var canvas = "";
var ctx = "";
var clustersAmount = 10;
var clusters = [];
var clusterSize = 10;
var border = 10;
var stepInterval = 1000;
var dataClassesAmount = clustersAmount;
var dataClasses = [];

class Cluster{
	constructor(colour){
		this.colour = colour;
		this.points = [];
		this.center = [Math.floor(Math.random()*graphSizeX), Math.floor(Math.random()*graphSizeY)];
	}
}

class DataSource{
	constructor(x, y, deviation, amount){
		this.points = [];
		for(var i = 0; i < amount; i++){
			var xDistance = x-deviation/2+(Math.random()+Math.random())*deviation/2;
			var yDistance = y-deviation/2+(Math.random()+Math.random())*deviation/2;
			this.points.push([xDistance, yDistance]);
		}
	}
}

$(document).ready(function(){
	console.log("init");
	canvas = $('#canvas')[0];
	console.log(canvas);
	ctx = canvas.getContext("2d");
	canvas.width = graphSizeX+border*2;
	canvas.height = graphSizeY+border*2;

	ctx.strokeStyle = "#000000";

	init();
	setInterval(step, stepInterval);
});

function init(){
	for(var i = 0; i < dataClassesAmount; i++){
		dataClasses.push(new DataSource(Math.floor(Math.random()*(graphSizeX-75))+37.5, Math.floor(Math.random()*(graphSizeY-75))+37.5, 150, 30));
	}
	for(var i = 0; i < dataClasses.length; i++){
		for(var ii = 0; ii < dataClasses[i].points.length; ii++){
			// data.push([Math.floor(Math.random()*graphSizeX), Math.floor(Math.random()*graphSizeY)]);
			data.push(dataClasses[i].points[ii]);
		}
	}
	for(var i = 0; i < clustersAmount; i++){
		clusters.push(new Cluster(getRandomColor()));
	}
	assignPointsToClusters();
	draw();
}

function step(){
	moveClustersToCenters();
	clearClusters();
	assignPointsToClusters();
	draw();
}

function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < clustersAmount; i++){
		ctx.beginPath();
		ctx.fillStyle = clusters[i].colour;
		ctx.rect(clusters[i].center[0]+border, clusters[i].center[1]+border, clusterSize, clusterSize);
		ctx.fill();
		ctx.stroke();
		for(var ii = 0; ii < clusters[i].points.length; ii++){
			ctx.beginPath();
			ctx.fillStyle = clusters[i].colour;
			ctx.arc(clusters[i].points[ii][0]+border, clusters[i].points[ii][1]+border, pointRadius, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	}
}

function assignPointsToClusters(){
	for(var i = 0; i < data.length; i++){
		minDistance = -1;
		cluster = -1;
		for(var ii = 0; ii < clustersAmount; ii++){
			distance = euclideanDistance(clusters[ii].center, data[i]);
			if(minDistance == -1 || minDistance > distance){
				minDistance = distance;
				cluster = ii;
			}
		}
		clusters[cluster].points.push(data[i]);
	}
}

function moveClustersToCenters(){
	for(var i = 0; i < clustersAmount; i++){
		if(clusters[i].points.length > 0){
			sum = [0, 0];
			for(var ii = 0; ii < clusters[i].points.length; ii++){
				sum[0] += clusters[i].points[ii][0];
				sum[1] += clusters[i].points[ii][1];
			}
			clusters[i].center[0] = sum[0] / clusters[i].points.length;
			clusters[i].center[1] = sum[1] / clusters[i].points.length;
		}
		else{
			clusters[i].center = [Math.floor(Math.random()*graphSizeX), Math.floor(Math.random()*graphSizeY)];
		}
	}
}

function clearClusters(){
	for(var i = 0; i < clustersAmount; i++){
		clusters[i].points = [];
	}
}

function euclideanDistance(point1, point2){
	x = point1[0] - point2[0];
	y = point1[1] - point2[1];
	return Math.sqrt(x*x+y*y);
}

function getRandomColor() {
	// https://stackoverflow.com/questions/1484506/random-color-generator
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}