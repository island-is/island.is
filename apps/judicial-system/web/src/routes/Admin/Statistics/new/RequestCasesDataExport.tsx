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
  const toDate = new Date()
  const fromDate = startOfYear(toDate)
  const [csvLoading, setCsvLoading] = useState<boolean>(false)
  const [filters, setFilters] = useState<RequestFilterType>({
    period: { fromDate, toDate },
  })

  const queryVariables = useMemo(() => {
    return { type: DataGroups.REQUESTS, period: filters.period }
  }, [filters])

  const { refetch: refetchPreprocessedData } = useGetPreprocessedDataUrlQuery({
    variables: {
      input: queryVariables,
    },
    fetchPolicy: 'no-cache',
    skip: true,
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
            Veldu tímabil hér að neðan fyrir gögnin sem þú vilt sækja.
          </Text>
          <Filters
            id="request"
            types={requestFilterKeys}
            filters={filters}
            setFilters={setFilters}
            onClear={() => setFilters({})}
          />
          <Box display="flex" justifyContent="flexEnd" paddingBottom={4}>
            <Button
              variant="ghost"
              size="small"
              icon="download"
              iconType="outline"
              loading={csvLoading}
              onClick={async () => {
                setCsvLoading(true)
                const res = await refetchPreprocessedData({
                  input: queryVariables,
                })
                try {
                  const url = res.data?.getPreprocessedDataCsvSignedUrl?.url
                  if (url) {
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', '')
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }
                } finally {
                  setCsvLoading(false)
                }
              }}
            >
              Sækja gögn
            </Button>
          </Box>
          <Text>
            Þú getur hlaðið gögnunum upp í sniðmát og notað tilbúnar
            tölfræðigreiningar.
          </Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={2}>
            <Button
              variant="ghost"
              size="small"
              icon="open"
              iconType="outline"
              onClick={async () => {
                window.open(
                  'https://docs.google.com/spreadsheets/d/1U4O-EtWeRRzFpD7lXPbSQxbF0XqTU_LNOCCAvdFMK-g/edit?usp=sharing',
                  '_blank',
                  'noopener,noreferrer',
                )
              }}
            >
              Sækja sniðmát
            </Button>
          </Box>
        </Box>
      </Box>
    </StatisticPageLayout>
  )
}

export default RequestCasesDataExport
