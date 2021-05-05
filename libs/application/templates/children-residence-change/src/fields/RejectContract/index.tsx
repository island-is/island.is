import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { rejectContract } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '../components'

const RejectContract = ({ application }: CRCFieldBaseProps) => {
  const { externalData } = application
  const { formatMessage } = useIntl()
  const applicant = externalData.nationalRegistry.data
  return (
    <>
      <Box marginTop={3}>
        <DescriptionText
          text={rejectContract.general.description}
          format={{ otherParentName: applicant.fullName }}
        ></DescriptionText>
      </Box>
      <Text marginTop={3} variant="h3">
        {formatMessage(rejectContract.conciliation.title)}
      </Text>
      <DescriptionText text={rejectContract.conciliation.description} />
    </>
  )
}

export default RejectContract
