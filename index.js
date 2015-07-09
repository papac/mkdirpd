"use strict";

module.exports = (function(){

	var fs = require("fs");
	var fn = null, mode = null;
	var color = require("colors");
	var EventEmitter = require("events").EventEmitter;
	var listener = new EventEmitter();

	return {
		create: function(path, mode, fn) {

			if(typeof path === "object") {
				console.log(color.red("=> [path] parameter is a string or array."));
				return;
			}

			var options = {};

			if(typeof mode === "function") {
				options.fn = mode;
				options.mode = "0777";
			} else if (typeof mode === "string") {
				if(typeof fn === "function") options.fn = fn;
				if(/^0[\d]+$/.test(mode)) options.mode = mode;
			}

			fs.exists(path, function(exit) {

				var currentPath = "";
				if(exit) {
					if(options.fn !== "undefined") 
						options.fn({info: "[create error: " + color.red("sorry directory exist.") + "]"})
					return;
				}
				
				if(typeof path === "string") {
					var parts = path.split("/");
					path = {
						folders: path.split("/"),
						len: parts.length,
						recursive: true
					};
				} else {
					path = {
						len: path.length,
						folders: path,
						recursive: false
					};
				}

				if(path.folders[path.len - 1] === '') {
					delete path.folders.pop();
					path.len = path.folders.length;
				}

				if(path.recursive) {

					for(var i = 0; i < path.len; i++) {
						currentPath += path.folders[i] + (i < path.len - 1 ? "/" : "");
						fs.mkdir(currentPath, options.mode, function(err) {
							if(err) return listener.emit("createError", err);
							if(i == path.len - 1) listener.emit("created", null);
						});
					}

				}else {
					for(var i = 0; i < path.len; i++) {
						currentPath = path.folders[i];
						fs.mkdir(currentPath, function(err) {
							if(err) return listener.emit("createError", err);
							if(i == path.len - 1) listener.emit("created", null);
						})
					}
				}


				listener
					.on("createError", function(err) {
						options.fn(err);
					})
					.on("created", function(err) {
						options.fn(err);
					});

			});
		},
		delete: function(path, fn) {

			fs.exists(path, function(exit) {

				if(!exit) {
					if(fn !== "undefined")
						fn({info: "[delete error: " + color.red("sorry directory not exist.") + "]"})
					return;
				}

				if(fn !== "undefined") {
					fs.rmdir(path, function(err) {
						return fn(err);
					});
				} else {
					fs.rmdir(path);
				}

			});

		}
	};

})();


