[![Build Status](https://travis-ci.org/JamesMGreene/breq.png)](https://travis-ci.org/JamesMGreene/breq)

# breq

"breq" (browser-require) is a client-side CommonJS `require` implementation that does NOT require a
precompilation build step nor server-side middleware. It instead utilizes synchronous
`XMLHttpRequest`s and `eval` instead, which does impose a series of [limitations](#limitations)
unless you're willing to generate a whole mess of `404`s.

Terrible for performance, nice for dynamic ease of use.


## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/JamesMGreene/breq/master/dist/breq.min.js
[max]: https://raw.github.com/JamesMGreene/breq/master/dist/breq.js

In your web page:

```html
<script src="dist/breq.min.js"></script>
<script>
  var mod = require("./someCjsModule.js");
</script>
```


## Limitations
Given the browser-based nature of "breq", there are some important limitations to keep in mind that
differ from Node's `require.resolve` lookup algorithms:
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
Some ideas for future exploration in "breq":  

 1. Add support for JSON "modules".
 2. Add a configuration object.
 3. Allow consumers to configure a "module root" [with either a method like `setModuleRoot` or
    a config property like `require.paths`] where we can seek out named modules, e.g.
     ```js
require.setModuleRoot("/node_modules/");
var mod = require("myCjsModule");     // path will [first] resolve to "/node_modules/myCjsModule/index.js"
```

 4. Allow consumers to set a configuration option that _does_ enable the actual Node-style lookup
    algorithm, keeping in mind that this setup will likely produce an exceptionally large quantity
    of `404`s. This would also include auto-appending the ".js" extension during some of the lookup
    attempts if it is not already present, e.g.
     ```js
var mod = require("./myCjsModule");  // path will resolve to "./myCjsModule.js"
```
