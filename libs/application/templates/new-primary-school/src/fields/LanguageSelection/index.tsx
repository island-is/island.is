import { FieldBaseProps } from '@island.is/application/types'
import React, { FC, useEffect, useState } from 'react'

import { getErrorViaPath } from '@island.is/application/core'
import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { useFormContext } from 'react-hook-form'
import { LanguageEnvironmentOptions } from '../../lib/constants'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/newPrimarySchoolUtils'

export type LanguageSelectionProps = {}

const languagesIds = {
  language1: 'languages.language1',
  language2: 'languages.language2',
  language3: 'languages.language3',
  language4: 'languages.language4',
  childLanguage: 'languages.childLanguage',
}

const LanguageSelection: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { getValues } = useFormContext()

  const [visibleLanguagesCount, setVisibleLanguagesCount] = useState(1)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    '',
    '',
    '',
    '',
  ])

  const allLanguages = getAllLanguageCodes()
  const allLanguageOptions = allLanguages
    .filter((language) => {
      if (
        language.code === 'is' &&
        getValues().languages.languageEnvironment ===
          LanguageEnvironmentOptions.ONLY_FOREIGN
      ) {
        return false
      }
      return true
    })
    .map((language) => ({
      label: language.name,
      value: language.code,
    }))

  const languageIdsArray = [
    languagesIds.language1,
    languagesIds.language2,
    languagesIds.language3,
    languagesIds.language4,
  ]

  const addLanguage = () => {
    setVisibleLanguagesCount((prev) => Math.min(prev + 1, 4))
  }

  useEffect(() => {
    const { language1, language2, language3, language4 } =
      getApplicationAnswers(application.answers)

    const selected = [language1, language2, language3, language4].filter(
      Boolean,
    )

    // Ensure the visible count is at least 1
    const visibleCount = Math.max(1, selected.length)

    setSelectedLanguages(selected)
    setVisibleLanguagesCount(visibleCount)
  }, [application])

  return (
    <Stack space={2}>
      {languageIdsArray.slice(0, visibleLanguagesCount).map((id, index) => (
        <SelectController
          key={id}
          label={formatMessage(
            newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
            { no: `${index + 1}` },
          )}
          aria-label={formatMessage(
            newPrimarySchoolMessages.differentNeeds.languageSelectionAriaLabel,
            { no: `${index + 1}` },
          )}
          error={errors && getErrorViaPath(errors, id)}
          placeholder={formatMessage(
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,
          )}
          id={id}
          name={id}
          backgroundColor="blue"
          options={allLanguageOptions}
          onSelect={({ value }) => {
            setSelectedLanguages((prevLanguages) => {
              const newLanguages = [...prevLanguages]
              newLanguages[index] = value
              return newLanguages
            })
          }}
        />
      ))}
      <Box textAlign={'right'} width="full">
        <Button
          icon="add"
          variant="text"
          size="small"
          onClick={addLanguage}
          disabled={visibleLanguagesCount >= 4}
        >
          {formatMessage(
            newPrimarySchoolMessages.differentNeeds.addLanguageButton,
          )}
        </Button>
      </Box>
      <Box
        hidden={
          selectedLanguages.filter((language) => language !== '').length <= 1
        }
      >
        <Text variant="h4" marginTop={3} marginBottom="gutter">
          {formatMessage(
            newPrimarySchoolMessages.differentNeeds.childLanguageTitle,
          )}
        </Text>
        <SelectController
          key={languagesIds.childLanguage}
          label={formatMessage(
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          )}
          placeholder={formatMessage(
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,
          )}
          error={errors && getErrorViaPath(errors, languagesIds.childLanguage)}
          id={languagesIds.childLanguage}
          name={languagesIds.childLanguage}
          backgroundColor="blue"
          options={allLanguageOptions.filter((language) =>
            selectedLanguages.includes(language.value),
          )}
        />
      </Box>
    </Stack>
  )
}
export default LanguageSelection
