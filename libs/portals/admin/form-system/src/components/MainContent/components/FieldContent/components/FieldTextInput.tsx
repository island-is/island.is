import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  Input,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'

interface Props {
  field?: FormSystemField
  property: 'informationText' | 'tooltip' | 'subLabel'
  label: string
  englishLabel: string
  withToggle?: boolean
}

export const FieldTextInput = ({
  field,
  property,
  label,
  englishLabel,
  withToggle = false,
}: Props) => {
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    updateActiveItem,
    getTranslation,
  } = useContext(ControlContext)
  const currentItem = field ?? (control.activeItem.data as FormSystemField)
  const text =
    property === 'subLabel'
      ? currentItem.fieldSettings?.subLabel
      : currentItem[property]
  const hasText = Boolean(text?.is?.trim() || text?.en?.trim())
  const [enabled, setEnabled] = useState(hasText)
  const showInputs = !withToggle || enabled || hasText
  const changeText = (lang: 'is' | 'en', newValue: string) =>
    controlDispatch({
      type: 'CHANGE_FIELD_TEXT',
      payload: {
        property,
        lang,
        newValue,
        ...(field && { fieldId: field.id }),
      },
    })

  if (
    property === 'tooltip' &&
    ![
      FieldTypesEnum.TEXTBOX,
      FieldTypesEnum.NUMBERBOX,
      FieldTypesEnum.CHECKBOX,
      FieldTypesEnum.NATIONAL_ID,
      FieldTypesEnum.EMAIL,
    ].includes(currentItem.fieldType ?? '')
  ) {
    return null
  }

  return (
    <Stack space={2}>
      {withToggle && (
        <ToggleSwitchCheckbox
          name={`enable-${property}`}
          label={label}
          checked={enabled || hasText}
          disabled={control.isReadOnly || hasText}
          onChange={setEnabled}
        />
      )}
      {showInputs && property === 'informationText' && (
        <Text variant="small">
          {'Upplýsingatextinn getur innihaldið HTML-tögin <strong> fyrir feitletrun og <em> fyrir skáletrun. ' +
            'Hvert opnunartag þarf samsvarandi lokunartag, t.d. <strong> og </strong>. ' +
            'Dæmi: <strong>Feitletraður texti</strong> og <em>Skáletraður texti</em>.'}
        </Text>
      )}
      {showInputs &&
        (['is', 'en'] as const).map((lang) => (
          <Input
            key={lang}
            label={lang === 'is' ? label : englishLabel}
            name={`${property}-${lang}`}
            value={text?.[lang] ?? ''}
            textarea
            backgroundColor="blue"
            readOnly={control.isReadOnly}
            onFocus={async (event) => {
              const value = event.target.value
              if (
                !control.isReadOnly &&
                lang === 'en' &&
                !text?.en &&
                text?.is?.trim()
              ) {
                const translation = await getTranslation(text.is)
                changeText('en', translation.translation)
              }
              setFocus(value)
            }}
            onBlur={(event) =>
              event.target.value !== focus &&
              updateActiveItem(
                field ? { type: 'Field', data: currentItem } : undefined,
              )
            }
            onChange={(event) => changeText(lang, event.target.value)}
          />
        ))}
    </Stack>
  )
}
