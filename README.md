## mkdirpd
Simple create or delete directory.

### Usage
```js
var mkdir = require("mkdirpd");
mkdir.create("path/to/folders" [, mode] [, function]);
// or
mkdir.delete("path/to/folders" [, function]);
```
by defautl `mode` equal to 0777, and function take one parameter, `err`.

```js
var md = require("mkdirpd");
md.create("folders/to/child", function(err) {
	if (err) {
		throw err;	
	}
	console.log("Success");
});
```
## Exemple
```js
var md = require("../index.js");

md.create("controller/model/views", function(err) {
	if (err) {
		throw err;
	}
	console.log("folders have created");
	setTimeout(function() {
		md.delete("controller/model/views", function(err) {
			if (err) {
				throw err;
			}
			console.log("folders have deleted.");
		});
	}, 3000);
});
```
##Licence
__MIT__
