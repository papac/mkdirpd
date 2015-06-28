"use strict";

module.exports = (function(){

	var fs = require("fs");
	var fn = null, mode = null;

	function fnMode(arg, isExist) {

		if(arg.length >= 1) {

			mode = arg[1];

			if(typeof mode === "function") {
				fn = mode;
				mode = "0777";
			} else if(typeof arg[2] === "function") {
				fn = arg[2];
			}

		} else {
			mode = "0777";
		}

		if(isExist) {
			if(fn !== null) {
				return fn({message: "File exists"});
			}
		}

		return {
			mode: mode,
			fn: fn
		};

	}

	return {
		create: function(path) {

			fs.exists(path, function(isExist) {

				var param = fnMode(arguments, isExist);

				if(param.fn !== null) {
					fs.mkdir(path, param.mode, param.fn);
				} else {
					fs.mkdir(path, mode);
				}

			});
		},
		delete: function(path) {

			fs.exists(path, function(isExist) {

				var param = fnMode(arguments, isExist);

				if(param.fn !== null) {
					fs.unlink(path, param.mode, param.fn);
				} else {
					fs.unlink(path, param.mode);
				}

			});

		}
	};

})();


