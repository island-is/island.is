import { saveCache as _saveCache } from 'https://esm.sh/@actions/cache';

export async function saveCache({ key, path }) {
    let cache;
    try {
        cache = await cache.saveCache([path], key, [], {}, true)
    } catch (e) {
        return false;
    }
    return cache != undefined;
}