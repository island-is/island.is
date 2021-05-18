import React from 'react'
import { useIntl } from 'react-intl'
import { Text, Box } from '@island.is/island-ui/core'
import {
  childrenResidenceInfo,
  formatDate,
} from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import * as m from '../../lib/messages'
import { Roles } from '../../lib/constants'
import { JCAApplication } from '../../types'
import CustodyOverview from './CustodyOverview'

interface Props {
  application: JCAApplication
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
      <CustodyOverview application={application} />
      <Text marginTop={4} variant="h4">
        {formatMessage(m.contract.labels.contactInformation)}
      </Text>
      <Text marginTop={1}>{answers[parentKey]?.email}</Text>
      <Text>{answers[parentKey]?.phoneNumber}</Text>
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
