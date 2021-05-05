import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { contractRejected } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '../components'

const ContractRejected = ({}: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box marginTop={3}>
        <DescriptionText
          text={contractRejected.general.description}
        ></DescriptionText>
      </Box>
      <Text marginTop={3} variant="h3">
        {formatMessage(contractRejected.nextSteps.title)}
      </Text>
      <DescriptionText text={contractRejected.nextSteps.description} />
    </>
  )
}

export default ContractRejected
