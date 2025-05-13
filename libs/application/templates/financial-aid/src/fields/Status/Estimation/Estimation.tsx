import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import {
  aidCalculator,
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
  municipality: ExternalData['municipality']
}

interface VeitaEstiamtionProps {
  application: Application
  municipality: ExternalData['municipality']
}

export const Estimation = ({ application, municipality }: EstimationProps) => {
  const { formatMessage } = useIntl()

  const getAidType = () => {
    return !showSpouseData[
      findFamilyStatus(application.answers, application.externalData)
    ]
  }

  const aidAmount = useMemo(() => {
    if (application.answers.homeCircumstances.type && municipality.data) {
      return aidCalculator(
        application.answers.homeCircumstances.type,
        getAidType()
          ? municipality.data.individualAid
          : municipality.data.cohabitationAid,
      )
    }
  }, [municipality.data])

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Text as="h3" variant="h3" marginBottom={2}>
          {formatMessage(aidAmountMessages.title)}
        </Text>
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
  municipality,
}: VeitaEstiamtionProps) => {
  const { formatMessage } = useIntl()

  const getAidType = () => {
    switch (true) {
      case application.familyStatus !== undefined:
        return !showSpouseData[application.familyStatus]
      default:
        return application.spouseNationalId == null
    }
  }

  const aidAmount = useMemo(() => {
    if (municipality.data && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        getAidType()
          ? municipality.data.individualAid
          : municipality.data.cohabitationAid,
      )
    }
  }, [municipality.data])

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Text as="h3" variant="h3" marginBottom={2}>
          {formatMessage(aidAmountMessages.title)}
        </Text>
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
