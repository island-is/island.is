import { m } from '../../lib/messages'
import { Box, Breadcrumbs, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ApplicationSystemPaths } from '../../lib/paths'
import { ApplicationFilters, MultiChoiceFilter } from '../../types/filters'
import { StatisticsForm } from '../../components/StatisticsForm/StatisticsForm'
import {
  useGetApplicationsQuery,
  useGetInstitutionApplicationsQuery,
  useGetOrganizationsQuery,
} from '../../queries/overview.generated'
import { on } from 'events'

const Statistics = () => {
  const { formatMessage } = useLocale()

  const onReceiveData = () => {
    // Todo: Recive the data and feed it to the next component
    // console.log('Data received')
  }

  const onDateChange = (period: ApplicationFilters['period']) => {
    console.log('Date changed', period)
  }

  // const { data, loading } = useGetApplicationsQuery({
  //   ssr: false,
  //   variables: { input: { nationalId: '0101302399' } },
  //   onCompleted: (q) => {
  //     console.log('Data received', q)
  //   },
  // })

  const { data, loading } = useGetOrganizationsQuery({
    ssr: false,
    variables: {},
    onCompleted: (q) => {
      console.log('Data received', q)
    },
  })

  return (
    <Box>
      <Breadcrumbs
        items={[
          { title: 'Ísland.is', href: '/stjornbord' },
          {
            title: formatMessage(m.applicationSystem),
            href: `/stjornbord${ApplicationSystemPaths.Root}`,
          },
          { title: formatMessage(m.statistics) },
        ]}
      />
      <Text variant="h3" as="h1" marginBottom={[3, 3, 6]} marginTop={3}>
        {formatMessage(m.statistics)}
      </Text>
      <StatisticsForm
        onReceiveData={onReceiveData}
        onDateChange={onDateChange}
      />
    </Box>
  )
}

export default Statistics
