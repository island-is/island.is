// Hermes (the default JS engine in recent React Native versions) does not provide setImmediate by default.
// Some libraries (including older versions of React Native Navigation, or other dependencies) may expect setImmediate to exist.
// This polyfill ensures that setImmediate is available globally.
import 'setimmediate'
import './src'
