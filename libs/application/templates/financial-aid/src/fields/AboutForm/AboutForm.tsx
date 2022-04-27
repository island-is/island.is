import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { aboutForm } from '../../lib/messages'
import { useIntl } from 'react-intl'

import { currentMonth } from '@island.is/financial-aid/shared/lib'
import { DescriptionText, PrivacyPolicyAccordion } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import RejectionMessage from '../Status/RejectionMessage/RejectionMessage'

const AboutForm = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()

  return (
    <>
      {true && (
        <RejectionMessage
          rejectionComment="hóhóhóhó"
          rulesPage={'kolibri.is'}
          homepage={'visir.is'}
          email={'david@david.is'}
        />
      )}
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(aboutForm.general.description, {
          currentMonth: currentMonth(),
        })}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={aboutForm.bulletList.content} />
      </Box>

      <PrivacyPolicyAccordion
        municipalityPageUrl={
          application.externalData.nationalRegistry?.data?.municipality
            ?.homepage
        }
      />
    </>
  )
}

export default AboutForm
