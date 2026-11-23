import { FormSystemField } from '@island.is/api/schema'
import { Input, Stack } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'

interface Props {
  field?: FormSystemField
  property: 'informationText' | 'tooltip' | 'subLabel'
  label: string
  englishLabel: string
}

export const FieldTextInput = ({
  field,
  property,
  label,
  englishLabel,
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

  return (
    <Stack space={2}>
      {(['is', 'en'] as const).map((lang) => (
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
