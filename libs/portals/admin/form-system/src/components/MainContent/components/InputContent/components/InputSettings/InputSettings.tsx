import { useContext } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'
import { MessageWithLinkSettings } from './components/MessageWithLinkSettings'
import { TextInputSettings } from './components/TextInputSettings'
import { ListSettings } from './components/ListSettings'
import { ToggleConnection } from './components/ToggleConnection'
import { FileUploadSettings } from './components/UploadSettings'

export const InputSettings = () => {
  const { control } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemInput
  return (
    <>
      {currentItem.type === 'Message' && <MessageWithLinkSettings />}
      {currentItem.type === 'Document' && <FileUploadSettings />}
      {currentItem.type === 'Textalínubox' ||
        (currentItem.type === 'Textbox' && <TextInputSettings />)}
      {currentItem.type === 'Dropdown_list' && <ListSettings />}
      {currentItem.type === 'Radio_buttons' && <ListSettings />}
      {['Checkbox'].includes(currentItem.type as string) && (
        <ToggleConnection />
      )}
    </>
  )
}
