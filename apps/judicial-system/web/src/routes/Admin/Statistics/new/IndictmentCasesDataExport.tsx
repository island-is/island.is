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

  const { data } = useGetPreprocessedDataUrlQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'cache-and-network',
  })

  return (
    <StatisticPageLayout>
      <PageHeader title="Gögn úr ákærum'" />
      <Box>
        <StatisticReturnButton />
        <StatisticHeader title="Gögn úr ákærum" />
        <Box marginBottom={4}>
          <Text marginBottom={2}>
            Hér er hægt að sækja gögn fyrir atburði (e. event data) í
            Réttarvörslugátt.
          </Text>
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

export default IndictmentCasesDataExport
