"use strict";

module.exports = (function(){

	var fs = require("fs");
	var fn = null, mode = null;
	var color = require("colors");
	var EventEmitter = require("events").EventEmitter;
	var listener = new EventEmitter();
	var msg = {
		pathError: color.red("String given"),
		dirExist: color.red("sorry directory exist"),
		dirMissing: color.yellow("Missing directory or not empty")
	};

	return {
		create: function(path, mode, fn) {

			var options = {};

			if(typeof mode === "function") {
				options.fn = mode;
				options.mode = "0777";
			} else if (typeof mode === "string") {
				if(typeof fn === "function") options.fn = fn;
				if(/^0[\d]+$/.test(mode)) options.mode = mode;
				else options.mode = "0777";
			}

			if(typeof path !== "string") {
				if (typeof options.fn === "function") {
					options.fn(new Error(msg.pathError), "");
				} else {
					console.log(msg.pathError);
				}
				return;
			}

			fs.exists(path, function(exit) {

				var currentDir = "";
				if(exit) {
					if(options.fn !== "undefined") 
						options.fn(new Error(msg.dirExist), "");
					return;
				}
				
				if(typeof path === "string") {
					var parts = path.split("/");
					path = {
						folders: parts,
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

					for(var i = 1; i <= path.len; i++) {
						currentDir += path.folders[i-1] + (i < path.len ? "/" : "");
						(function(index, currDir) {
							fs.mkdir(currDir, options.mode, function(err) {
								if(err) return listener.emit("error", err, currDir);
								else if(index == path.len) listener.emit("created", false);
							});
						})(i, currentDir);
					}

				}else {
					for(var i = 1; i <= path.len; i++) {
						currentDir = path.folders[i-1];
						(function(index, currDir) {
							fs.mkdir(currDir, function(err) {
								if(err) return listener.emit("error", err, currDir);
								else if(index == path.len) listener.emit("created", false);
							});
						})(i, currentDir);
					}
				}

				listener
					.on("error", function(err, currentDir) {
						if (typeof options.fn === "function"){
							options.fn(err, currentDir);
						}
					})
					.on("created", function(err) {
						if (typeof options.fn === "function") {
							options.fn(err);
						}
					});
			});
		},
		delete: function(path, fn) {

			if (typeof path !== "string") {
				if (typeof fn !== "function") {
					return fn(new Error(msg.pathError));
				} else {
					console.error(msg.pathError);
				}
				return;
			}

			fs.exists(path, function(exit) {

				if(!exit) {
					if(fn !== "undefined")
						fn(new Error(msg.dirMissing));
					return;
				}

				var  folders = path.split("/");
				for (var i = 1, len = folders.length; i <= len; i++) {
					path = folders.join("/");
					(function(index, currentDir) {
						fs.rmdir(currentDir, function(err) {
							if (err) return listener.emit("delError", err);
							else if (index === len) listener.emit("deleted");
						});
					})(i, path);
					folders.pop();
				}
			});

			listener
				.on("delError", function(err) {
					if (typeof fn === "function") {
						fn(err);
					}
				})
				.on("deleted", function() {
					if (typeof fn === "function") {
						fn();
					}
				});
		}
	};
})();


