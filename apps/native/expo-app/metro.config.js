const { withNxMetro } = require('@nx/react-native')
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = withNxMetro(config);
