import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import {
  Checkbox,
  GridColumn as Column,
  GridRow as Row,
  Stack,
  Input,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext } from 'react'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { ToggleConnection } from './ToggleConnection'

export const CheckboxSettings = () => {
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    updateActiveItem,
    getTranslation,
  } = useContext(ControlContext)
  const { activeItem, isReadOnly } = control
  const currentItem = activeItem.data as FormSystemField
  const { fieldSettings } = currentItem
  const { formatMessage } = useLocale()

  const hasDescriptionText =
    (currentItem?.description?.is ?? '').trim().length > 0 ||
    (currentItem?.description?.en ?? '').trim().length > 0

  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            checked={fieldSettings?.isLarge ?? false}
            label={formatMessage(m.largeCheckbox)}
            disabled={isReadOnly || hasDescriptionText}
            tooltip={
              hasDescriptionText
                ? 'Ómögulegt að afvelja þar sem undirtexti er í notkun'
                : ''
            }
            onChange={(e) => {
              controlDispatch({
                type: 'SET_FIELD_SETTINGS',
                payload: {
                  property: 'isLarge',
                  value: e.target.checked,
                  update: updateActiveItem,
                },
              })
              if (!e.target.checked && fieldSettings?.hasDescription) {
                controlDispatch({
                  type: 'SET_FIELD_SETTINGS',
                  payload: {
                    property: 'hasDescription',
                    value: false,
                    update: updateActiveItem,
                  },
                })
              }
            }}
          />
        </Column>
      </Row>
      {fieldSettings?.isLarge && (
        <Row>
          <Column>
            <Checkbox
              checked={fieldSettings?.hasDescription ?? false}
              label={formatMessage(m.hasSublabel)}
              disabled={isReadOnly || hasDescriptionText}
              tooltip={
                hasDescriptionText
                  ? 'Ómögulegt að afvelja þar sem undirtexti er í notkun'
                  : ''
              }
              onChange={(e) =>
                controlDispatch({
                  type: 'SET_FIELD_SETTINGS',
                  payload: {
                    property: 'hasDescription',
                    value: e.target.checked,
                    update: updateActiveItem,
                  },
                })
              }
            />
          </Column>
        </Row>
      )}
      {fieldSettings?.hasDescription && (
        <>
          <Row>
            <Column span="10/10">
              <Input
                label="Undirtexti"
                name="description"
                value={currentItem?.description?.is ?? ''}
                textarea
                backgroundColor="blue"
                readOnly={isReadOnly}
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_DESCRIPTION',
                    payload: {
                      lang: 'is',
                      newValue: e.target.value,
                    },
                  })
                }
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label="Undirtexti (Enska)"
                name="description"
                value={currentItem?.description?.en ?? ''}
                textarea
                backgroundColor="blue"
                readOnly={isReadOnly}
                onFocus={async (e) => {
                  if (
                    !currentItem?.description?.en &&
                    currentItem?.description?.is !== ''
                  ) {
                    const translation = await getTranslation(
                      currentItem?.description?.is ?? '',
                    )
                    controlDispatch({
                      type: 'CHANGE_DESCRIPTION',
                      payload: {
                        lang: 'en',
                        newValue: translation.translation,
                      },
                    })
                  }
                  setFocus(e.target.value)
                }}
                onBlur={(e) => e.target.value !== focus && updateActiveItem()}
                onChange={(e) =>
                  controlDispatch({
                    type: 'CHANGE_DESCRIPTION',
                    payload: {
                      lang: 'en',
                      newValue: e.target.value,
                    },
                  })
                }
              />
            </Column>
          </Row>
        </>
      )}
      <Row>
        <Column>
          <ToggleConnection isPartOfMultiset={currentItem.isPartOfMultiset} />
        </Column>
      </Row>
    </Stack>
  )
}
