var fs = require("fs");
var argv =  process.argv;
var rootPath = process.cwd();
var path =  require("path");
var glob = require("glob");

function ClearCdn (obj) {

	this.link = obj && obj.link ? obj.link : "http://h5.dianping.com/tuan",
	this.path = obj && obj.path ? obj.path : rootPath + "/handlebar/**/*.*",
	this.target = obj && obj.target ? obj.target : rootPath+"/static-site.json";

	this.json = JSON.parse(fs.readFileSync( this.target, "utf-8"));

	this.readFile(this.path, this.link);

}


ClearCdn.prototype.readFile = function (path,link) {

	var self = this;

	glob(path,function(err,file){

		if(err){

			return;
		}

		self.json["clearCDN"] = self.createOnline(file, path);

		fs.writeFileSync(self.target, JSON.stringify(self.json));


	});

}

ClearCdn.prototype.createOnline = function (arr, path) {

	var self = this;
	var resultArr = [];

	var linkArr = path.split("/");
	arr.forEach(function(item){

		var str = self.link + "/" + self.json.bizname;
		var itemarr = item.split("/");
		itemarr.forEach(function(item){

			if(linkArr.indexOf(item) == -1){

				str += "/" + item;
				
			}

		})

		resultArr.push(str);


	})

	return resultArr;

}

function init (object) {

	return new ClearCdn(object);

}

module.exports =  init;