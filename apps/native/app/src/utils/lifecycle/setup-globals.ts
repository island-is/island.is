import 'intl';
import 'intl/locale-data/jsonp/is';
import 'intl/locale-data/jsonp/en';
import { Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';

global.Intl = (global as any).IntlPolyfill;
(global.Intl as any).__disableRegExpRestore();

export function setupGlobals() {
  if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarPreviousNextButtonEnable(true);
  }
}
