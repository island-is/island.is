import React from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { currentMonth } from '@island.is/financial-aid/shared/lib'

import { DescriptionText, PrivacyPolicyAccordion } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { aboutChildrenForm } from '../../lib/messages'

const AboutChildrenForm = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()

  console.log(application.externalData.childrenCustodyInformation)

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(aboutChildrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={aboutChildrenForm.page.content} />
      </Box>

      <Box marginBottom={5} background="blue100" padding={3}>
        <Text variant="h3" fontWeight="light" marginBottom={1}>
          nafn
        </Text>
        <Text variant="small" fontWeight="light">
          fæðingardagur
        </Text>
      </Box>
    </>
  )
}

export default withLogo(AboutChildrenForm)
