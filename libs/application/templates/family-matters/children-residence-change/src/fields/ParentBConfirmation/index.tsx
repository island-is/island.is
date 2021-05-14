import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import {
  DescriptionText,
  BorderedAccordion,
} from '@island.is/application/templates/family-matters-core/components'
import { parentBConfirmation } from '../../lib/messages'
import { ContractOverview } from '../components'
import { CRCFieldBaseProps } from '../..'

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
        <BorderedAccordion
          title={formatMessage(
            parentBConfirmation.contractOverview.accordionTitle,
          )}
          id="id_1"
        >
          <ContractOverview application={application} />
        </BorderedAccordion>
      </Box>
      <Box marginTop={5}>
        <img
          src={
            'https://images.ctfassets.net/8k0h54kbe6bj/6UGl8bkfOwUDKYveXfKkh0/c09265b9301b0be52c678a7197a64154/crc-application-submitted.svg'
          }
          alt=""
        />
      </Box>
    </>
  )
}

export default ParentBConfirmation
