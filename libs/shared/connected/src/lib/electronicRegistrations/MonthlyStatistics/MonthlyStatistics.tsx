import { useQuery } from '@apollo/client'
import { RegistrationOfTypeForPeriod } from '@island.is/clients/electronic-registrations'
import { Box, Select } from '@island.is/island-ui/core'
import { useMemo, useState } from 'react'
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY } from '../queries'
import { CustomTooltip } from './CustomTooltip'
import { extractRegistrationTypesFromData } from './utils'

type QueryType = {
  getBrokenDownElectronicRegistrationStatistics: RegistrationOfTypeForPeriod[]
}

export const MonthlyStatistics = () => {
  const [
    selectedRegistrationTypeOption,
    setSelectedRegistrationTypeOption,
  ] = useState({ label: 'Allt', value: 'Allt' })

  const { data: serverData, loading, error } = useQuery<QueryType>(
    GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY,
    {
      variables: {
        input: {
          dateFrom: new Date(2022, 0, 1),
          dateTo: new Date(2022, 4, 1),
        },
      },
    },
  )

  const data = serverData?.getBrokenDownElectronicRegistrationStatistics

  const options = useMemo(() => {
    if (!data) return []
    return extractRegistrationTypesFromData(data).map((type) => ({
      label: type,
      value: type,
    }))
  }, [data])

  if (!data) return null

  const paper = 'Pappír'
  const electronic = 'Rafrænt'

  return (
    <Box>
      <Select
        name="statistics-select"
        options={options}
        size="sm"
        label="Tegund"
        value={selectedRegistrationTypeOption}
        onChange={(option) =>
          setSelectedRegistrationTypeOption(
            option as { label: string; value: string },
          )
        }
      />
      <BarChart
        width={600}
        height={300}
        data={data.map((item) => ({
          name: item.periodIntervalName,
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
        <Bar dataKey={paper} fill="#66a5da" />
        <Bar dataKey={electronic} fill="#ef8838" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} cursor={{ fillOpacity: 0.3 }} />
        <Legend iconType="circle" verticalAlign="top" />
      </BarChart>
    </Box>
  )
}
