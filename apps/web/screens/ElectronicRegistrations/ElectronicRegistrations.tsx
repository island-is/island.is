import {
  Query,
  QueryGetBrokenDownElectronicRegistrationStatisticsArgs,
} from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY } from '../queries/ElectronicRegistrations'
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Box, GridContainer, Text } from '@island.is/island-ui/core'

interface ElectronicRegistrationsProps {
  data: Query['getBrokenDownElectronicRegistrationStatistics']
}

export const ElectronicRegistrations: Screen<ElectronicRegistrationsProps> = ({
  data,
}) => {
  return (
    <GridContainer>
      <Box>
        <Text variant="h1">Rafrænar þinglýsingar 2022</Text>
        <LineChart
          margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
          width={600}
          height={300}
          data={data.map((item) => ({
            name: item.periodIntervalName.slice(0, 3),
            value: item.totalElectronicRegistrationsForCurrentPeriodInterval,
          }))}
        >
          <Line type="monotone" dataKey="value" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </Box>
    </GridContainer>
  )
}

ElectronicRegistrations.getInitialProps = async ({ apolloClient }) => {
  const [{ data }] = await Promise.all([
    apolloClient.query<
      Query,
      QueryGetBrokenDownElectronicRegistrationStatisticsArgs
    >({
      query: GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY,
      variables: {
        input: {
          dateFrom: new Date(2022, 0, 1),
          dateTo: new Date(),
        },
      },
    }),
  ])

  return { data: data.getBrokenDownElectronicRegistrationStatistics }
}

export default withMainLayout(ElectronicRegistrations)
