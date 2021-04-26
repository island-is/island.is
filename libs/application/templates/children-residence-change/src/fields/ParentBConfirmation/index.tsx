import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { parentBConfirmation } from '../../lib/messages'
import { DescriptionText } from '../components'
import { CRCFieldBaseProps } from '../..'
import ContractAccordionOverview from '../components/ContractOverviewAccordion/ContractOverviewAccordion'

const ParentBConfirmation = ({ application }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginTop={3}>
        <DescriptionText text={parentBConfirmation.general.description} />
      </Box>
      <Text variant="h4" marginTop={3}>
        {formatMessage(parentBConfirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText text={parentBConfirmation.nextSteps.description} />
      </Box>
      <Box marginTop={3}>
        <ContractAccordionOverview
          title={formatMessage(
            parentBConfirmation.contractOverview.accordionTitle,
          )}
          id="id_1"
          application={application}
        />
      </Box>
      <Box marginTop={5}>
        <img
          src={
            'https://images.ctfassets.net/8k0h54kbe6bj/6UGl8bkfOwUDKYveXfKkh0/c09265b9301b0be52c678a7197a64154/crc-application-submitted.svg'
          }
          alt="Umsókn sent inn mynd"
        />
      </Box>
    </>
  )
}

export default ParentBConfirmation
