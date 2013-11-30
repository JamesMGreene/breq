/*global require, QUnit */

(function(module, test) {
  'use strict';

  // Helper function
  function clearRequireCache() {
    if (require && require.cache) {
      for (var prop in require.cache) {
        if (require.cache.hasOwnProperty(prop)) {
          delete require.cache[prop];
        }
      }
    }
  }

  module('The Basics', {
    setup: function() {
      clearRequireCache();
    },
    teardown: function() {
      clearRequireCache();
    }
  });

  test('`require` exists', function(assert) {
    assert.expect(4);

    // Not a bad test to run on collection methods.
    assert.strictEqual(typeof require, 'function', '`require` must be a function');
    assert.strictEqual(typeof require.resolve, 'function', '`require.resolve` must be a function');
    assert.ok(require.main, '`require` must have a `main` property');
    assert.deepEqual(require.cache, {}, '`require.cache` should be empty');
  });

  test('`require` can load a module synchronously', function(assert) {
    assert.expect(5);

    assert.deepEqual(require.cache, {}, '`require.cache` should be empty');

    var mod = require('./test-module_basic.js');

    assert.deepEqual(mod, { name: 'basic' }, '`require` should return the expected object');
    assert.strictEqual('/test/test-module_basic.js' in require.cache, true, '`require.cache` should contain the module');
    var cachedMod = require.cache['/test/test-module_basic.js'];
    assert.ok(cachedMod, 'Cached `module` should not be empty');
    assert.deepEqual(cachedMod.exports, mod, 'Cached `module.exports` matched module returned from `require`');
  });

  test('`require` can load a module with multiple properties', function(assert) {
    assert.expect(5);

    assert.deepEqual(require.cache, {}, '`require.cache` should be empty');

    var mod = require('./test-module_multiple-props.js');

    assert.deepEqual(mod, { name: 'multi', otherProp: 'multi prop 2' }, '`require` should return the expected object');
    assert.strictEqual('/test/test-module_multiple-props.js' in require.cache, true, '`require.cache` should contain the module');
    var cachedMod = require.cache['/test/test-module_multiple-props.js'];
    assert.ok(cachedMod, 'Cached `module` should not be empty');
    assert.deepEqual(cachedMod.exports, mod, 'Cached `module.exports` matched module returned from `require`');
  });

  test('`require` does not leak variables', function(assert) {
    assert.expect(7);

    assert.deepEqual(require.cache, {}, '`require.cache` should be empty');

    var mod = require('./test-module_potential-global-leak.js');

    assert.deepEqual(mod, { name: 'leaky' }, '`require` should return the expected object');
    assert.strictEqual(typeof potentialGlobalLeak, 'undefined', 'The local variable should not be leaked to the current scope');
    assert.strictEqual(typeof window.potentialGlobalLeak, 'undefined', 'The local variable should not be leaked to the global scope');
    assert.strictEqual('/test/test-module_potential-global-leak.js' in require.cache, true, '`require.cache` should contain the module');
    var cachedMod = require.cache['/test/test-module_potential-global-leak.js'];
    assert.ok(cachedMod, 'Cached `module` should not be empty');
    assert.deepEqual(cachedMod.exports, mod, 'Cached `module.exports` matched module returned from `require`');
  });

  test('`require` can load modules from a child folder', function(assert) {
    assert.expect(5);

    assert.deepEqual(require.cache, {}, '`require.cache` should be empty');

    var mod = require('./child/test-module_child.js');

    assert.deepEqual(mod, { name: 'child' }, '`require` should return the expected object');
    assert.strictEqual('/test/child/test-module_child.js' in require.cache, true, '`require.cache` should contain the module');
    var cachedMod = require.cache['/test/child/test-module_child.js'];
    assert.ok(cachedMod, 'Cached `module` should not be empty');
    assert.deepEqual(cachedMod.exports, mod, 'Cached `module.exports` matched module returned from `require`');
  });

  test('`require` can load descendant modules', function(assert) {
    assert.expect(13);

    assert.deepEqual(require.cache, {}, '`require.cache` should be empty');

    var mod = require('./test-module_require-child.js');

    assert.deepEqual(mod, { name: 'parent', subModule: { name: 'child' }}, '`require` should return the expected object');
    assert.strictEqual('/test/test-module_require-child.js' in require.cache, true, '`require.cache` should contain the module');
    assert.strictEqual('/test/child/test-module_child.js' in require.cache, true, '`require.cache` should contain the child module');

    var childMod = require('./child/test-module_child.js');
    assert.strictEqual(mod.subModule, childMod, 'Child module should match the module returned from `require`');
    var cachedMod = require.cache['/test/test-module_require-child.js'];
    assert.ok(cachedMod, 'Cached `module` should not be empty');
    assert.deepEqual(cachedMod.exports, mod, 'Cached `module.exports` matched module returned from `require`');
    assert.ok(cachedMod.children, 'Cached `module` should have a `children` property');
    assert.strictEqual(cachedMod.children.length, 1, 'Cached `module` should have 1 child');
    var cachedChildMod = require.cache['/test/child/test-module_child.js'];
    assert.strictEqual(cachedChildMod.exports, childMod, 'Cached child `module.exports` should be the expected child');
    assert.strictEqual(cachedMod.children[0], cachedChildMod, 'Cached `module` should have the expected child `module`');
    assert.ok(cachedMod.parent, 'Cached `module.parent` should not be null');
    assert.strictEqual(cachedMod.parent, require.main, 'Cached `module.parent` should match `require.main`');
  });

  test('`require` can load ancestor modules', function(assert) {
    assert.expect(13);

    assert.deepEqual(require.cache, {}, '`require.cache` should be empty');

    var mod = require('./child/test-module_require-ancestor.js');

    assert.deepEqual(mod, { name: 'descendant', superModule: { name: 'ancestor' }}, '`require` should return the expected object');
    assert.strictEqual('/test/child/test-module_require-ancestor.js' in require.cache, true, '`require.cache` should contain the module');
    assert.strictEqual('/test/test-module_ancestor.js' in require.cache, true, '`require.cache` should contain the ancestor module');

    var ancestorMod = require('./test-module_ancestor.js');
    assert.strictEqual(mod.superModule, ancestorMod, 'Ancestor module should match the module returned from `require`');
    var cachedMod = require.cache['/test/child/test-module_require-ancestor.js'];
    assert.ok(cachedMod, 'Cached `module` should not be empty');
    assert.deepEqual(cachedMod.exports, mod, 'Cached `module.exports` matched module returned from `require`');
    assert.ok(cachedMod.children, 'Cached `module` should have a `children` property');
    assert.strictEqual(cachedMod.children.length, 1, 'Cached `module` should have 1 "child" (ancestor)');
    var cachedAncestorMod = require.cache['/test/test-module_ancestor.js'];
    assert.strictEqual(cachedAncestorMod.exports, ancestorMod, 'Cached ancestor `module.exports` should be the expected ancestor');
    assert.strictEqual(cachedMod.children[0], cachedAncestorMod, 'Cached `module` should have the expected ancestor `module`');
    assert.ok(cachedMod.parent, 'Cached `module.parent` should not be null');
    assert.strictEqual(cachedMod.parent, require.main, 'Cached `module.parent` should match `require.main`');
  });

}(QUnit.module, QUnit.test));