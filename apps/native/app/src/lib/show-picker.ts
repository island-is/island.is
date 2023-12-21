import { ActionSheetIOS, Platform } from 'react-native'
import DialogAndroid from 'react-native-dialogs'
import { uiStore } from '../stores/ui-store'

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
   * (iOS only)
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
   * Radio or list
   * Default: 'radio'
   * (Android only)
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
    type,
    title,
    message,
    selectedId,
    items,
    cancel,
    cancelLabel = 'Cancel',
  } = options

  const theme = uiStore.getState().theme!

  if (Platform.OS === 'ios') {
    return new Promise((resolve) => {
      const options = [
        ...items.map((item) => item.label),
        ...(cancel ? [cancelLabel] : []),
      ]
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title,
          message,
          cancelButtonIndex: Math.max(
            0,
            Math.min(items.length, options.length - 1),
          ),
          disabledButtonIndices: [
            Math.max(
              0,
              Math.min(
                options.length - 1,
                items.findIndex((item) => item.id === selectedId),
              ),
            ),
          ],
          options,
        },
        (index: number) => {
          if (index < items.length) {
            resolve({ action: 'select', selectedItem: items[index] })
          } else {
            resolve({
              action: 'dismiss',
            })
          }
        },
      )
    })
  } else if (Platform.OS === 'android') {
    return DialogAndroid.showPicker(title, message, {
      selectedId,
      cancelable: cancel,
      negativeText: cancel ? cancelLabel : undefined,
      type:
        type === 'radio' ? DialogAndroid.listRadio : DialogAndroid.listPlain,
      items,
      negativeColor: theme.color.dark400,
      positiveColor: theme.color.blue400,
      widgetColor: theme.color.blue400,
      linkColor: theme.color.blue400,
      contentColor: theme.shade.foreground,
      backgroundColor: theme.shade.background,
      neutralColor: theme.shade.foreground,
      titleColor: theme.shade.foreground,
    }).then(({ action, selectedItem }: any) => {
      let actn: ShowPickerResponse['action'] = 'neutral'
      if (action === 'actionDismiss') {
        actn = 'dismiss'
      } else if (action === 'actionNegative') {
        actn = 'negative'
      } else if (action === 'actionSelect') {
        actn = 'select'
      }

      return {
        action: actn,
        selectedItem,
      }
    })
  }
  return Promise.resolve({ action: 'neutral' })
}

export function showPrompt(options: PromptOptions): Promise<PromptResponse> {
  const { isDarkMode } = uiStore.getState()
  if (Platform.OS === 'android') {
    return DialogAndroid.prompt(options.title, options.message, {
      keyboardType: options.keyboardType,
      defaultValue: options.defaultValue,
      negativeColor: '#f01464',
      positiveColor: '#003cff',
      widgetColor: '#003cff',
      linkColor: '#003cff',
      contentColor: isDarkMode ? '#ffffff' : '#000000',
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
      neutralColor: isDarkMode ? '#ffffff' : '#000000',
      titleColor: isDarkMode ? '#ffffff' : '#000000',
      ...options.android,
    } as OptionsPrompt).then(({ action, text, ...rest }: any) => {
      return {
        action: parseAndroidAction(action),
        text,
        ...rest,
      }
    })
  }

  return new Promise((resolve) =>
    Alert.prompt(
      options.title,
      options.message,
      options.buttons?.map((button) => {
        return {
          text: button.text,
          onPress: (text) => {
            if (button.style === 'cancel') {
              resolve({ action: 'dismiss' })
            } else if (button.style === 'destructive') {
              resolve({ action: 'negative', text })
            } else {
              resolve({ action: 'neutral', text })
            }
          },
        }
      }),
      options.type,
      options.defaultValue,
      options.keyboardType,
    ),
  )
}
