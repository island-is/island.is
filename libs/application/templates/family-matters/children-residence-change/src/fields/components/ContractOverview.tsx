import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { CRCApplication } from '../../types'
import { useIntl } from 'react-intl'
import {
  childrenResidenceInfo,
  formatDate,
} from '@island.is/application/templates/family-matters'
import * as m from '../../lib/messages'
import DescriptionText from './DescriptionText'
import TransferOverview from './TransferOverview'
import { Roles } from '../../lib/constants'

interface Props {
  application: CRCApplication
}

const ContractOverview = ({ application }: Props) => {
  const { formatMessage } = useIntl()
  const { externalData, answers } = application
  const applicant = externalData.nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    answers.selectedChildren,
  )
  const parentKey =
    application.state === 'draft' ? Roles.ParentA : Roles.ParentB

  return (
    <>
      <TransferOverview application={application} />
      <Text marginTop={4} variant="h4">
        {formatMessage(m.contract.labels.contactInformation)}
      </Text>
      <Text marginTop={1}>{answers[parentKey]?.email}</Text>
      <Text>{answers[parentKey]?.phoneNumber}</Text>
      {answers.residenceChangeReason && (
        <Box marginTop={4}>
          <Text variant="h4">{formatMessage(m.reason.input.label)}</Text>
          <Text marginTop={1}>{answers.residenceChangeReason}</Text>
        </Box>
      )}
      <Text marginTop={4} variant="h4">
        {formatMessage(m.duration.general.sectionTitle)}
      </Text>
      <Text marginTop={1}>
        {answers.selectDuration.type === 'temporary' &&
        answers.selectDuration.date
          ? formatDate(answers.selectDuration.date)
          : formatMessage(m.duration.permanentInput.label)}
      </Text>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.childBenefit.label)}
        </Text>
        <DescriptionText
          text={m.contract.childBenefit.text}
          textProps={{ marginBottom: 0 }}
          format={{
            currentResidenceParentName: childResidenceInfo.current.parentName,
          }}
        />
      </Box>
    </>
  )
}

export default ContractOverview
