var fs = require("fs");
var argv =  process.argv;
var rootPath = process.cwd();
var path =  require("path");
var glob = require("glob");
var format = require("json-format");

function ClearCdn (obj) {

	this.link = obj && obj.link ? obj.link : "http://h5.dianping.com",
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

		fs.writeFileSync(self.target, format(self.json));


	});

}

ClearCdn.prototype.createOnline = function (arr, path) {

	var self = this;
	var resultArr = [];

	var linkArr = path.split("/");
	arr.forEach(function(item){

		var bizname = self.json.bizname ? self.json.bizname : self.getBizname();

		var str = self.link + "/" + bizname;
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

ClearCdn.prototype.getBizname = function () {

	var arr = this.json.ftpkey.split(".")
	var bizname = arr[arr.length - 1];

	return bizname;

}

function init (object) {

	return new ClearCdn(object);

}

module.exports =  init;