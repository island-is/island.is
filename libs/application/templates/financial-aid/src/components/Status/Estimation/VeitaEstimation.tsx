import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Text, Box } from '@island.is/island-ui/core'
import { aidAmount as aidAmountMessages } from '../../../lib/messages'
import Breakdown from '../../../components/Breakdown/Breakdown'
import DescriptionText from '../../../components/DescriptionText/DescriptionText'
import { DataProviderResult } from '@island.is/application/types'
import { getEstimationConstants } from './utils'
import {
  estimatedBreakDown,
  showSpouseData,
  Application as FinancialAidAnswers,
  aidCalculator,
} from '@island.is/financial-aid/shared/lib'

type VeitaEstiamtionProps = {
  application: FinancialAidAnswers
  municipality: DataProviderResult
}

export const VeitaEstimation = ({
  application,
  municipality,
}: VeitaEstiamtionProps) => {
  const { formatMessage } = useIntl()

  const getAidType = () => {
    if (application.familyStatus != undefined) {
      return !showSpouseData[application.familyStatus]
    } else {
      return application.spouseNationalId == null
    }
  }

  const { individualAid, cohabitationAid } =
    getEstimationConstants(municipality)

  const aidAmount = useMemo(() => {
    if (municipality.data && application.homeCircumstances) {
      return aidCalculator(
        application.homeCircumstances,
        getAidType() ? individualAid : cohabitationAid,
      )
    }
  }, [municipality.data])

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
