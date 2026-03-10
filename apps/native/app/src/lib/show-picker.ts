import { Alert, KeyboardTypeOptions } from 'react-native'
import { promptStore } from '../stores/prompt-store'
import { isIos } from '../utils/devices'

export interface ShowPromptOptions {
  title: string
  message?: string
  defaultValue?: string
  keyboardType?: KeyboardTypeOptions
  positiveText?: string
  negativeText?: string
  placeholder?: string
}

export interface ShowPromptResult {
  action: 'positive' | 'negative' | 'dismiss'
  text?: string
}

/**
 * Cross-platform text input prompt.
 * Uses Alert.prompt on iOS, a custom modal on Android.
 *
 * Requires <PromptModal /> to be mounted in the app root for Android.
 */
export function showPrompt(
  options: ShowPromptOptions,
): Promise<ShowPromptResult> {
  const {
    title,
    message,
    defaultValue,
    keyboardType,
    positiveText = 'OK',
    negativeText = 'Cancel',
  } = options

  if (isIos) {
    return new Promise((resolve) => {
      Alert.prompt(
        title,
        message,
        [
          {
            isPreferred: true,
            text: positiveText,
            onPress: (text?: string) =>
              resolve({ action: 'positive', text }),
            style: 'default',
          },
          {
            text: negativeText,
            onPress: () => resolve({ action: 'negative' }),
            style: 'cancel',
          },
        ],
        'plain-text',
        defaultValue,
        keyboardType,
      )
    })
  }

  // Android: delegate to the global PromptModal
  return new Promise((resolve) => {
    promptStore.getState().show(options, resolve)
  })
}

/**
 * @deprecated Use showPrompt instead
 */
export function showAndroidPrompt(
  title: string,
  content?: string,
  options?: any,
): Promise<any> {
  return showPrompt({
    title,
    message: content,
    keyboardType: options?.keyboardType,
    defaultValue: options?.defaultValue,
    positiveText: options?.positiveText,
    negativeText: options?.negativeText,
  }).then((result) => ({
    action:
      result.action === 'positive'
        ? 'positive'
        : result.action === 'negative'
        ? 'negative'
        : 'dismiss',
    text: result.text,
  }))
}
