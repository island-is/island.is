import { restoreCache as _restoreCache } from 'https://esm.sh/@actions/cache?raw';

export async function restoreCache({ key, path }) {
    let cache;
    try {
        cache = await cache.restoreCache([path], key, [], {}, true)
    } catch (e) {
        return false;
    }
    return cache != undefined;
}