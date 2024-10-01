import { useContext } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'
import { FormSystemField, FormSystemFieldDtoFieldTypeEnum } from '@island.is/api/schema'
import { MessageWithLinkSettings } from './components/MessageWithLinkSettings'
import { TextFieldSettings } from './components/TextFieldSettings'
import { ListSettings } from './components/ListSettings'
import { ToggleConnection } from './components/ToggleConnection'
import { FileUploadSettings } from './components/UploadSettings'

export const FieldSettings = () => {
  const { control } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  return (
    <>
      {currentItem.fieldType === FormSystemFieldDtoFieldTypeEnum.Message && <MessageWithLinkSettings />}
      {currentItem.fieldType === FormSystemFieldDtoFieldTypeEnum.Document && <FileUploadSettings />}
      {currentItem.fieldType === FormSystemFieldDtoFieldTypeEnum.Textbox && <TextFieldSettings />}
      {currentItem.fieldType === FormSystemFieldDtoFieldTypeEnum.DropdownList && <ListSettings />}
      {currentItem.fieldType === FormSystemFieldDtoFieldTypeEnum.RadioButtons && <ListSettings />}
      {['Checkbox'].includes(currentItem.fieldType as string) && (
        <ToggleConnection />
      )}
    </>
  )
}
