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

##Licence
__MIT__
