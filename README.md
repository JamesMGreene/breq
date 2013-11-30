# browser-require

A limited, browser-based version of Node's `require` that utilizes synchronous `XMLHttpRequest`s
and `eval` instead of mandatory precompilation build steps.

Terrible for performance, nice for dynamic ease of use.


## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/JamesMGreene/browser-require/master/dist/browser-require.min.js
[max]: https://raw.github.com/JamesMGreene/browser-require/master/dist/browser-require.js

In your web page:

```html
<script src="dist/browser-require.min.js"></script>
<script>
  var mod = require("./someCjsModule.js");
</script>
```


## Limitations
Given the browser-based nature of "browser-require", there are some important limitations to keep
in mind that differ from Node's `require.resolve` lookup algorithms:
 1. It only works over HTTP and HTTPS due to browser security settings for `XMLHttpRequest`.
 2. It does NOT do any actual "lookups", it only resolves the exact relative path provided.
 3. It currently only supports paths that start with one of the following patterns:
      1. `/`
      2. `./`
      3. `../`
 4. It does not support the "any depth" `node_modules` dynamic lookup for named modules as this
    would usually result in a series of `404`s before it is located.
 5. It does not attempt to append the ".js" extension, etc. to the path provided. As this is made
    for the web, URI paths are critical and some users will need to consume scripts that do not
    end with the ".js" extension.
 6. It does not support loading CoffeeScript modules.
 7. It does not currently support loading JSON "modules".


## Roadmap Brainstorming
Some ideas for future exploration:
 1. Add a configuration object.
 2. Allow consumers to configure a "module root" [with either a method like `setModuleRoot` or
    a config property like `require.paths`] where we can seek out "named modules", e.g.
     ```js
require.setModuleRoot("/node_modules/");
var mod = require("myCjsModule.js");  // will resolve to "/node_modules/myCjsModule.js"
```

 3. Allow consumers to set a configuration option that _does_ enable the actual Node-style lookup
    algorithm; keeping in mind that this setup will produce an exceptionally large amount of `404`s.
    This would also include auto-appending the ".js" extension during some of the lookup attempts
    if it is not already present.
 4. Add support for JSON "modules".