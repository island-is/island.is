import { Box, LoadingDots, Stack, Text, Tiles } from '@island.is/island-ui/core'
import { Card, EmptyState, Pagination } from '../../../../components'
import { Case, CaseFilter } from '../../../../types/interfaces'
import { MapCaseStatuses } from '../../../../types/enums'
import localization from '../../Home.json'
import {
  CARDS_PER_PAGE,
  FILTERS_FRONT_PAGE_KEY,
} from '../../../../utils/consts/consts'

interface CardsProps {
  getCasesLoading?: boolean
  cases: Case[]
  total: number
  filters: CaseFilter
  setFilters(arr: CaseFilter): void
}

const Cards = ({
  cases = [],
  getCasesLoading = false,
  total,
  filters,
  setFilters,
}: CardsProps) => {
  const loc = localization['card']

  if (getCasesLoading) {
    return (
      <Box
        display="flex"
        width="full"
        alignItems="center"
        justifyContent="center"
        style={{ height: 200 }}
      >
        <LoadingDots size="large" />
      </Box>
    )
  }

  if (!getCasesLoading && cases?.length === 0) {
    return <EmptyState isCase />
  }

  return (
    <>
      {cases && (
        <Tiles space={3} columns={[1, 1, 1, 2, 3]}>
          {cases.map((item: Case, index: number) => {
            const card = {
              id: item.id,
              title: item.name,
              tag: MapCaseStatuses[item.statusName],
              published: item.publishOnWeb,
              processEnds: item.processEnds,
              processBegins: item.processBegins,
              eyebrows: [item.typeName, item.institutionName],
              caseNumber: item.caseNumber,
            }
            return (
              <Card
                key={item.id ? item.id : index}
                card={card}
                frontPage
                showPublished
              >
                <Stack space={2}>
                  <Text variant="eyebrow" color="purple400">
                    {`${loc.eyebrowText}: ${item.adviceCount}`}
                  </Text>
                  <Box
                    style={{
                      wordBreak: 'break-word',
                      height: '105px',
                    }}
                    overflow="hidden"
                  >
                    <Text variant="small" color="dark400">
                      {item.shortDescription}
                    </Text>
                  </Box>
                </Stack>
              </Card>
            )
          })}
        </Tiles>
      )}
      <Pagination
        filters={filters}
        setFilters={(arr: CaseFilter) => setFilters(arr)}
        totalPages={Math.ceil(total / CARDS_PER_PAGE)}
        localStorageId={FILTERS_FRONT_PAGE_KEY}
      />
    </>
  )
}

export default Cards
