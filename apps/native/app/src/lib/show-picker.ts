import { theme } from '@island.is/island-ui/theme'
import { ActionSheetIOS, Platform } from 'react-native'
import DialogAndroid from 'react-native-dialogs'

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

  if (Platform.OS === 'ios') {
    return new Promise((resolve) => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title,
          message,
          cancelButtonIndex: items.length,
          options: [
            ...items.map((item) => item.label),
            ...(cancel ? [cancelLabel] : []),
          ],
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
