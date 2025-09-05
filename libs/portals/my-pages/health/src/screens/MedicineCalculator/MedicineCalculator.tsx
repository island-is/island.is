import {
  RightsPortalDrug,
  RightsPortalDrugCalculatorResponse,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  FilterInput,
  Hidden,
  LoadingDots,
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { amountFormat, EmptyTable, m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect, useRef, useState } from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import {
  CONTENT_GAP,
  CONTENT_GAP_LG,
  CONTENT_GAP_SM,
  SECTION_GAP,
} from '../../utils/constants'
import { exportDrugListFile } from '../../utils/FileBreakdown/filesStructure'
import { RightsPortalCalculatorSelectedDrug } from '../../utils/types'
import * as styles from '../Medicine/Medicine.css'
import {
  useGetDrugCalculationMutation,
  useGetDrugsQuery,
} from '../Medicine/Medicine.generated'
import { MedicinePaymentParticipationWrapper } from '../Medicine/wrapper/MedicinePaymentParticipationWrapper'
import { DrugRow } from './components/DrugRow/DrugRow'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 8

export const MedicineCalulator = () => {
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER)
  const [hoveredDrug, setHoveredDrug] = useState(-1)
  const [selectedDrugList, setSelectedDrugList] = useState<
    RightsPortalCalculatorSelectedDrug[]
  >([])
  const ref = useRef<HTMLDivElement>(null)

  useDebounce(
    () => {
      setDebouncedSearch(search)
      setPageNumber(DEFAULT_PAGE_NUMBER)
    },
    500,
    [search],
  )

  const {
    data: drugs,
    loading: drugsLoading,
    error,
  } = useGetDrugsQuery({
    variables: {
      input: {
        pageNumber: pageNumber - 1,
        nameStartsWith: debouncedSearch,
        limit: DEFAULT_PAGE_SIZE,
      },
    },
  })

  const [drugCalcQuery] = useGetDrugCalculationMutation()

  const [calculatorResults, setCalculatorResults] =
    useState<RightsPortalDrugCalculatorResponse | null>(null)

  const SHOW_TABLE = !!(
    debouncedSearch.length > 0 && drugs?.rightsPortalDrugs.data.length
  )

  const CALCULATOR_DISABLED = selectedDrugList.length === 0

  const handleCalculate = () => {
    if (selectedDrugList.length === 0) {
      setCalculatorResults(null)
      return
    }
    const input = {
      drugCalculatorRequestDTO: {
        drugs: selectedDrugList.map((d) => ({
          lineNumber: d.lineNumber,
          nordicCode: d.nordicCode,
          price: d.price,
          units: d.units,
        })),
      },
    }
    if (input.drugCalculatorRequestDTO.drugs.length) {
      drugCalcQuery({
        variables: {
          input: input,
        },
        onCompleted: (data) => {
          setCalculatorResults(data.rightsPortalDrugsCalculator)
        },
      })
    }
  }

  useEffect(() => {
    handleCalculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDrugList])

  const { width } = useWindowSize()

  const isMobile = width < 992

  const handleAddDrug = (drug: RightsPortalDrug) => {
    executeScroll()
    setSelectedDrugList((list) => {
      return [
        ...list,
        {
          lineNumber: list.length + 1,
          nordicCode: drug.nordicCode,
          price: drug.price,
          units: 1,
          name: drug.name,
          strength: drug.strength,
        },
      ]
    })
  }

  const executeScroll = () => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const totalPaginatedPages = SHOW_TABLE
    ? Math.ceil(
        (drugs?.rightsPortalDrugs?.totalCount ?? DEFAULT_PAGE_SIZE) /
          DEFAULT_PAGE_SIZE,
      )
    : 0

  return (
    <MedicinePaymentParticipationWrapper
      pathname={HealthPaths.HealthMedicineCalculator}
    >
      <Box marginBottom={SECTION_GAP}>
        <Text variant="h5" marginBottom={CONTENT_GAP_SM}>
          {formatMessage(messages.medicineCalculatorIntroTitle)}
        </Text>
        <Text>{formatMessage(messages.medicineCalculatorIntroText)}</Text>
      </Box>

      {error && !drugsLoading && (
        <Box marginBottom={SECTION_GAP}>
          <Problem error={error} noBorder={false} />
        </Box>
      )}
      {!error && (
        <Box>
          <Hidden print={true}>
            <Box
              display="flex"
              flexDirection="column"
              rowGap={CONTENT_GAP_SM}
              alignItems="flexStart"
              marginBottom={CONTENT_GAP_LG}
            >
              <Text color="blue400" variant="eyebrow">
                {formatMessage(messages.medicineFindDrug)}
              </Text>
              <Box
                display="flex"
                alignItems="center"
                width="full"
                columnGap={CONTENT_GAP}
              >
                <Box width={isMobile ? 'full' : 'half'}>
                  <FilterInput
                    name="drugs"
                    backgroundColor="blue"
                    placeholder={formatMessage(messages.medicineSearchForDrug)}
                    onChange={(value) => setSearch(value)}
                    value={search}
                  />
                </Box>
                {drugsLoading && <LoadingDots />}
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              rowGap={CONTENT_GAP}
              marginBottom={SECTION_GAP}
              ref={ref}
            >
              <T.Table>
                <T.Head>
                  <tr className={styles.tableRowStyles}>
                    <T.HeadData>
                      {formatMessage(messages.medicineDrugName)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(messages.medicineForm)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(messages.medicineStrength)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(messages.medicinePackaging)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(messages.medicinePrice)}
                    </T.HeadData>
                    <T.HeadData></T.HeadData>
                  </tr>
                </T.Head>
                {SHOW_TABLE && (
                  <T.Body>
                    {drugs?.rightsPortalDrugs.data?.map((drug, i) => {
                      const disableButton =
                        !drug?.name ||
                        !drug?.price ||
                        selectedDrugList.find(
                          (d) => d.nordicCode === drug.nordicCode,
                        ) !== undefined

                      return (
                        <tr
                          onMouseLeave={() => setHoveredDrug(-1)}
                          onMouseOver={() => setHoveredDrug(i)}
                          key={i}
                        >
                          <T.Data text={{ variant: 'medium' }}>
                            {drug.name}
                          </T.Data>
                          <T.Data text={{ variant: 'medium' }}>
                            {drug.form}
                          </T.Data>
                          <T.Data text={{ variant: 'medium' }}>
                            {drug.strength}
                          </T.Data>
                          <T.Data text={{ variant: 'medium' }}>
                            {drug.packaging}
                          </T.Data>
                          <T.Data text={{ variant: 'medium' }}>
                            {amountFormat(drug.price ?? 0)}
                          </T.Data>
                          <T.Data text={{ variant: 'medium' }}>
                            <Box
                              className={styles.saveButtonWrapperStyle({
                                visible: hoveredDrug === i || isMobile,
                              })}
                            >
                              <Button
                                size="small"
                                variant="text"
                                icon="add"
                                disabled={disableButton}
                                aria-label={
                                  disableButton
                                    ? undefined
                                    : formatMessage(
                                        messages.medicineCalculatorAddToPurchaseLabel,
                                        {
                                          arg: drug.name,
                                        },
                                      )
                                }
                                onClick={() => handleAddDrug(drug)}
                              >
                                {formatMessage(messages.medicineSelect)}
                              </Button>
                            </Box>
                          </T.Data>
                        </tr>
                      )
                    })}
                  </T.Body>
                )}
              </T.Table>
              {!SHOW_TABLE && (
                <EmptyTable message={messages.medicineCalculatorEmptySearch} />
              )}
              {SHOW_TABLE && totalPaginatedPages > 1 && (
                <Pagination
                  totalPages={totalPaginatedPages}
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
              )}
            </Box>
          </Hidden>
          <Box marginBottom={SECTION_GAP}>
            <Box
              marginBottom={CONTENT_GAP_LG}
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              flexWrap="wrap"
            >
              <Text variant="h5">
                {formatMessage(messages.medicineResults)}
              </Text>
            </Box>
            {selectedDrugList.length && calculatorResults ? (
              <Box
                display="flex"
                flexDirection={'row'}
                paddingRight={2}
                marginBottom={CONTENT_GAP_LG}
                justifyContent="flexStart"
                alignItems="flexStart"
              >
                <Button
                  colorScheme="default"
                  icon="print"
                  iconType="filled"
                  onClick={() => window.print()}
                  preTextIconType="filled"
                  type="button"
                  variant="utility"
                >
                  {formatMessage(m.print)}
                </Button>
                <Box marginRight={CONTENT_GAP} />
                <Button
                  colorScheme="default"
                  icon="download"
                  iconType="filled"
                  onClick={() =>
                    exportDrugListFile(
                      selectedDrugList ?? [],
                      'xlsx',
                      calculatorResults,
                    )
                  }
                  preTextIconType="filled"
                  type="button"
                  variant="utility"
                >
                  {formatMessage(m.getAsExcel)}
                </Button>
              </Box>
            ) : null}
            <Box className={CALCULATOR_DISABLED ? styles.disabledTable : ''}>
              <T.Table>
                <T.Head>
                  <tr className={styles.tableRowStyles}>
                    <T.HeadData text={{ variant: 'h5' }}>
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
                  </tr>
                </T.Head>
                <T.Body>
                  {selectedDrugList.map((d, i) => {
                    return (
                      <tr key={i}>
                        <DrugRow
                          drug={{
                            ...d,
                            totalPrice: d.lineNumber
                              ? calculatorResults?.drugs?.at(d.lineNumber - 1)
                                  ?.fullPrice
                              : undefined,
                            totalPaidIndividual: d.lineNumber
                              ? calculatorResults?.drugs?.at(d.lineNumber - 1)
                                  ?.customerPrice
                              : undefined,
                          }}
                          handleQuantityChange={(val) =>
                            setSelectedDrugList((list) =>
                              list.map((drug) => {
                                if (drug.nordicCode === d.nordicCode) {
                                  return {
                                    ...drug,
                                    units: val,
                                  }
                                }
                                return drug
                              }),
                            )
                          }
                          handleRemove={() => {
                            setSelectedDrugList((list) =>
                              list
                                .filter(
                                  (drug) => drug.nordicCode !== d.nordicCode,
                                )
                                .map((drug, i) => ({
                                  ...drug,
                                  lineNumber: i + 1,
                                })),
                            )
                          }}
                        />
                      </tr>
                    )
                  })}
                </T.Body>
                <T.Foot>
                  {calculatorResults && !!selectedDrugList.length && (
                    <tr className={styles.tableRowStyles}>
                      <T.Data text={{ variant: 'medium' }}>
                        {formatMessage(m.total)}
                      </T.Data>
                      <T.Data text={{ variant: 'medium' }}></T.Data>
                      <T.Data text={{ variant: 'medium' }}></T.Data>
                      <T.Data text={{ variant: 'medium' }}>
                        {amountFormat(calculatorResults.totalPrice ?? 0)}
                      </T.Data>
                      <T.Data text={{ variant: 'medium' }}>
                        {amountFormat(
                          calculatorResults.totalCustomerPrice ?? 0,
                        )}
                      </T.Data>
                      <T.Data text={{ variant: 'medium' }}></T.Data>
                    </tr>
                  )}
                </T.Foot>
              </T.Table>
            </Box>
            {CALCULATOR_DISABLED && (
              <EmptyTable message={messages.medicineCalculatorNoDrugSelected} />
            )}
          </Box>
        </Box>
      )}
      <Box>
        <Text variant="small">
          {formatMessage(messages.medicineCalculatorFooter)}
        </Text>
      </Box>
    </MedicinePaymentParticipationWrapper>
  )
}

export default MedicineCalulator
