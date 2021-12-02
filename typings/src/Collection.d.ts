export = Collection;
/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @template K,V
 * @extends {Map<K, V>}
 */
declare class Collection<K, V> {
    constructor(iterable: any);
    /**
     * @param {K} key
     * @param {V} val
     * @returns
     */
    set(key: K, val: V): any;
    _array: any[];
    _keyArray: any[];
    /**
     * @param {K} key
     * @returns
     */
    delete(key: K): any;
    /**
     * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behaviour, use `[...collection.values()]` or
     * `Array.from(collection.values())` instead.
     * @returns {Array<V>} An ordered array of the values of this collection
     */
    array(): Array<V>;
    /**
     * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behaviour, use `[...collection.keys()]` or
     * `Array.from(collection.keys())` instead.
     * @returns {Array<K>} An ordered array of the keys of this collection
     */
    keyArray(): Array<K>;
    /**
     * Obtains the first value(s) in this collection.
     * @param {number} [amount] Amount of values to obtain from the beginning
     * @returns {V | Array<V>} A single value if no amount is provided or an array of values, starting from the end if
     * amount is negative
     */
    first(amount?: number): V | Array<V>;
    /**
     * Obtains the first key(s) in this collection.
     * @param {number} [amount] Amount of keys to obtain from the beginning
     * @returns {K|Array<K>} A single key if no amount is provided or an array of keys, starting from the end if
     * amount is negative
     */
    firstKey(amount?: number): K | Array<K>;
    /**
     * Obtains the last value(s) in this collection. This relies on {@link Collection#array}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of values to obtain from the end
     * @returns {V|Array<V>} A single value if no amount is provided or an array of values, starting from the end if
     * amount is negative
     */
    last(amount?: number): V | Array<V>;
    /**
     * Obtains the last key(s) in this collection. This relies on {@link Collection#keyArray}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of keys to obtain from the end
     * @returns {K|Array<K>} A single key if no amount is provided or an array of keys, starting from the end if
     * amount is negative
     */
    lastKey(amount?: number): K | Array<K>;
    /**
     * Obtains random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of values to obtain randomly
     * @returns {V|Array<V>} A single value if no amount is provided or an array of values
     */
    random(amount?: number): V | Array<V>;
    /**
     * Obtains random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of keys to obtain randomly
     * @returns {K|Array<K>} A single key if no amount is provided or an array
     */
    randomKey(amount?: number): K | Array<K>;
    /**
     * Searches for all items where their specified property's value is identical to the given value
     * (`item[prop] === value`).
     * @param {string} prop The property to test against
     * @param {V} value The expected value
     * @returns {Array<V>} Return an array of all the matched elements
     * @example
     * collection.findAll('username', 'Bob');
     */
    findAll(prop: string, value: V): Array<V>;
    /**
     * Searches for a single item where its specified property's value is identical to the given value
     * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
     * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
     * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
     * should use the `get` method. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
     * @param {string|Function} propOrFn The property to test against, or the function to test with
     * @param {V} [value] The expected value - only applicable and required if using a property for the first argument
     * @returns {V | undefined} Return the matched item if match
     * @example
     * collection.find('username', 'Bob');
     * @example
     * collection.find(val => val.username === 'Bob');
     */
    find(propOrFn: string | Function, value?: V): V | undefined;
    /**
     * Searches for the key of a single item where its specified property's value is identical to the given value
     * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
     * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex).
     * @param {string|Function} propOrFn The property to test against, or the function to test with
     * @param {K} [value] The expected value - only applicable and required if using a property for the first argument
     * @returns {K | undefined}
     * @example
     * collection.findKey('username', 'Bob');
     * @example
     * collection.findKey(val => val.username === 'Bob');
     */
    findKey(propOrFn: string | Function, value?: K): K | undefined;
    /**
     * Searches for the existence of a single item where its specified property's value is identical to the given value
     * (`item[prop] === value`), or the given function returns a truthy value.
     * <warn>Do not use this to check for an item by its ID. Instead, use `collection.has(id)`. See
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has) for details.</warn>
     * @param {string|Function} propOrFn The property to test against, or the function to test with
     * @param {V} [value] The expected value - only applicable and required if using a property for the first argument
     * @returns {boolean} Whether an element matching the given value/function exists or not
     * @example
     * if (collection.exists('username', 'Bob')) {
     *  console.log('user here!');
     * }
     * @example
     * if (collection.exists(user => user.username === 'Bob')) {
     *  console.log('user here!');
     * }
     */
    exists(propOrFn: string | Function, value?: V): boolean;
    /**
     * Identical to
     * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
     * but returns a Collection instead of an Array.
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {Collection<K, V>} The filtered collection
     */
    filter(fn: Function, thisArg?: any): Collection<K, V>;
    /**
     * Identical to
     * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {Array<V>} The filtered collection as an array
     */
    filterArray(fn: Function, thisArg?: any): Array<V>;
    /**
     * Identical to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     * @param {Function} fn Function that produces an element of the new array, taking three arguments
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {Array<V>} The modified collections as an array
     */
    map(fn: Function, thisArg?: any): Array<V>;
    /**
     * Identical to
     * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {boolean} The array
     */
    some(fn: Function, thisArg?: any): boolean;
    /**
     * Identical to
     * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
     * @param {Function} fn Function used to test (should return a boolean)
     * @param {Object} [thisArg] Value to use as `this` when executing function
     * @returns {boolean} The array
     */
    every(fn: Function, thisArg?: any): boolean;
    /**
     * Identical to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @template I
     * @param {I} [initialValue] Starting value for the accumulator
     * @returns {I} The array
     */
    reduce<I>(fn: Function, initialValue?: I): I;
    /**
     * Creates an identical shallow copy of this collection.
     * @returns {Collection<K, V>} The shallow copy
     * @example const newColl = someColl.clone();
     */
    clone(): Collection<K, V>;
    /**
     * Combines this collection with others into a new collection. None of the source collections are modified.
     * @param {...Collection} collections Collections to merge
     * @returns {Collection} The combined collection
     * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
     */
    concat(...collections: Collection<any, any>[]): Collection<any, any>;
    /**
     * Calls the `delete()` method on all items that have it.
     * @returns {Promise[]} An array filled with the return values of the delete methods of each items
     */
    deleteAll(): Promise<any>[];
    /**
     * Checks if this collection shares identical key-value pairings with another.
     * This is different to checking for equality using equal-signs, because
     * the collections may be different objects, but contain the same data.
     * @param {Collection<K, V>} collection Collection to compare with
     * @returns {boolean} Whether the collections have identical contents
     */
    equals(collection: Collection<K, V>): boolean;
    /**
     * The sort() method sorts the elements of a collection and returns it.
     * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection<K, V>} The sorted collection
     */
    sort(compareFunction?: Function): Collection<K, V>;
}
