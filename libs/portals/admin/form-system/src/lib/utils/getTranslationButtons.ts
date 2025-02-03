import { Dispatch } from 'react'
import { ControlAction } from '../../hooks/controlReducer'

type Types = 'CHANGE_NAME' | 'CHANGE_FORM_NAME' | 'CHANGE_DESCRIPTION'
type Icon =
  | 'archive'
  | 'accessibility'
  | 'add'
  | 'airplane'
  | 'arrowForward'
  | 'arrowBack'
  | 'arrowUp'
  | 'arrowDown'
  | 'attach'
  | 'business'
  | 'calculator'
  | 'calendar'
  | 'call'
  | 'car'
  | 'cardWithCheckmark'
  | 'caretDown'
  | 'caretUp'
  | 'cellular'
  | 'chatbubble'
  | 'checkmark'
  | 'checkmarkCircle'
  | 'chevronBack'
  | 'chevronUp'
  | 'chevronDown'
  | 'chevronForward'
  | 'closeCircle'
  | 'close'
  | 'copy'
  | 'document'
  | 'documents'
  | 'dots'
  | 'download'
  | 'ellipse'
  | 'ellipsisHorizontal'
  | 'ellipsisVertical'
  | 'expand'
  | 'eye'
  | 'eyeOff'
  | 'facebook'
  | 'fileTrayFull'
  | 'filter'
  | 'heart'
  | 'home'
  | 'homeWithCar'
  | 'informationCircle'
  | 'link'
  | 'location'
  | 'lockClosed'
  | 'lockOpened'
  | 'logOut'
  | 'mail'
  | 'mailOpen'
  | 'menu'
  | 'notifications'
  | 'open'
  | 'pencil'
  | 'people'
  | 'person'
  | 'playCircle'
  | 'pause'
  | 'pauseCircle'
  | 'print'
  | 'reader'
  | 'receipt'
  | 'removeCircle'
  | 'school'
  | 'search'
  | 'settings'
  | 'star'
  | 'time'
  | 'timer'
  | 'trash'
  | 'volumeHigh'
  | 'volumeMute'
  | 'wallet'
  | 'warning'
  | 'reload'
  | 'remove'
  | 'save'
  | 'bookmark'
  | 'share'
  | 'QRCode'
  | 'globe'
  | 'signLanguage'
  | 'listView'
  | 'gridView'
  | 'swapVertical'
  | 'thumbsUp'
  | 'thumbsDown'

type InputButton = {
  label: string
  name: Icon
  onClick: () => void
}
export const getTranslationButtons = (
  text: string,
  controlDispatch: Dispatch<ControlAction>,
  type: Types,
): InputButton[] => {
  return [
    {
      label: 'Translate',
      name: 'reader',
      onClick: async () => {
        const translation = ''
        controlDispatch({
          type: type,
          payload: {
            lang: 'en',
            newValue: translation,
          },
        })
      },
    },
  ]
}
