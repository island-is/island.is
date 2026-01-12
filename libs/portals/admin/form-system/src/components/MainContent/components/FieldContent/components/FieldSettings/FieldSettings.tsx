import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'
import { CheckboxSettings } from './components/CheckboxSettings'
import { ListSettings } from './components/ListSettings'
import { MessageWithLinkSettings } from './components/MessageWithLinkSettings'
import { TextFieldSettings } from './components/TextFieldSettings'
import { FileUploadSettings } from './components/UploadSettings'

export const FieldSettings = () => {
  const { control } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  return (
    <>
      {currentItem.fieldType === FieldTypesEnum.MESSAGE && (
        <MessageWithLinkSettings />
      )}
      {currentItem.fieldType === FieldTypesEnum.FILE && <FileUploadSettings />}
      {currentItem.fieldType === FieldTypesEnum.TEXTBOX && (
        <TextFieldSettings />
      )}
      {currentItem.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <ListSettings />
      )}
      {currentItem.fieldType === FieldTypesEnum.RADIO_BUTTONS && (
        <ListSettings />
      )}
      {currentItem.fieldType === FieldTypesEnum.CHECKBOX && (
        <CheckboxSettings />
      )}
    </>
  )
}
