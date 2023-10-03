import {
  Text,
  Box,
  Input,
  Pagination,
  Table as T,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import { SECTION_GAP } from '../constants'
import { IntroHeader, m } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useDebounce } from 'react-use'
import { useGetDrugsQuery } from '../Medicine.generated'

const DEFAULT_PAGE_NUMBER = 0
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
    },
    500,
    [search],
  )

  const { data: drugs, loading: drugsLoading } = useGetDrugsQuery({
    variables: {
      input: {
        pageNumber: pageNumber,
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
        <Input
          name="drugs"
          placeholder={formatMessage(messages.medicineSearchForDrug)}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          loading={drugsLoading}
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
                  console.log(d)
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

        {SHOW_TABLE && (
          <Pagination
            totalPages={Math.ceil(
              drugs?.rightsPortalDrugs?.totalCount ?? DEFAULT_PAGE_SIZE,
            )}
            page={pageNumber}
            renderLink={(page, className, children) => (
              <button className={className} onClick={() => setPageNumber(page)}>
                {children}
              </button>
            )}
          />
        )}
      </Box>
    </Box>
  )
}
