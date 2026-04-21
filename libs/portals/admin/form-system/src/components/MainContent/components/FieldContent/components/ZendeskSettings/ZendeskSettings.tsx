import { FormSystemFieldSettings } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'

interface Props {
  fieldSettings: FormSystemFieldSettings
}

export const ZendeskSettings = ({ fieldSettings }: Props) => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { isReadOnly } = control

  return (
    <Box marginTop={2}>
      <GridRow marginTop={2} marginBottom={2}>
        <GridColumn span="5/10">
          <Checkbox
            checked={fieldSettings?.zendeskIsCustomField ?? false}
            label="Zendesk reitur"
            disabled={isReadOnly}
            onChange={(e) => {
              controlDispatch({
                type: 'SET_ZENDESK_FIELD_SETTINGS',
                payload: {
                  property: 'zendeskIsCustomField',
                  value: e.target.checked,
                  update: updateActiveItem,
                },
              })
              if (!e.target.checked) {
                controlDispatch({
                  type: 'SET_ZENDESK_FIELD_SETTINGS',
                  payload: {
                    property: 'zendeskCustomFieldId',
                    value: '',
                    update: updateActiveItem,
                  },
                })
              }
            }}
          ></Checkbox>
          {fieldSettings?.zendeskIsCustomField && (
            <Box marginTop={2}>
              <Input
                name="custom-field-id"
                placeholder="Zendesk field id"
                readOnly={isReadOnly}
                value={fieldSettings?.zendeskCustomFieldId ?? ''}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_ZENDESK_FIELD_SETTINGS',
                    payload: {
                      property: 'zendeskCustomFieldId',
                      value: e.target.value,
                      update: updateActiveItem,
                    },
                  })
                }
              ></Input>
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
