import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/ui'
import {
  Box,
  Input,
  Stack,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import * as styles from '../../MainContent.css'
import { Preview } from '../Preview/Preview'
import { BaseInput } from './components/BaseInput'
import { FieldSettings } from './components/FieldSettings/FieldSettings'
import { ListBuilder } from './components/ListBuilder/ListBuilder'
import { PaymentField } from './components/PaymentField/PaymentField'
import { ZendeskSettings } from './components/ZendeskSettings/ZendeskSettings'

interface Props {
  identifierEditingEnabled: boolean
  setIdentifierEditingEnabled: (enabled: boolean) => void
}

export const FieldContent = ({
  identifierEditingEnabled,
  setIdentifierEditingEnabled,
}: Props) => {
  const {
    control,
    controlDispatch,
    inListBuilder,
    setFocus,
    focus,
    updateActiveItem,
  } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  const { fieldType } = currentItem
  const hasZendeskSettings = control.form.submissionServiceUrl === 'zendesk'
  const showIdentifier = control.form.submissionServiceUrl !== 'zendesk'

  if (inListBuilder) {
    return <ListBuilder />
  } else if (fieldType === FieldTypesEnum.PAYMENT) {
    return <PaymentField />
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
            <Box marginBottom={2}>
              <ToggleSwitchCheckbox
                className={styles.identifierToggle}
                name="enableIdentifierEditing"
                label="Gera breytingu á identifier"
                checked={identifierEditingEnabled}
                disabled={control.isReadOnly}
                onChange={setIdentifierEditingEnabled}
              />
            </Box>
            <Input
              label="identifier"
              name="identifier"
              value={currentItem.identifier ?? ''}
              backgroundColor="blue"
              onChange={(e) =>
                controlDispatch({
                  type: 'CHANGE_IDENTIFIER',
                  payload: { newValue: e.target.value },
                })
              }
              onFocus={(e) => setFocus(e.target.value)}
              onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              readOnly={control.isReadOnly || !identifierEditingEnabled}
            />
          </Box>
        )}
      </Stack>
    )
  }
}
