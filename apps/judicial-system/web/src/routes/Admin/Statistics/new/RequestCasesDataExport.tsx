import { useMemo, useState } from 'react'
import startOfYear from 'date-fns/startOfYear'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { DataGroups } from '@island.is/judicial-system/types'
import { PageHeader } from '@island.is/judicial-system-web/src/components'
import { DateFilter } from '@island.is/judicial-system-web/src/graphql/schema'

import { useGetPreprocessedDataUrlQuery } from '../preprocessedDataUrl.generated'
import { Filters } from './shared/StatisticFilter'
import { StatisticHeader } from './shared/StatisticHeader'
import StatisticPageLayout from './shared/StatisticPageLayout'
import { StatisticReturnButton } from './shared/StatisticReturnButton'

type RequestFilterType = {
  period?: DateFilter
}

const requestFilterKeys = ['period'] as (keyof RequestFilterType)[]

const RequestCasesDataExport = () => {
  const toDate = Date.now()
  const fromDate = startOfYear(toDate)
  const [filters, setFilters] = useState<RequestFilterType>({
    period: { fromDate, toDate },
  })

  const queryVariables = useMemo(() => {
    return { type: DataGroups.REQUESTS, period: filters.period }
  }, [filters])

  const { data } = useGetPreprocessedDataUrlQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'cache-and-network',
  })

  return (
    <StatisticPageLayout>
      <PageHeader title="Gögn úr rannsóknarmálum" />
      <Box>
        <StatisticReturnButton />
        <StatisticHeader title="Gögn úr rannsóknarmálum" />
        <Box paddingBottom={4} display="flex" flexDirection="column" rowGap={2}>
          <Text>
            Hér er hægt að sækja gögn fyrir atburði (e. event data) í
            Réttarvörslugátt.
          </Text>
          <Text>
            Þú getur hlaðið gögnunum upp{' '}
            <a color="blue400" href="https://rettarvorslugatt.island.is">
              *hér*
            </a>{' '}
            og notað tilbúnar greiningar.
          </Text>
          <Text>
            Veldu tímabil hér að neðan fyrir gögnin sem þú vilt sækja.
          </Text>
        </Box>
        <Filters
          id="request"
          types={requestFilterKeys}
          filters={filters}
          setFilters={setFilters}
          onClear={() => setFilters({})}
        />
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <a
            href={data?.getPreprocessedDataCsvSignedUrl?.url}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Button
              variant="ghost"
              size="small"
              icon="download"
              iconType="outline"
              disabled={!data}
            >
              Sækja gögn
            </Button>
          </a>
        </Box>
      </Box>
    </StatisticPageLayout>
  )
}

export default RequestCasesDataExport
