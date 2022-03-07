import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { aboutForm } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { DescriptionText, PrivacyPolicyAccordion } from '..'

const AboutForm = () => {
  // TODO
  // - send correct props to accordion

  const { formatMessage } = useIntl()

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(aboutForm.general.description, {
          currentMonth: currentMonth(),
        })}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={aboutForm.bulletList.content} />
      </Box>

      <PrivacyPolicyAccordion
        municipalityPageName="reykjavik.is"
        municipalityPageUrl="https://reykjavik.is/"
      />
    </>
  )
}

export default AboutForm
