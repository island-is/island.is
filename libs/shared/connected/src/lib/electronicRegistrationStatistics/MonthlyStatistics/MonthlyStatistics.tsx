import { useQuery } from '@apollo/client'
import { BrokenDownRegistrationStatistic } from '@island.is/api/domains/electronic-registration-statistics'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
} from '@island.is/island-ui/core'
import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY } from '../queries'
import { CustomTooltip } from './CustomTooltip'
import { extractRegistrationTypesFromData } from './utils'
import { CustomLegend } from './CustomLegend'

import * as styles from './MonthlyStatistics.css'

type QueryType = {
  getBrokenDownElectronicRegistrationStatistics: BrokenDownRegistrationStatistic[]
}

export const MonthlyStatistics = () => {
  const [
    selectedRegistrationTypeOption,
    setSelectedRegistrationTypeOption,
  ] = useState({ label: 'Allt', value: 'Allt' })

  const currentYear = new Date().getFullYear()

  const [selectedYear, setSelectedYear] = useState({
    label: String(currentYear),
    value: String(currentYear),
  })

  const { data: serverData, loading, error } = useQuery<QueryType>(
    GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY,
    {
      variables: {
        input: {
          dateFrom: new Date(Number(selectedYear.value), 0, 1),
          dateTo: new Date(Number(selectedYear.value) + 1, 0, 1),
        },
      },
    },
  )

  const data = serverData?.getBrokenDownElectronicRegistrationStatistics

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

  const paper = 'Pappír'
  const electronic = 'Rafrænt'

  return (
    <Box>
      <GridContainer>
        <GridRow>
          <GridColumn span={'6/12'}>
            <Select
              name="statistics-select"
              options={registrationTypes}
              size="xs"
              label="Tegund þinglýsinga"
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
              label="Tímabil"
              value={selectedYear}
              onChange={(option) =>
                setSelectedYear(option as { label: string; value: string })
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>

      {data && (
        <Box marginTop={3} className={styles.barChartContainer}>
          <BarChart
            margin={{ top: 30 }}
            width={600}
            height={400}
            data={data.map((item) => ({
              name: item.periodIntervalName?.slice(0, 3),
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
        </Box>
      )}
    </Box>
  )
}
