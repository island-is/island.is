import { Dispatch } from 'react'
import { ControlAction } from '../../hooks/controlReducer'

type Types = 'CHANGE_NAME' | 'CHANGE_FORM_NAME' | 'CHANGE_DESCRIPTION'

type InputButton = {
  label: string
  name: string
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
