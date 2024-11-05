import { Box, Select } from '@island.is/island-ui/core'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Controller } from 'react-hook-form'

export type ListItemFieldType = {
  label: string
  required: boolean | undefined
  fieldId: string
  options: {
    value: {
      nameIs: string
      nameEn: string
    }
    label: string
  }[]
}

export const ListItemField: FC<React.PropsWithChildren<ListItemFieldType>> = (
  props,
) => {
  const { fieldId, label, options, required } = props
  const { lang } = useLocale()

  return (
    <Box paddingTop={2}>
      <Controller
        name={fieldId}
        render={({ field: { onChange, value } }) => {
          return (
            <Select
              id={fieldId}
              label={label}
              options={options}
              onChange={(option) => {
                onChange(option?.value)
              }}
              value={
                value
                  ? {
                      value: {
                        nameIs: value.nameIs,
                        nameEn: value.nameEn,
                      },
                      label: lang === 'is' ? value.nameIs : value.nameEn,
                    }
                  : undefined
              }
              backgroundColor="blue"
              required={required}
            />
          )
        }}
      />
    </Box>
  )
}
