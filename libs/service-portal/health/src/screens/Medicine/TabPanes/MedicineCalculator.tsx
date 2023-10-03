import {
  Text,
  Box,
  Pagination,
  Table as T,
  SkeletonLoader,
  FilterInput,
  Button,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import { CONTENT_GAP_LG, SECTION_GAP } from '../constants'
import { IntroHeader, m } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useDebounce } from 'react-use'
import { useGetDrugsQuery } from '../Medicine.generated'
import { RightsPortalDrugs } from '@island.is/api/schema'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 8

export const MedicineCalulator = () => {
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER)

  const [hoveredDrug, setHoveredDrug] = useState(-1)
  const [selectedDrugList, setSelectedDrugList] = useState<RightsPortalDrugs[]>(
    [],
  )

  const SHOW_TABLE = debouncedSearch.length > 0
  const CALCULATOR_DISABLED = selectedDrugList.length === 0
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
      <Box
        display="flex"
        flexDirection="column"
        rowGap={2}
        marginBottom={SECTION_GAP}
      >
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
              <T.HeadData></T.HeadData>
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
                drugs?.rightsPortalDrugs.drugs?.map((d, i) => {
                  return (
                    <tr
                      onMouseLeave={() => setHoveredDrug(-1)}
                      onMouseOver={() => setHoveredDrug(i)}
                      key={i}
                    >
                      <T.Data>{d.name}</T.Data>
                      <T.Data>{d.form}</T.Data>
                      <T.Data>{d.strength}</T.Data>
                      <T.Data>{d.packaging}</T.Data>
                      <T.Data>{d.price}</T.Data>
                      <T.Data>
                        {hoveredDrug === i && (
                          <Button
                            size="small"
                            variant="text"
                            icon="pencil"
                            onClick={() => {
                              setSelectedDrugList(
                                [...selectedDrugList, d].filter(
                                  (drug, index, self) =>
                                    index ===
                                    self.findIndex(
                                      (d) => d.nordicCode === drug.nordicCode,
                                    ),
                                ),
                              )
                            }}
                          >
                            {formatMessage(messages.medicineSelect)}
                          </Button>
                        )}
                      </T.Data>
                    </tr>
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
                  return setPageNumber(page)
                }}
              >
                {children}
              </button>
            )}
          />
        ) : null}
      </Box>
      <Box marginBottom={SECTION_GAP}>
        <Text marginBottom={CONTENT_GAP_LG} variant="h5">
          {formatMessage(messages.medicineResults)}
        </Text>
        <Box
          marginBottom={CONTENT_GAP_LG}
          display="flex"
          justifyContent="spaceBetween"
          flexWrap="wrap"
        >
          <Box display="flex" columnGap={CONTENT_GAP_LG}>
            <Button
              variant="utility"
              icon="print"
              size="small"
              onClick={() => {}} /* TODO: Add missing functionality */
              disabled={CALCULATOR_DISABLED}
            >
              Prenta
            </Button>
            <Button
              variant="utility"
              icon="download"
              size="small"
              onClick={() => {}} /* TODO: Add missing functionality */
              disabled={CALCULATOR_DISABLED}
            >
              Sækja
            </Button>
          </Box>
          <Button
            size="medium"
            variant="primary"
            disabled={CALCULATOR_DISABLED}
          >
            Reikna
          </Button>
        </Box>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(messages.medicineDrugName)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(messages.medicineStrength)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(messages.medicineQuantity)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(messages.medicinePriceTotal)}
              </T.HeadData>
              <T.HeadData>
                {formatMessage(messages.medicinePaidByCustomer)}
              </T.HeadData>
              <T.HeadData></T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {selectedDrugList.map((d, i) => {
              return (
                <tr key={i}>
                  <T.Data>{d.name}</T.Data>
                  <T.Data>{d.strength}</T.Data>
                  <T.Data>1</T.Data> {/* TODO: Add missing functionality */}
                  <T.Data>{d.price}</T.Data>{' '}
                  {/* TODO: Add multiplication with quantity */}
                  <T.Data>Vantar gögn</T.Data> {/* TODO: Add missing dat */}
                  <T.Data>
                    <button
                      onClick={() =>
                        setSelectedDrugList((list) =>
                          list.filter(
                            (drug) => drug.nordicCode !== d.nordicCode,
                          ),
                        )
                      }
                    >
                      <Icon
                        icon="trash"
                        color="blue400"
                        type="outline"
                        size="small"
                      />
                    </button>
                  </T.Data>
                </tr>
              )
            })}
          </T.Body>
        </T.Table>
      </Box>
      <Box>
        <Text variant="small">
          {formatMessage(messages.medicineCalculatorFooter)}
        </Text>
      </Box>
    </Box>
  )
}
