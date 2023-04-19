import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { CRCApplication } from '../../types'
import { useIntl } from 'react-intl'
import {
  childrenResidenceInfo,
  formatDate,
  formatPhoneNumber,
} from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import * as m from '../../lib/messages'
import TransferOverview from './TransferOverview'
import { Roles } from '../../lib/constants'

interface Props {
  application: CRCApplication
  parentKey: Roles.ParentA | Roles.ParentB
}

const ContractOverview = ({ application, parentKey }: Props) => {
  const { formatMessage, locale } = useIntl()
  const { externalData, answers } = application
  const applicant = externalData.nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
    externalData.childrenCustodyInformation.data,
    answers.selectedChildren,
  )

  return (
    <>
      <TransferOverview application={application} />
      <Text marginTop={4} variant="h4">
        {formatMessage(m.contract.labels.contactInformation)}
      </Text>
      <Text marginTop={1}>{answers[parentKey]?.email}</Text>
      <Text>{formatPhoneNumber(answers[parentKey]?.phoneNumber)}</Text>
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
          ? formatMessage(m.contract.duration.text, {
              date: formatDate({
                date: answers.selectDuration.date,
                localeKey: locale,
              }),
            })
          : formatMessage(m.contract.duration.permanentText)}
      </Text>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.childBenefit.label)}
        </Text>
        <DescriptionText
          text={
            answers.selectChildSupportPayment === 'agreement'
              ? m.contract.childBenefit.agreementText
              : m.contract.childBenefit.text
          }
          textProps={{ marginBottom: 0 }}
          format={{
            currentResidenceParentName:
              childResidenceInfo?.current?.parentName || '',
          }}
        />
      </Box>
    </>
  )
}

export default ContractOverview
