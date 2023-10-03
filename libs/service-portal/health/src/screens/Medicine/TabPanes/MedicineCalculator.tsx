import {
  Text,
  Box,
  Pagination,
  Table as T,
  SkeletonLoader,
  FilterInput,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import { SECTION_GAP } from '../constants'
import { IntroHeader, m } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useDebounce } from 'react-use'
import { useGetDrugsQuery } from '../Medicine.generated'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 8

export const MedicineCalulator = () => {
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER)

  const SHOW_TABLE = debouncedSearch.length > 0

  useDebounce(
    () => {
      setDebouncedSearch(search)
      setPageNumber(DEFAULT_PAGE_NUMBER)
    },
    500,
    [search],
  )

  const { data: drugs, loading: drugsLoading } = useGetDrugsQuery({
    variables: {
      input: {
        pageNumber: pageNumber - 1,
        nameStartsWith: debouncedSearch,
        limit: DEFAULT_PAGE_SIZE,
      },
    },
  })

  return (
    <Box paddingY={4}>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          isSubheading
          title={formatMessage(messages.medicineCalculatorIntroTitle)}
          intro={formatMessage(messages.medicineCalculatorIntroText)}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        rowGap={1}
        alignItems="flexStart"
        marginBottom={SECTION_GAP}
      >
        <Text color="blue400" variant="eyebrow">
          {formatMessage(messages.medicineFindDrug)}
        </Text>
        <FilterInput
          name="drugs"
          placeholder={formatMessage(messages.medicineSearchForDrug)}
          onChange={(value) => setSearch(value)}
          value={search}
        />
      </Box>
      <Box display="flex" flexDirection="column" rowGap={2}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(messages.medicineDrugName)}
              </T.HeadData>
              <T.HeadData>{formatMessage(messages.medicineForm)}</T.HeadData>
              <T.HeadData>
                {formatMessage(messages.medicineStrength)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(messages.medicinePackaging)}
              </T.HeadData>
              <T.HeadData>{formatMessage(messages.medicinePrice)}</T.HeadData>
            </T.Row>
          </T.Head>
          {SHOW_TABLE && (
            <T.Body>
              {drugsLoading ? (
                <T.Row>
                  <T.Data>
                    <SkeletonLoader
                      repeat={2}
                      height={16}
                      borderRadius="standard"
                      width="100%"
                      space={1}
                    />
                  </T.Data>
                  <T.Data>
                    <SkeletonLoader
                      repeat={2}
                      height={16}
                      borderRadius="standard"
                      width="100%"
                      space={1}
                    />
                  </T.Data>
                  <T.Data>
                    <SkeletonLoader
                      repeat={2}
                      height={16}
                      borderRadius="standard"
                      width="100%"
                      space={1}
                    />
                  </T.Data>
                  <T.Data>
                    <SkeletonLoader
                      repeat={2}
                      height={16}
                      borderRadius="standard"
                      width="100%"
                      space={1}
                    />
                  </T.Data>
                  <T.Data>
                    <SkeletonLoader
                      repeat={2}
                      height={16}
                      borderRadius="standard"
                      width="100%"
                      space={1}
                    />
                  </T.Data>
                </T.Row>
              ) : (
                drugs?.rightsPortalDrugs.drugs?.map((d) => {
                  return (
                    <T.Row>
                      <T.Data>{d.name}</T.Data>
                      <T.Data>{d.form}</T.Data>
                      <T.Data>{d.strength}</T.Data>
                      <T.Data>{d.packaging}</T.Data>
                      <T.Data>{d.price}</T.Data>
                    </T.Row>
                  )
                })
              )}
            </T.Body>
          )}
        </T.Table>

        {drugsLoading ? (
          <SkeletonLoader
            repeat={1}
            space={1}
            height={32}
            borderRadius="standard"
          />
        ) : SHOW_TABLE ? (
          <Pagination
            totalPages={Math.ceil(
              (drugs?.rightsPortalDrugs?.totalCount ?? DEFAULT_PAGE_SIZE) /
                DEFAULT_PAGE_SIZE,
            )}
            page={pageNumber}
            renderLink={(page, className, children) => (
              <button
                className={className}
                onClick={() => {
                  console.log(page)
                  return setPageNumber(page)
                }}
              >
                {children}
              </button>
            )}
          />
        ) : null}
      </Box>
    </Box>
  )
}
