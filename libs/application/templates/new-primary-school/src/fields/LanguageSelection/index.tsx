import { FieldBaseProps } from '@island.is/application/types'
import React, { FC, useEffect, useState } from 'react'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SelectController } from '@island.is/shared/form-fields'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/newPrimarySchoolUtils'

const languagesIds = {
  language1: 'languages.language1',
  language2: 'languages.language2',
  language3: 'languages.language3',
  language4: 'languages.language4',
  childLanguage: 'languages.childLanguage',
}

const LanguageSelection: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  const [visibleLanguagesCount, setVisibleLanguagesCount] = useState(1)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    '',
    '',
    '',
    '',
  ])

  const allLanguages = getAllLanguageCodes()
  const allLanguageOptions = allLanguages.map((language) => ({
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

  /**
   * Hide child language if there is no language selected
   * @returns
   */
  const hideChildLanguage = () => {
    return selectedLanguages.filter((language) => language !== '').length <= 1
  }

  useEffect(() => {
    const { language1, language2, language3, language4 } =
      getApplicationAnswers(application.answers)
    const selected: string[] = []
    let visibleCount = 1
    if (language1) {
      selected.push(language1)
      visibleCount = 1
    }
    if (language2) {
      selected.push(language2)
      visibleCount = 2
    }
    if (language3) {
      selected.push(language3)
      visibleCount = 3
    }
    if (language4) {
      selected.push(language4)
      visibleCount = 4
    }

    setSelectedLanguages(selected)
    setVisibleLanguagesCount(visibleCount)
  }, [application, getApplicationAnswers])

  return (
    <Stack space={2}>
      {languageIdsArray.slice(0, visibleLanguagesCount).map((id, index) => (
        <SelectController
          key={languageIdsArray[index]}
          label={formatMessage(
            newPrimarySchoolMessages.differentNeeds.languageSelectionTitle,
            { no: `${index + 1}` },
          )}
          placeholder={formatMessage(
            newPrimarySchoolMessages.differentNeeds
              .languageSelectionPlaceholder,
          )}
          id={languageIdsArray[index]}
          name={languageIdsArray[index]}
          backgroundColor="blue"
          options={allLanguageOptions}
          onSelect={(value) => {
            setSelectedLanguages((prevLanguages) => {
              const newLanguages = [...prevLanguages]
              newLanguages[index] = value.value
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
      <Box hidden={hideChildLanguage()}>
        <Text variant="h4" marginTop={3}>
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
