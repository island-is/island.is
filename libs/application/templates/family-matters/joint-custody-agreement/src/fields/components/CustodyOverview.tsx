import React from 'react'
import { useIntl } from 'react-intl'
import { Text, Box } from '@island.is/island-ui/core'
import {
  formatAddress,
  formatSsn,
  getOtherParentInformation,
  getSelectedChildrenFromExternalData,
} from '@island.is/application/templates/family-matters-core/utils'
import { contract } from '../../lib/messages'
import { JCAApplication } from '../../types'

interface Props {
  application: JCAApplication
}

const PersonNameAndSSN = ({
  name,
  nationalId,
}: {
  name: string
  nationalId: string
}) => {
  return <Text>{`${name}, kt. ${formatSsn(nationalId)}`}</Text>
}

const CustodyOverview = ({ application }: Props) => {
  const { formatMessage } = useIntl()
  const { externalData, answers } = application
  const applicant = externalData.nationalRegistry.data
  const children = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )
  const otherParent = getOtherParentInformation(
    applicant.children,
    answers.selectedChildren,
  )
  const currentCustodyParent =
    children[0].custodyParents?.[0] === applicant.nationalId
      ? applicant
      : otherParent
  const residenceParent =
    answers.selectedLegalResidence === applicant.nationalId
      ? applicant
      : otherParent
  return (
    <>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(contract.labels.childName, {
            count: children.length,
          })}
        </Text>
        {children.map((child) => (
          <PersonNameAndSSN
            key={child.nationalId}
            name={child.fullName}
            nationalId={child.nationalId}
          />
        ))}
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(contract.labels.parents)}
        </Text>
        <PersonNameAndSSN
          name={applicant.fullName}
          nationalId={applicant.nationalId}
        />
        <Text marginBottom={2}>{formatAddress(applicant.address)}</Text>
        <PersonNameAndSSN
          name={otherParent.fullName}
          nationalId={otherParent.nationalId}
        />
        <Text>{formatAddress(otherParent.address)}</Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(contract.labels.custodyChange)}
        </Text>
        <Text>
          {formatMessage(contract.arrangement.currentCustodyParent, {
            parentName: (
              <Text as="span" color="blue400" fontWeight="semiBold">
                {currentCustodyParent.fullName}
              </Text>
            ),
          })}
        </Text>
        <Text>
          {formatMessage(contract.arrangement.jointCustody, {
            boldText: (
              <Text as="span" color="blue400" fontWeight="semiBold">
                {formatMessage(contract.arrangement.joint)}
              </Text>
            ),
          })}
        </Text>
        <Text>
          {formatMessage(contract.arrangement.legalResidence, {
            parentName: (
              <Text as="span" color="blue400" fontWeight="semiBold">
                {residenceParent.fullName}
              </Text>
            ),
          })}
        </Text>
      </Box>
    </>
  )
}

export default CustodyOverview
