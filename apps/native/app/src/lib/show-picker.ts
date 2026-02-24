import { ActionSheetIOS, Alert, KeyboardTypeOptions } from 'react-native'
import { isAndroid, isIos } from '../utils/devices'
import { promptStore } from './prompt-store'

/**
 * ShowPickerItem
 */
export interface ShowPickerItem {
  /**
   * ID of item
   */
  id: string
  /**
   * Label of item
   */
  label: string
}

export interface ShowPickerOptions {
  /**
   * Dialog title
   */
  title: string
  /**
   * Message to show below title
   */
  message?: string
  /**
   * Items
   */
  items: ShowPickerItem[]
  /**
   * Selected item ID
   */
  selectedId?: string
  /**
   * Radio or list (iOS uses ActionSheet for both)
   */
  type?: 'radio' | 'list'
  /**
   * Show cancel button or not
   */
  cancel?: boolean
  cancelLabel?: string
}

interface ShowPickerResponse {
  action: 'select' | 'negative' | 'neutral' | 'dismiss'
  selectedItem?: ShowPickerItem
}

export function showPicker(
  options: ShowPickerOptions,
): Promise<ShowPickerResponse> {
  const {
    title,
    message,
    selectedId,
    items,
    cancel,
    cancelLabel = 'Cancel',
  } = options

  if (isIos) {
    return new Promise((resolve) => {
      const actionOptions = [
        ...items.map((item) => item.label),
        ...(cancel ? [cancelLabel] : []),
      ]
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title,
          message,
          cancelButtonIndex: Math.max(
            0,
            Math.min(items.length, actionOptions.length - 1),
          ),
          disabledButtonIndices: [
            Math.max(
              0,
              Math.min(
                actionOptions.length - 1,
                items.findIndex((item) => item.id === selectedId),
              ),
            ),
          ],
          options: actionOptions,
        },
        (index: number) => {
          if (index < items.length) {
            resolve({ action: 'select', selectedItem: items[index] })
          } else {
            resolve({ action: 'dismiss' })
          }
        },
      )
    })
  }

  // Android (and fallback): use Alert.alert with items as buttons
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        ...items.map((item) => ({
          text: item.label,
          onPress: () => resolve({ action: 'select', selectedItem: item }),
        })),
        ...(cancel
          ? [
              {
                text: cancelLabel,
                style: 'cancel' as const,
                onPress: () => resolve({ action: 'dismiss' }),
              },
            ]
          : []),
      ],
    )
  })
}

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
