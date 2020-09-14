/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// https://app.slack.com/client/T012BL1TC3E/C019VN1KG04/thread/C019VN1KG04-1599555150.050600
;(window as any).global = window
