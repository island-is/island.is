import React from 'react'
import { Box, Button, Select } from '@island.is/island-ui/core'
import { User, Locale } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { useUpdateUserProfileMutation } from '../../../gen/graphql'
import { sharedMessages } from '@island.is/shared/translations'
import { checkDelegation } from '@island.is/shared/utils'

export const UserLanguageSwitcher = ({
  user,
  dropdown = false,
}: {
  user: User
  dropdown?: boolean
}) => {
  const { lang, formatMessage, changeLanguage } = useLocale()
  const [updateUserProfileMutation] = useUpdateUserProfileMutation()

  const handleLanguageChange = async () => {
    const locale = lang === 'en' ? 'is' : 'en'
    const isDelegation = checkDelegation(user)

    changeLanguage(locale as Locale)

    if (user && !isDelegation) {
      try {
        await updateUserProfileMutation({
          variables: {
            input: {
              locale: locale,
            },
          },
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  return dropdown ? (
    <Box paddingBottom={[2, 3]}>
      <Select
        backgroundColor="blue"
        name="language-switcher"
        data-testid="language-switcher"
        id="language-switcher"
        aria-label={'switch language'}
        size="xs"
        value={
          lang === 'en'
            ? { label: 'English', value: 'en' }
            : { label: 'Íslenska', value: 'is' }
        }
        onChange={handleLanguageChange}
        label={formatMessage(sharedMessages.language)}
        options={[
          { label: 'Íslenska', value: 'is' },
          { label: 'English', value: 'en' },
        ]}
      />
    </Box>
  ) : (
    <Box marginRight={[1, 1, 2]}>
      <Button
        variant="utility"
        colorScheme="white"
        onClick={handleLanguageChange}
        aria-label={'switch language'}
        data-testid="language-switcher-button"
      >
        {lang === 'en' ? 'IS' : 'EN'}
      </Button>
    </Box>
  )
}
