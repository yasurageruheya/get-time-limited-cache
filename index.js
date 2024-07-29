/**
 *
 * @param {number} [ttl=10000]
 * @param {function(key:string, value:any):void} [onKeySet=null]
 * @param {function(key:string, value:any):void} [onKeyRemove=null]
 * @return {object}
 */
module.exports = (ttl=10000, onKeySet=null, onKeyRemove=null)=>
{
	const target = {};
	/** @type {Object.<NodeJS.Timeout|number>} */
	const propKiller = {};

	const handler = {};
	handler.set = (target, key, value)=>
	{
		target[key] = value;
		if(typeof propKiller[key] !== "undefined") clearTimeout(propKiller[key]);
		propKiller[key] = setTimeout(()=>
		{
			if(onKeyRemove) onKeyRemove(key, value);
			propKiller[key] = null;
			delete propKiller[key];
		}, ttl);
		if(onKeySet) onKeySet(key, value);
		return true;
	}

	return new Proxy(target, handler);
}