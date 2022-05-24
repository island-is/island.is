import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import {
  aidCalculator,
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  estimatedBreakDown,
  showSpouseData,
  Application,
} from '@island.is/financial-aid/shared/lib'

import { Breakdown, DescriptionText } from '../..'
import { ApproveOptions, ExternalData, FAApplication } from '../../../lib/types'
import { aidAmount as aidAmountMessages } from '../../../lib/messages'
import { findFamilyStatus } from '../../..'

interface EstimationProps {
  application: FAApplication
  nationalRegistry: ExternalData['nationalRegistry']
}

interface VeitaEstiamtionProps {
  application?: Application
  nationalRegistry: ExternalData['nationalRegistry']
}

export const Estimation = ({
  application,
  nationalRegistry,
}: EstimationProps) => {
  const { formatMessage } = useIntl()

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

  const aidAmount = useMemo(() => {
    if (
      application.answers.homeCircumstances.type &&
      nationalRegistry?.data?.municipality
    ) {
      return aidCalculator(
        application.answers.homeCircumstances.type,
        getAidType()
          ? nationalRegistry.data.municipality.individualAid
          : nationalRegistry.data.municipality.cohabitationAid,
      )
    }
  }, [nationalRegistry?.data?.municipality])

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            {formatMessage(aidAmountMessages.title)}
          </Text>
        </>
      </Box>

      <DescriptionText
        textProps={{ marginBottom: 2 }}
        text={aidAmountMessages.description}
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

export const VeitaEstimation = ({
  application,
  nationalRegistry,
}: VeitaEstiamtionProps) => {
  if (!application) {
    return null
  }

  const { formatMessage } = useIntl()

  const getAidType = () => {
    switch (true) {
      case nationalRegistry?.data?.applicant?.spouse?.maritalStatus !=
        undefined:
        return (
          martialStatusTypeFromMartialCode(
            nationalRegistry?.data?.applicant?.spouse?.maritalStatus,
          ) === MartialStatusType.SINGLE
        )
      case application.familyStatus != undefined:
        if (application.familyStatus) {
          return !showSpouseData[application.familyStatus]
        }
      case application.spouseNationalId != undefined:
        return false
      case !nationalRegistry?.data?.applicant?.spouse:
        return true
    }
  }

  const aidAmount = useMemo(() => {
    if (nationalRegistry?.data?.municipality && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        getAidType()
          ? nationalRegistry.data.municipality.individualAid
          : nationalRegistry.data.municipality.cohabitationAid,
      )
    }
  }, [nationalRegistry?.data?.municipality])

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <>
          <Text as="h3" variant="h3" marginBottom={2}>
            {formatMessage(aidAmountMessages.title)}
          </Text>
        </>
      </Box>

      <DescriptionText
        textProps={{ marginBottom: 2 }}
        text={aidAmountMessages.description}
      />

      <Breakdown
        calculations={estimatedBreakDown(
          aidAmount,
          application.usePersonalTaxCredit,
        )}
      />
    </>
  )
}
