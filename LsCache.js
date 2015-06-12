/**
 * 
 * lsCache.js
 * Author  :  Renzo Sartorius https://github.com/guanche
 * Licence :  MIT
 *
 * Description:
 * LsCache is a conveinient wrapper around the browser's
 * localStorage. It stores the caches in registries which you
 * can set/clear, so that naming colissions are avoided.
 * 
 */

(this.define || function(){})(
this.LsCache = function(){
    'use strict';

    window.localStorageEnabled = true;

    // Cache Naming vars
    var defaultRegistry = 'global-cache',
        cacheRegistry = defaultRegistry,
        prefix = '_cache_',



    /**
     * Set or update a cache value
     * 
     * @param {String} key   The item name
     * @param {String} value Data to be stored
     */
     
    set = function(key, value) {

        if (!key || typeof value === 'undefined') return _returnResult(false);
        var cacheId, registry;

        key = _normalizeKey(key);

        // Check if registry exists
        registry = (localStorage.getItem(cacheRegistry) === null) ?
                    {} : JSON.parse(localStorage.getItem(cacheRegistry));

        // check if key exists
        if (_isset(key)) {
            cacheId = registry[key];
        } else {
            // Create a new cache id
            cacheId = Math.random().toString(36).substr(2, 9);
            cacheId += '_' + Date.now();
        }

        // Store the value
        if (typeof value !== 'number' && typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(prefix+cacheId, value);

        // Update the cache registry
        registry[key] = cacheId;
        localStorage.setItem(cacheRegistry, JSON.stringify(registry));

        return _returnResult(true);
    },



    /**
     * Get a cached item
     * 
     * @param  {String} key The item name
     * @param  {Boolean} isJson Specify if the return value should be parsed json
     * @return {Mixed}     The item data
     */
     
    get = function(key, isJson) {

        key = _normalizeKey(key);

        if (_isset(key) === false)  return _returnResult(false);

        var registry = JSON.parse(localStorage.getItem(cacheRegistry));

        if (isJson) {
            return _returnResult(JSON.parse(localStorage.getItem(prefix + registry[key])));
        } else {
            return _returnResult(localStorage.getItem(prefix + registry[key]));
        }
    },

    
    
    /**
     * Get all the values from the register
     * @param  {Boolean} isJson Specify if the return value should be parsed json
     * @return {Object} Name value pairs from cache register
     */
    
    getAll = function(isJson) {
        // Check if registry exists
        if (localStorage.getItem(cacheRegistry) === null) return _returnResult(false);

        var returnBuffer = {},
            registry = JSON.parse(localStorage.getItem(cacheRegistry));

        // Loop through the register
        for (var name in registry) {
            if (isJson) {
                returnBuffer[name] = JSON.parse(localStorage.getItem(prefix + registry[name]));
            } else {
                returnBuffer[name] = localStorage.getItem(prefix + registry[name]);
            }
        }

        return _returnResult(returnBuffer);
    },


    /**
     * Remove a cached item
     * 
     * @param  {String} key The item name
     * @return {Boolean}    False if not existing, true after done
     */
     
    unset = function(key) {
        key = _normalizeKey(key);

        // Check if key exists
        if(_isset(key) === false) return _returnResult(false);

        // Get the registry
        var registry = JSON.parse(localStorage.getItem(cacheRegistry));
        
        // Remove and set
        localStorage.removeItem(prefix + registry[key]);
        delete registry[key];
        localStorage.setItem(cacheRegistry, JSON.stringify(registry));

        // If registry is empty, remove it too (IE9+)
        if (Object.keys) {
            if (Object.keys(registry).length === 0) localStorage.removeItem(cacheRegistry);
        }

        return _returnResult(true);
    },



    /**
     * Clears all cached items from
     * the current registry
     * 
     * @return {Boolean}     True if done
     */
     
    clear = function() {

        // Check if registry exists
        if (localStorage.getItem(cacheRegistry) === null) return _returnResult(false);

        var registry = JSON.parse(localStorage.getItem(cacheRegistry));

        // Remove registry items
        for (var name in registry) {
            localStorage.removeItem(prefix + registry[name]);
        }
        
        //Remove the registry
        localStorage.removeItem(cacheRegistry);

        return _returnResult(true);
    },



    /**
     * Set the registry name, chainable.
     * If registry name is empty, set the default
     * 
     * @param {String} registryName
     * @return {this}
     */
     
    setRegistry = function(registryName) {

        if (!registryName) {
            cacheRegistry = defaultRegistry;
            return this;
        }

        cacheRegistry = registryName.toLowerCase();
        return this;
    },




    /**
     * Check if a cache is present for key, and
     * parse the status code, Private
     * 
     * @param  {String} key Local Storage Key
     * @return {Boolean}
     */
     
     _isset = function(key) {

        key = _normalizeKey(key);
        
        // Check if registry exists
        if (localStorage.getItem(cacheRegistry) === null) return false;
        
        // Check if key is set in registry
        var registry = JSON.parse(localStorage.getItem(cacheRegistry));
        if (registry[key]) return true;

        return false;
    },



    /**
     * All non-chainable public methods should
     * reset when done to default registry, Private
     * 
     * @param  {mixed} res Whatever the method wants to parse
     * @return {mixed}
     */
     
    _returnResult = function(res) {
        cacheRegistry = defaultRegistry;
        return res;
    },



    /**
     * Set the key to lowercase, if it's not
     * a valid type, throw an exception
     * @param  {Mixed} key
     * @return {String}
     */
    _normalizeKey = function(key) {
        if (typeof key === 'number') {
            key = key.toString(10);
        }

        if (typeof key === 'string') {
            return key.toLowerCase();
        } else {
            throw 'Invalid key name: ' + key;
        }
    };



    // Return public methods
    return {    get : get,
                getAll : getAll,
                set : set,
                unset : unset,
                clear : clear,
                registry : setRegistry,
                r : setRegistry // shorthand method
            };

}());
