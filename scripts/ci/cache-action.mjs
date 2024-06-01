// @ts-check

const INIT = process.env['_INIT_CACHE'] === 'true'
const KEYS = JSON.parse(process.env.keys ?? '')

const CACHES = Object.keys(KEYS)
