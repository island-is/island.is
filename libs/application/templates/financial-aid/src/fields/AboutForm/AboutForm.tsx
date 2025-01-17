import React from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { currentMonth } from '@island.is/financial-aid/shared/lib'

import { DescriptionText, PrivacyPolicyAccordion } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import { aboutForm } from '../../lib/messages'

const AboutForm = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(aboutForm.general.description, {
          currentMonth: currentMonth(lang),
        })}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={aboutForm.bulletList.content} />
      </Box>

      <PrivacyPolicyAccordion
        municipalityPageUrl={
          application.externalData.municipality.data?.homepage
        }
      />
    </>
  )
}

export default AboutForm
