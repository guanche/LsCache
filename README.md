# LsCache
A simple localStorage wrapper with multiple registry support. 

## Why use registries?
- This will make it easy to organize and manage different sets of cached data. 
- It ensures you will not create naming collisions with generated data.
- Getting/clearing datasets becomes easy
- When changing one item of a set, you don't have to worry about parsing JSON, checking the value, setting it and finally putting the whole object back in the localStorage.

(On a side-note, you don't have to declare a registry if you don't want/need to. Everything automaticly goes to the domain's global cache)

## Usage
Include the script on the page and it's available with the name LsCache.
```javascript
// Simple example from global registry
LsCache.get('foo');
// Getting an item with a registry specified
LsCache.registry('myDataSet').set('foo', {bar : 'bar'});
// Getting an object with all values from the global registry, and each value beeing parsed json
LsCache.getAll(true);
```

#### .registry(registryName)
##### .r(registryName) — convenience method
Set the working regstry. This method is chainable and all methods you wish to use this registry, *must* be appended directly after this one.
_Returns: `this` for chaining_
- `key` string, required. Name of the cached item

#### .get(key [, isJson])
Get a cached item.  
_Returns: The cached data or false when not found_
- `key` string, required. Name of the cached item
- `isJson` boolean, optional. If you want the data parsed to an object

#### .getAll([isJson])
Get all items from the current cache registry.  
_Returns: Object with all the items in the current cache. Or false if cache does not exist_
- `isJson` boolean, optional. If you want the data parsed to an object

#### .set(key, value)
Setting a named cache item. All non-numbers or strings will be converted to JSON. If set register does not exist, it will be created.    
_Returns: Boolean, true on success, false on failure.
- `key` string, required. Name of the cached item
- `value` mixed, required.

#### .unset(key)
Remove a key, if this was the last value in the registry, it is removed
_Returns: Boolean, true on success, false if the key was not found_
- `key` string, required. Name of the cached item

#### .clear()
Removes the current registry and it's items
_Returns: Boolean, true if the operation is done, false if the current registry was not found_

## Compatiblity
Every major browser except IE < 8

## TODO's
- Setting a registry persistant
- localStorage size checker
- ... Open for suggestions
