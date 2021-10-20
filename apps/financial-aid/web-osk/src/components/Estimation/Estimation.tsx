import React, { ReactNode, useContext, useMemo } from 'react'
import { Text, Box, Divider } from '@island.is/island-ui/core'

import {
  aidCalculator,
  calculateAidFinalAmount,
  calculatePersonalTaxAllowanceUsed,
  calculateTaxOfAmount,
  HomeCircumstances,
  getNextPeriod,
  MartialStatusType,
  martialStatusType,
} from '@island.is/financial-aid/shared/lib'

import format from 'date-fns/format'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

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
  const currentYear = format(new Date(), 'yyyy')

  const { municipality, nationalRegistryData } = useContext(AppContext)

  const aidAmount = useMemo(() => {
    if (municipality && homeCircumstances) {
      return aidCalculator(
        homeCircumstances,
        martialStatusType(nationalRegistryData?.spouse.maritalStatus) ===
          MartialStatusType.SINGLE
          ? municipality.individualAid
          : municipality.cohabitationAid,
      )
    }
  }, [municipality])

  const calculations = aidAmount
    ? [
        {
          title: 'Grunnupphæð',
          calculation: `${aidAmount?.toLocaleString('de-DE')} kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 
      ${calculateTaxOfAmount(aidAmount, currentYear).toLocaleString(
        'de-DE',
      )} kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `+  
      ${calculatePersonalTaxAllowanceUsed(
        aidAmount,
        Boolean(usePersonalTaxCredit),
        currentYear,
      ).toLocaleString('de-DE')} kr.`,
        },
        {
          title: 'Áætluð aðstoð (hámark)',
          calculation: `${
            calculateAidFinalAmount(
              aidAmount,
              Boolean(usePersonalTaxCredit),
              currentYear,
            ).toLocaleString('de-DE') + ' kr.'
          }`,
        },
      ]
    : []

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

      {municipality && (
        <>
          {calculations.map((item, index) => {
            return (
              <span key={`calculations-` + index}>
                <Divider />
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  padding={2}
                  background={
                    index === calculations.length - 1 ? 'blue100' : 'white'
                  }
                >
                  <Text variant="small">{item.title}</Text>
                  <Text>{item.calculation}</Text>
                </Box>
              </span>
            )
          })}

          <Divider />
        </>
      )}
    </>
  )
}

export default Estimation
