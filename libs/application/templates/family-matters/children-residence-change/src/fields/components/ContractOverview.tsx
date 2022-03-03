import React from 'react'
import { useIntl } from 'react-intl'

import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import {
  childrenResidenceInfo,
  formatDate,
  formatPhoneNumber,
} from '@island.is/application/templates/family-matters-core/utils'
import { Box,Text } from '@island.is/island-ui/core'

import { Roles } from '../../lib/constants'
import * as m from '../../lib/messages'
import { CRCApplication } from '../../types'

import TransferOverview from './TransferOverview'

interface Props {
  application: CRCApplication
  parentKey: Roles
}

const ContractOverview = ({ application, parentKey }: Props) => {
  const { formatMessage, locale } = useIntl()
  const { externalData, answers } = application
  const applicant = externalData.nationalRegistry.data
  const childResidenceInfo = childrenResidenceInfo(
    applicant,
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
