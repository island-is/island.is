import React, { ReactNode, useContext, useMemo } from 'react'
import { Text, Box, LoadingDots, Divider } from '@island.is/island-ui/core'

import {
  aidCalculator,
  calculateAidFinalAmount,
  calulatePersonalTaxAllowanceUsed,
  calulateTaxOfAmount,
  HomeCircumstances,
  Municipality,
  translateMonth,
} from '@island.is/financial-aid/shared'
import { useQuery } from '@apollo/client'
import { GetMunicipalityQuery } from '@island.is/financial-aid-web/oskgraphql'

import format from 'date-fns/format'

interface MunicipalityData {
  municipality: Municipality
}

interface Props {
  aboutText: ReactNode
  homeCircumstances?: HomeCircumstances
  usePersonalTaxCredit?: boolean
  // disbursementMonth: string TODO
}

const Estimation = ({
  aboutText,
  homeCircumstances,
  usePersonalTaxCredit,
}: Props) => {
  const currentYear = format(new Date(), 'yyyy')
  const currentMonth = parseInt(format(new Date(), 'MM')) + 1

  const { data, error, loading } = useQuery<MunicipalityData>(
    GetMunicipalityQuery,
    {
      variables: { input: { id: 'hfj' } },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const aidAmount = useMemo(() => {
    if (data && homeCircumstances) {
      return aidCalculator(homeCircumstances, data?.municipality.settings.aid)
    }
  }, [data])

  const calculations = [
    {
      title: 'Grunnupphæð',
      calculation: `${aidAmount?.toLocaleString('de-DE')} kr.`,
    },
    {
      title: 'Skattur',
      calculation: `- 
      ${
        aidAmount &&
        calulateTaxOfAmount(aidAmount, currentYear).toLocaleString('de-DE')
      } kr.`,
    },
    {
      title: 'Persónuafsláttur',
      calculation: `+  
      ${
        aidAmount &&
        calulatePersonalTaxAllowanceUsed(
          aidAmount,
          Boolean(usePersonalTaxCredit),
          currentYear,
        ).toLocaleString('de-DE')
      } kr.`,
    },
    {
      title: 'Áætluð aðstoð (hámark)',
      calculation: `    ${
        aidAmount !== undefined
          ? calculateAidFinalAmount(
              aidAmount,
              Boolean(usePersonalTaxCredit),
              currentYear,
            ).toLocaleString('de-DE') + ' kr.'
          : 'Abbabb.. mistókst að reikna'
      }`,
    },
  ]

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap" marginBottom={1}>
        <Box marginRight={1}>
          <Text as="h2" variant="h3" marginBottom={1}>
            Áætluð aðstoð
          </Text>
        </Box>

        <Text variant="small">
          (til útgreiðslu í byrjun {translateMonth(currentMonth).toLowerCase()})
        </Text>
      </Box>

      {aboutText}

      {data && (
        <>
          {calculations.map((item, index) => {
            return (
              <>
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
              </>
            )
          })}

          <Divider />

          {loading && (
            <Box
              marginBottom={[4, 4, 5]}
              display="flex"
              justifyContent="center"
            >
              <LoadingDots large />
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default Estimation
