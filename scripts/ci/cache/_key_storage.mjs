class KeyStorage {
    _keys = {};
    constructor(value = undefined) {
        if (!_keys) {
            return;
        }
        try {
            this._keys = JSON.parse(value);
        } finally {
            return;
        }
    }
    getKey(key) {
        return this._keys[key];
    }
    setKey(key, value) {
        this._keys[key] = value;
    }
}

export const keyStorage = new KeyStorage(process.env[ENV_KEYS])