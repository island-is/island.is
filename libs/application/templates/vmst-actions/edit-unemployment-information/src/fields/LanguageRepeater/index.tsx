import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { coreMessages } from '@island.is/application/core'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { application as applicationMessages } from '../../lib/messages'
import { getDefaultLanguages } from '../../utils/defaultValues'
import {
  getLanguageOptions,
  getLanguageAbilityOptions,
} from '../../utils/selectOptions'

export const LanguageRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { getValues, setValue, watch } = useFormContext()
  const { formatMessage, locale } = useLocale()

  const defaultLanguages = useMemo(
    () => getDefaultLanguages(application.externalData),
    [application.externalData],
  )

  const languageOptions = useMemo(
    () => getLanguageOptions(application.externalData, locale as Locale),
    [application.externalData, locale],
  )

  const languageAbilityOptions = useMemo(
    () => getLanguageAbilityOptions(application.externalData, locale as Locale),
    [application.externalData, locale],
  )

  useEffect(() => {
    const currentLang = getValues('languageSkills')
    if (
      (!currentLang || currentLang.length === 0) &&
      defaultLanguages.length > 0
    ) {
      setValue('languageSkills', defaultLanguages)
    }
  }, [defaultLanguages, getValues, setValue])

  const languageRows: Array<Record<string, string> & { readOnly?: boolean }> =
    watch('languageSkills') ?? []

  const editableLanguageCount = languageRows.filter((r) => !r.readOnly).length

  const addRow = () => {
    const current = getValues('languageSkills') ?? []
    setValue('languageSkills', [...current, {}])
  }

  const removeRow = (index: number) => {
    const current: Array<Record<string, string>> =
      getValues('languageSkills') ?? []
    setValue(
      'languageSkills',
      current.filter((_, i) => i !== index),
    )
  }

  return (
    <Box>
      {languageRows.map((row, index) => {
        const isReadOnly = !!row.readOnly
        const prefix = `languageSkills[${index}]`

        const languageLabel =
          languageOptions.find((o) => o.value === row.language)?.label ?? ''
        const skillLabel =
          languageAbilityOptions.find((o) => o.value === row.skill)?.label ?? ''

        return (
          <Box key={`lang-${index}`} marginBottom={3}>
            <Text variant="h5" marginBottom={1}>
              {formatMessage(applicationMessages.languageTitle)} {index + 1}
            </Text>
            <GridRow>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={1}>
                {isReadOnly ? (
                  <Input
                    name={`${prefix}.language`}
                    label={formatMessage(applicationMessages.languageNameLabel)}
                    value={languageLabel}
                    readOnly
                  />
                ) : (
                  <SelectController
                    id={`${prefix}.language`}
                    name={`${prefix}.language`}
                    label={formatMessage(applicationMessages.languageNameLabel)}
                    options={languageOptions}
                    backgroundColor="blue"
                  />
                )}
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={1}>
                {isReadOnly ? (
                  <Input
                    name={`${prefix}.skill`}
                    label={formatMessage(
                      applicationMessages.languageAbilityLabel,
                    )}
                    value={skillLabel}
                    readOnly
                  />
                ) : (
                  <SelectController
                    id={`${prefix}.skill`}
                    name={`${prefix}.skill`}
                    label={formatMessage(
                      applicationMessages.languageAbilityLabel,
                    )}
                    options={languageAbilityOptions}
                    backgroundColor="blue"
                  />
                )}
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box display="flex" justifyContent="flexEnd" columnGap={1}>
        {editableLanguageCount > 0 && (
          <Button
            variant="ghost"
            colorScheme="destructive"
            size="small"
            onClick={() => removeRow(languageRows.length - 1)}
          >
            {formatMessage(coreMessages.buttonRemove)}
          </Button>
        )}
        <Button variant="ghost" size="small" onClick={() => addRow()}>
          {formatMessage(applicationMessages.addLanguageLabel)}
        </Button>
      </Box>
    </Box>
  )
}
