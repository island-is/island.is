import React from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { User, Locale } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { useUpdateUserProfileMutation } from '../../../gen/graphql'

export const UserLanguageSwitcher = ({ user }: { user: User }) => {
  const { lang, formatMessage, changeLanguage } = useLocale()
  const [updateUserProfileMutation] = useUpdateUserProfileMutation()

  const handleLanguageChange = async () => {
    const locale = lang === 'en' ? 'is' : 'en'
    const actor = user.profile.actor
    const isDelegation = Boolean(actor)
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

  return (
    <Box marginRight={2}>
      <Button
        variant="utility"
        onClick={handleLanguageChange}
        aria-label={'switch language'}
      >
        {lang === 'en' ? 'IS' : 'EN'}
      </Button>
    </Box>
  )
}
