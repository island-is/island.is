import React, { ReactNode, useContext, useMemo } from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import {
  aidCalculator,
  HomeCircumstances,
  getNextPeriod,
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  estimatedBreakDown,
} from '@island.is/financial-aid/shared/lib'

import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'
import { Breakdown } from '@island.is/financial-aid/shared/components'

interface Props {
  aboutText: ReactNode
  homeCircumstances?: HomeCircumstances
  usePersonalTaxCredit?: boolean
}

const Estimation = ({
  aboutText,
  homeCircumstances,
  usePersonalTaxCredit,
}: Props) => {
  const { municipality, nationalRegistryData } = useContext(AppContext)

  const aidAmount = useMemo(() => {
    if (municipality && homeCircumstances) {
      return aidCalculator(
        homeCircumstances,
        martialStatusTypeFromMartialCode(
          nationalRegistryData?.spouse?.maritalStatus,
        ) === MartialStatusType.SINGLE
          ? municipality.individualAid
          : municipality.cohabitationAid,
      )
    }
  }, [municipality])

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap" marginBottom={1}>
        <Box marginRight={1}>
          <Text as="h2" variant="h3" marginBottom={1}>
            Áætluð aðstoð
          </Text>
        </Box>

        <Text variant="small">
          (til útgreiðslu í byrjun {getNextPeriod.month})
        </Text>
      </Box>

      {aboutText}

      <Breakdown
        calculations={estimatedBreakDown(aidAmount, usePersonalTaxCredit)}
      />
    </>
  )
}

export default Estimation
