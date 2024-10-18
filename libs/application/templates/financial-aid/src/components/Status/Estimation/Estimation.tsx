import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Text, Box } from '@island.is/island-ui/core'
import {
  aidCalculator,
  estimatedBreakDown,
  showSpouseData,
} from '@island.is/financial-aid/shared/lib'
import { ApproveOptions } from '../../../lib/types'
import { aidAmount as aidAmountMessages } from '../../../lib/messages'
import { findFamilyStatus } from '../../..'
import Breakdown from '../../../components/Breakdown/Breakdown'
import DescriptionText from '../../../components/DescriptionText/DescriptionText'
import { Application, DataProviderResult } from '@island.is/application/types'
import { getEstimationConstants } from './utils'

type EstimationProps = {
  application: Application
  municipality: DataProviderResult
}

export const Estimation = ({ application, municipality }: EstimationProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

  const getAidType = () => {
    return !showSpouseData[findFamilyStatus(answers, externalData)]
  }

  const {
    individualAid,
    cohabitationAid,
    homeCircumstances,
    personalTaxCredit,
  } = getEstimationConstants(municipality, answers)

  const aidAmount = useMemo(() => {
    if (homeCircumstances && municipality.data) {
      return aidCalculator(
        homeCircumstances,
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
          personalTaxCredit === ApproveOptions.Yes,
        )}
      />
    </>
  )
}
