import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { contractRejected } from '../../lib/messages'
import DescriptionText from './DescriptionText'

interface Props {
  children: React.ReactNode
}

const ContractRejectedContainer = ({ children }: Props) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box marginTop={3}>{children}</Box>
      <Text marginTop={3} variant="h3">
        {formatMessage(contractRejected.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText text={contractRejected.nextSteps.description} />
      </Box>
    </>
  )
}

export default ContractRejectedContainer
