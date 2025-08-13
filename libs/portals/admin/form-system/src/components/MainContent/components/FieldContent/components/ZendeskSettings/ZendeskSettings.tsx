import { FormSystemFieldSettings } from '@island.is/api/schema'
import {
  Box,
  GridColumn,
  GridRow,
  Text,
  Checkbox,
  Input,
} from '@island.is/island-ui/core'
import { ControlContext } from '../../../../../../context/ControlContext'
import { useContext } from 'react'

interface Props {
  fieldSettings: FormSystemFieldSettings
}

export const ZendeskSettings = ({ fieldSettings }: Props) => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)

  return (
    <Box marginTop={2}>
      <Text variant="h4">Zendesk stillingar</Text>
      <GridRow marginTop={2} marginBottom={2}>
        <GridColumn span="5/10">
          <Checkbox
            checked={fieldSettings?.zendeskIsPublic ?? false}
            label="body"
            onChange={(e) =>
              controlDispatch({
                type: 'SET_ZENDESK_FIELD_SETTINGS',
                payload: {
                  property: 'zendeskIsPublic',
                  value: e.target.checked,
                  update: updateActiveItem,
                },
              })
            }
          />
        </GridColumn>
        <GridColumn span="5/10">
          <Checkbox
            checked={fieldSettings?.zendeskIsCustomField ?? false}
            label="custom field"
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
                placeholder="Sláðu inn Zendesk field id"
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
