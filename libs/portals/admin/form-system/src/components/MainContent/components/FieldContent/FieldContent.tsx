import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Box, Input, Stack } from '@island.is/island-ui/core'
import { BaseInput } from './components/BaseInput'
import { Preview } from '../Preview/Preview'
import { FormSystemField } from '@island.is/api/schema'
import { FieldSettings } from './components/FieldSettings/FieldSettings'
import { ListBuilder } from './components/ListBuilder/ListBuilder'
import { ZendeskSettings } from './components/ZendeskSettings/ZendeskSettings'

export const FieldContent = () => {
  const { control, inListBuilder, setFocus } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  const screenId = (control.activeItem.data as FormSystemField).screenId
  const screen = control.form.screens?.find((s) => s && s.id === screenId)
  const hasZendeskSettings = control.form.submissionServiceUrl === 'zendesk'
  const showIdentifier =
    (control.form.useValidate && screen?.shouldValidate) ||
    (control.form.usePopulate && screen?.shouldPopulate)

  if (inListBuilder) {
    return <ListBuilder />
  } else {
    return (
      <Stack space={2}>
        <BaseInput />
        <FieldSettings />
        <Preview data={currentItem} />
        {hasZendeskSettings && currentItem.fieldSettings && (
          <ZendeskSettings fieldSettings={currentItem.fieldSettings} />
        )}
        {showIdentifier && (
          <Box marginTop={2}>
            <Input
              label="identifier"
              name="identifier"
              value={currentItem.identifier ?? ''}
              backgroundColor="blue"
              onFocus={(e) => setFocus(e.target.value)}
              readOnly
            />
          </Box>
        )}
      </Stack>
    )
  }
}
