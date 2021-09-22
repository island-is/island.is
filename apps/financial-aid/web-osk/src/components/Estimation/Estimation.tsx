import React, { ReactNode, useMemo } from 'react'
import { Text, Box, LoadingDots, Divider } from '@island.is/island-ui/core'

import {
  aidCalculator,
  calculateAidFinalAmount,
  calulatePersonalTaxAllowanceUsed,
  calulateTaxOfAmount,
  HomeCircumstances,
  Municipality,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'
import { useQuery } from '@apollo/client'
import { GetMunicipalityQuery } from '@island.is/financial-aid-web/osk/graphql'

import format from 'date-fns/format'

interface MunicipalityData {
  municipality: Municipality
}

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

  const { data, loading } = useQuery<MunicipalityData>(GetMunicipalityQuery, {
    variables: { input: { id: 'hfj' } },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const aidAmount = useMemo(() => {
    if (data && homeCircumstances) {
      return aidCalculator(homeCircumstances, data?.municipality.aid)
    }
  }, [data])

  const calculations = aidAmount
    ? [
        {
          title: 'Grunnupphæð',
          calculation: `${aidAmount?.toLocaleString('de-DE')} kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 
      ${calulateTaxOfAmount(aidAmount, currentYear).toLocaleString(
        'de-DE',
      )} kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `+  
      ${calulatePersonalTaxAllowanceUsed(
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

      {data && (
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
