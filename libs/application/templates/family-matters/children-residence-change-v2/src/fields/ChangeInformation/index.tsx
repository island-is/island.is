import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import {
  formatAddress,
  childrenResidenceInfo,
} from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { newResidence } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const ChangeInformation = ({ application }: CRCFieldBaseProps) => {
  const { externalData, answers } = application
  const { formatMessage } = useIntl()
  const applicant = externalData.nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    externalData.childrenCustodyInformation.data,
    answers.selectedChildren,
  )
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={newResidence.general.description} />
      </Box>
      <Box marginBottom={4}>
        <Text variant="h4">
          {formatMessage(newResidence.information.currentResidenceLabel)}
        </Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo?.current?.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo?.current?.address)}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <Text variant="h4">
          {formatMessage(newResidence.information.newResidenceLabel)}
        </Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo?.future?.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo?.future?.address)}
        </Text>
      </Box>
    </>
  )
}

export default ChangeInformation
