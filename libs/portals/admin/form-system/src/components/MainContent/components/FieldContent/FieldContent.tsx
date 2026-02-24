import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/ui'
import { Stack } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Preview } from '../Preview/Preview'
import { BaseInput } from './components/BaseInput'
import { FieldSettings } from './components/FieldSettings/FieldSettings'
import { ListBuilder } from './components/ListBuilder/ListBuilder'
import { ZendeskSettings } from './components/ZendeskSettings/ZendeskSettings'

export const FieldContent = () => {
  const { control, inListBuilder } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField

  const hasZendeskSettings = control.form.submissionServiceUrl === 'zendesk'
  const { fieldType } = currentItem

  if (inListBuilder) {
    return <ListBuilder />
  } else {
    if (fieldType === FieldTypesEnum.PAYMENT) {
      return <>Blaa</>
    }
    return (
      <Stack space={2}>
        <BaseInput />
        <FieldSettings />
        <Preview data={currentItem} />
        {hasZendeskSettings && currentItem.fieldSettings && (
          <ZendeskSettings fieldSettings={currentItem.fieldSettings} />
        )}
      </Stack>
    )
  }
}
