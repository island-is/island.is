import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { CRCApplication } from '../../types'
import { useIntl } from 'react-intl'
import {
  childrenResidenceInfo,
  formatAddress,
  getSelectedChildrenFromExternalData,
} from '../..'
import { contract } from '../../lib/messages'

interface Props {
  application: CRCApplication
}

const TransferOverview = ({ application }: Props) => {
  const { formatMessage } = useIntl()
  const { externalData, answers } = application
  const applicant = externalData.nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(applicant, answers)
  const children = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )
  return (
    <>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(contract.labels.childName, {
            count: children.length,
          })}
        </Text>
        {children.map((child) => (
          <Text key={child.nationalId}>{child.fullName}</Text>
        ))}
      </Box>
      <Box marginTop={4}>
        <Text variant="h4">
          {formatMessage(contract.labels.currentResidence)}
        </Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo.current.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo.current.address)}
        </Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4">{formatMessage(contract.labels.newResidence)}</Text>
        <Text variant="h4" color="blue400">
          {childResidenceInfo.future.parentName}
        </Text>
        <Text fontWeight="light">
          {formatAddress(childResidenceInfo.future.address)}
        </Text>
      </Box>
    </>
  )
}

export default TransferOverview
