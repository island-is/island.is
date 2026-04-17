import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import {
  Checkbox,
  GridColumn as Column,
  Input,
  GridRow as Row,
  Stack,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../../../context/ControlContext'

export const MessageWithLinkSettings = () => {
  const {
    control,
    controlDispatch,
    focus,
    setFocus,
    updateActiveItem,
    getTranslation,
  } = useContext(ControlContext)
  const { isReadOnly } = control
  const currentItem = control.activeItem.data as FormSystemField
  const { fieldSettings } = currentItem
  const { formatMessage } = useIntl()
  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            label={formatMessage(m.addLink)}
            checked={fieldSettings?.hasLink ?? false}
            disabled={isReadOnly}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                payload: {
                  property: 'hasLink',
                  checked: e.target.checked,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>
      {fieldSettings !== undefined && fieldSettings?.hasLink && (
        <Stack space={2}>
          <Row>
            <Column span="5/10">
              <Input
                label={formatMessage(m.buttonText)}
                name="buttonTitle"
                backgroundColor="blue"
                value={fieldSettings?.buttonText?.is ?? ''}
                readOnly={isReadOnly}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                    payload: {
                      property: 'buttonText',
                      lang: 'is',
                      value: e.target.value,
                    },
                  })
                }
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
            <Column span="5/10">
              <Input
                label={formatMessage(m.buttonTextEnglish)}
                name="buttonTitleEn"
                backgroundColor="blue"
                value={fieldSettings.buttonText?.en ?? ''}
                readOnly={isReadOnly}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                    payload: {
                      property: 'buttonText',
                      lang: 'en',
                      value: e.target.value,
                    },
                  })
                }
                onFocus={async (e) => {
                  if (
                    !fieldSettings.buttonText?.en &&
                    fieldSettings?.buttonText?.is !== ''
                  ) {
                    const translation = await getTranslation(
                      fieldSettings?.buttonText?.is ?? '',
                    )
                    controlDispatch({
                      type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                      payload: {
                        property: 'buttonText',
                        lang: 'en',
                        value: translation.translation,
                      },
                    })
                  }
                  setFocus(e.target.value)
                }}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label={formatMessage(m.url)}
                name="url"
                backgroundColor="blue"
                placeholder="island.is"
                value={fieldSettings?.url ?? ''}
                readOnly={isReadOnly}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_MESSAGE_WITH_LINK_SETTINGS',
                    payload: {
                      property: 'url',
                      value: e.target.value,
                    },
                  })
                }
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
              />
            </Column>
          </Row>
        </Stack>
      )}
    </Stack>
  )
}
