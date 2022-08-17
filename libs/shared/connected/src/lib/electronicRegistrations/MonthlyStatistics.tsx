import { gql, useQuery } from '@apollo/client'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  Bar,
  BarChart,
  Legend,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'

interface MonthlyStatisticsProps {}

export const GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY = gql`
  query GetBrokenDownElectronicRegistrationStatistics(
    $input: GetBrokenDownElectronicRegistrationStatisticsInput!
  ) {
    getBrokenDownElectronicRegistrationStatistics(input: $input) {
      periodIntervalName
      totalRegistrationForCurrentPeriodInterval
      totalPaperRegistrationsForCurrentPeriodInterval
      totalElectronicRegistrationsForCurrentPeriodInterval
      registrationTypes {
        registrationType
        totalRegistrationsOfType
        totalPaperRegistrationsOfType
        totalElectronicRegistrationsOfType
      }
    }
  }
`

export const CustomTooltip = ({
  payload,
  active,
  label,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          display: 'inline-block',
          backgroundColor: '#F2F7FF',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '240px',
          fontSize: '15px',
        }}
      >
        <p>{label}</p>
        {payload.map((item, index) => (
          <li
            key={`item-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'IBM Plex Sans',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '14px',
              lineHeight: '24px',
              flexWrap: 'nowrap',
            }}
          >
            <div
              style={{
                border: '3px solid ' + item.color,
                width: '12px',
                height: '12px',
                borderRadius: '12px',
                marginRight: '2px',
                marginLeft: '8px',
              }}
            />
            {item.name}: {item.value}
          </li>
        ))}
      </div>
    )
  }

  return null
}

export const MonthlyStatistics = ({}: MonthlyStatisticsProps) => {
  const { data, loading, error } = useQuery(
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

  if (!data?.getBrokenDownElectronicRegistrationStatistics) return null

  const paper = 'Pappír'
  const electronic = 'Rafrænt'

  return (
    <Box>
      <BarChart
        margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
        width={600}
        height={300}
        data={data.getBrokenDownElectronicRegistrationStatistics.map(
          (item) => ({
            name: item.periodIntervalName,
            [paper]: item.totalPaperRegistrationsForCurrentPeriodInterval,
            [electronic]:
              item.totalElectronicRegistrationsForCurrentPeriodInterval,
          }),
        )}
      >
        <Bar dataKey={paper} fill="#66a5da" />
        <Bar dataKey={electronic} fill="#ef8838" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" verticalAlign="top" />
      </BarChart>
    </Box>
  )
}

export default MonthlyStatistics
