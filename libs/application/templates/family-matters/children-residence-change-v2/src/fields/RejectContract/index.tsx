import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { rejectContract } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import * as style from '../Shared.css'

const RejectContract = ({ application }: CRCFieldBaseProps) => {
  const { externalData } = application
  const { formatMessage } = useIntl()
  const applicant = externalData.nationalRegistry.data
  return (
    <>
      <Box className={style.descriptionOffset}>
        <DescriptionText
          text={rejectContract.general.description}
          format={{ otherParentName: applicant.fullName }}
        ></DescriptionText>
      </Box>
      <Text marginTop={3} variant="h3">
        {formatMessage(rejectContract.conciliation.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText text={rejectContract.conciliation.description} />
      </Box>
    </>
  )
}

export default RejectContract
