import React from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import {
  aidCalculator,
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  estimatedBreakDown,
  showSpouseData,
} from '@island.is/financial-aid/shared/lib'

import { Breakdown, DescriptionText } from '../..'
import { ApproveOptions, FAApplication } from '../../../lib/types'
import { findFamilyStatus } from '../../../lib/utils'
import { status } from '../../../lib/messages'

interface Props {
  application: FAApplication
}

const Estimation = ({ application }: Props) => {
  const { formatMessage } = useIntl()
  const { nationalRegistry } = application.externalData

  const getAidType = () => {
    switch (true) {
      case nationalRegistry?.data?.applicant?.spouse?.maritalStatus !=
        undefined:
        return (
          martialStatusTypeFromMartialCode(
            nationalRegistry?.data?.applicant?.spouse?.maritalStatus,
          ) === MartialStatusType.SINGLE
        )
      default:
        return !showSpouseData[
          findFamilyStatus(application.answers, application.externalData)
        ]
    }
  }

  const aidAmount = aidCalculator(
    application.answers.homeCircumstances.type,
    getAidType()
      ? nationalRegistry?.data?.municipality?.individualAid
      : nationalRegistry?.data?.municipality?.cohabitationAid,
  )

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            {formatMessage(status.aidAmount.title)}
          </Text>
        </>
      </Box>

      <DescriptionText
        textProps={{ marginBottom: 2 }}
        text={status.aidAmount.description}
      />

      <Breakdown
        calculations={estimatedBreakDown(
          aidAmount,
          application.answers.personalTaxCredit === ApproveOptions.Yes,
        )}
      />
    </>
  )
}

export default Estimation
