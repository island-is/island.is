import { ActionSheetIOS } from 'react-native'
import { uiStore } from '../stores/ui-store'
import { isAndroid, isIos } from '../utils/devices'

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

const parseAndroidAction = (action: string) => {
  switch (action) {
    case 'actionPositive':
      return 'positive'
    case 'actionNegative':
      return 'negative'
    case 'actionNeutral':
      return 'neutral'
    case 'actionDismiss':
      return 'dismiss'
    default:
      return 'select'
  }
}

export function showPicker(
  options: ShowPickerOptions,
): Promise<ShowPickerResponse> {
//   const {
//     type,
//     title,
//     message,
//     selectedId,
//     items,
//     cancel,
//     cancelLabel = 'Cancel',
//   } = options

//   const theme = uiStore.getState().theme!

//   if (isIos) {
//     return new Promise((resolve) => {
//       const options = [
//         ...items.map((item) => item.label),
//         ...(cancel ? [cancelLabel] : []),
//       ]
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           title,
//           message,
//           cancelButtonIndex: Math.max(
//             0,
//             Math.min(items.length, options.length - 1),
//           ),
//           disabledButtonIndices: [
//             Math.max(
//               0,
//               Math.min(
//                 options.length - 1,
//                 items.findIndex((item) => item.id === selectedId),
//               ),
//             ),
//           ],
//           options,
//         },
//         (index: number) => {
//           if (index < items.length) {
//             resolve({ action: 'select', selectedItem: items[index] })
//           } else {
//             resolve({
//               action: 'dismiss',
//             })
//           }
//         },
//       )
//     })
//   } else if (isAndroid) {
//     return DialogAndroid.showPicker(title, message, {
//       selectedId,
//       cancelable: cancel,
//       negativeText: cancel ? cancelLabel : undefined,
//       type:
//         type === 'radio' ? DialogAndroid.listRadio : DialogAndroid.listPlain,
//       items,
//       negativeColor: theme.color.dark400,
//       positiveColor: theme.color.blue400,
//       widgetColor: theme.color.blue400,
//       linkColor: theme.color.blue400,
//       contentColor: theme.shade.foreground,
//       backgroundColor: theme.shade.background,
//       neutralColor: theme.shade.foreground,
//       titleColor: theme.shade.foreground,
//     }).then(({ action, selectedItem }: any) => {
//       let actn: ShowPickerResponse['action'] = 'neutral'
//       if (action === 'actionDismiss') {
//         actn = 'dismiss'
//       } else if (action === 'actionNegative') {
//         actn = 'negative'
//       } else if (action === 'actionSelect') {
//         actn = 'select'
//       }

//       return {
//         action: actn,
//         selectedItem,
//       }
//     })
  //   }
  // @todo migration
  return Promise.resolve({ action: 'neutral' })
}

export function showAndroidPrompt(
  title: string,
  content?: string,
  options?: any
): Promise<any> {
  // @todo migration
  return Promise.resolve({ action: 'neutral', text: '' })

  // const theme = uiStore.getState().theme!

  // return DialogAndroid.prompt(title, content, {
  //   positiveColor: theme.color.blue400,
  //   negativeColor: theme.color.red600,
  //   widgetColor: theme.color.blue400,
  //   contentColor: theme.shade.foreground,
  //   backgroundColor: theme.shade.background,
  //   neutralColor: theme.shade.foreground,
  //   titleColor: theme.shade.foreground,
  //   ...options,
  // }).then(({ action, text, ...rest }: any) => {
  //   return {
  //     action: parseAndroidAction(action),
  //     text,
  //     ...rest,
  //   }
  // })
}
