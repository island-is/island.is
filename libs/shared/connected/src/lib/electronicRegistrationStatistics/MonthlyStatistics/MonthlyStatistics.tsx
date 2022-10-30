import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { useQuery } from '@apollo/client'

import { BrokenDownRegistrationStatisticResponse } from '@island.is/api/domains/electronic-registration-statistics'
import { ConnectedComponent } from '@island.is/api/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  LoadingDots,
  Select,
} from '@island.is/island-ui/core'

import { GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY } from '../queries'
import { CustomTooltip } from './CustomTooltip'
import { extractRegistrationTypesFromData } from './utils'
import { CustomLegend } from './CustomLegend'
import { useLocalization } from '../../../utils'

import * as styles from './MonthlyStatistics.css'

type QueryType = {
  getBrokenDownElectronicRegistrationStatistics: BrokenDownRegistrationStatisticResponse
}

interface MonthlyStatisticsProps {
  slice?: ConnectedComponent
}

export const MonthlyStatistics = ({ slice }: MonthlyStatisticsProps) => {
  const [
    selectedRegistrationTypeOption,
    setSelectedRegistrationTypeOption,
  ] = useState({ label: 'Allt', value: 'Allt' })

  const n = useLocalization(slice?.json ?? {})

  const currentYear = new Date().getFullYear()

  const [selectedYear, setSelectedYear] = useState({
    label: String(currentYear),
    value: String(currentYear),
  })

  useEffect(() => {
    setSelectedRegistrationTypeOption({ label: 'Allt', value: 'Allt' })
  }, [selectedYear])

  const { data: serverData, loading } = useQuery<QueryType>(
    GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY,
    {
      variables: {
        input: {
          year: Number(selectedYear.value),
        },
      },
    },
  )

  const data =
    serverData?.getBrokenDownElectronicRegistrationStatistics
      ?.electronicRegistrationStatisticBreakdown

  const [registrationTypes, setRegistrationTypes] = useState<
    { label: string; value: string }[]
  >([])

  useEffect(() => {
    if (!data) return
    setRegistrationTypes(
      extractRegistrationTypesFromData(data).map((type) => ({
        label: type,
        value: type,
      })),
    )
  }, [data])

  const yearOptions = useMemo(() => {
    const options = []

    for (let year = 2019; year <= currentYear; year += 1) {
      options.push({
        label: String(year),
        value: String(year),
      })
    }

    return options.reverse()
  }, [])

  const paper = n('paper', 'Pappír')
  const electronic = n('electronic', 'Rafrænt')

  return (
    <Box>
      <GridContainer>
        <GridRow>
          <GridColumn span={'6/12'}>
            <Select
              name="statistics-select"
              options={registrationTypes}
              size="xs"
              label={n('typeOfRegistration', 'Tegund þinglýsinga')}
              value={selectedRegistrationTypeOption}
              onChange={(option) =>
                setSelectedRegistrationTypeOption(
                  option as { label: string; value: string },
                )
              }
            />
          </GridColumn>
          <GridColumn span={'6/12'}>
            <Select
              name="year-select"
              options={yearOptions}
              size="xs"
              label={n('timePeriod', 'Tímabil')}
              value={selectedYear}
              onChange={(option) =>
                setSelectedYear(option as { label: string; value: string })
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>

      {loading && (
        <Box marginTop={3} display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      )}

      <Box marginTop={3} className={styles.barChartContainer}>
        {data && (
          <BarChart
            margin={{ top: 30 }}
            width={800}
            height={400}
            data={data.map((item) => ({
              name: (n(
                item.periodIntervalName?.split(' ')?.[0]?.trim() ?? '',
                item.periodIntervalName,
              ) as string).slice(0, 3),
              [paper]:
                item.registrationTypes?.find(
                  (t) =>
                    t.registrationType === selectedRegistrationTypeOption.value,
                )?.totalPaperRegistrationsOfType ??
                item.totalPaperRegistrationsForCurrentPeriodInterval,
              [electronic]:
                item.registrationTypes?.find(
                  (t) =>
                    t.registrationType === selectedRegistrationTypeOption.value,
                )?.totalElectronicRegistrationsOfType ??
                item.totalElectronicRegistrationsForCurrentPeriodInterval,
            }))}
          >
            <Bar
              legendType="circle"
              barSize={16}
              radius={[20, 20, 0, 0]}
              dataKey={paper}
              fill="#66a5da"
            />
            <Bar
              barSize={16}
              radius={[20, 20, 0, 0]}
              dataKey={electronic}
              fill="#ef8838"
            />
            <XAxis dataKey="name" height={60} />
            <YAxis />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fillOpacity: 0.3 }}
            />
            <Legend iconType="circle" content={<CustomLegend />} />
          </BarChart>
        )}
      </Box>
    </Box>
  )
}
