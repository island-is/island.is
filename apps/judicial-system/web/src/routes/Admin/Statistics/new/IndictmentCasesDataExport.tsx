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

type IndictmentFilterType = {
  period?: DateFilter
}

const indictmentFilterKeys = ['period'] as (keyof IndictmentFilterType)[]

const IndictmentCasesDataExport = () => {
  const toDate = Date.now()
  const fromDate = startOfYear(toDate)
  const [filters, setFilters] = useState<IndictmentFilterType>({
    period: { fromDate, toDate },
  })

  const queryVariables = useMemo(() => {
    return { type: DataGroups.INDICTMENTS, period: filters.period }
  }, [filters])

  const { loading: csvLoading, refetch: refetchPreprocessedData } =
    useGetPreprocessedDataUrlQuery({
      variables: {
        input: queryVariables,
      },
      fetchPolicy: 'no-cache',
      skip: true,
    })

  return (
    <StatisticPageLayout>
      <PageHeader title="Gögn úr sakamálum'" />
      <Box>
        <StatisticReturnButton />
        <StatisticHeader title="Gögn úr sakamálum" />
        <Box paddingBottom={4} display="flex" flexDirection="column" rowGap={2}>
          <Text>
            Hér er hægt að sækja gögn fyrir atburði (e. event data) í
            Réttarvörslugátt.
          </Text>
          <Text>
            Þú getur hlaðið gögnunum upp í sniðmát og notað tilbúnar
            tölfræðigreiningar.
          </Text>
          <Box
            display="flex"
            justifyContent="flexEnd"
            marginTop={2}
            marginBottom={2}
          >
            <Button
              variant="ghost"
              size="small"
              icon="open"
              iconType="outline"
              onClick={async () => {
                window.open('', '_blank', 'noopener,noreferrer')
              }}
            >
              Sækja sniðmát
            </Button>
          </Box>
          <Text>
            Veldu tímabil hér að neðan fyrir gögnin sem þú vilt sækja.
          </Text>
        </Box>
        <Filters
          id="indictment"
          types={indictmentFilterKeys}
          filters={filters}
          setFilters={setFilters}
          onClear={() => setFilters({})}
        />
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button
            variant="ghost"
            size="small"
            icon="download"
            iconType="outline"
            loading={csvLoading}
            onClick={async () => {
              const res = await refetchPreprocessedData({
                input: queryVariables,
              })
              const url = res.data?.getPreprocessedDataCsvSignedUrl?.url
              if (url) {
                window.open(url, '_blank', 'noopener,noreferrer')
              }
            }}
          >
            Sækja gögn
          </Button>
        </Box>
      </Box>
    </StatisticPageLayout>
  )
}

export default IndictmentCasesDataExport
