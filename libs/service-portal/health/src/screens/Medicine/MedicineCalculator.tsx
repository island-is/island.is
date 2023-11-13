import {
  Text,
  Box,
  Pagination,
  Table as T,
  FilterInput,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { CONTENT_GAP_LG, SECTION_GAP } from './constants'
import { IntroHeader, m } from '@island.is/service-portal/core'
import { useEffect, useState } from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import {
  useGetDrugCalculationMutation,
  useGetDrugsQuery,
} from './Medicine.generated'
import {
  RightsPortalCalculatorRequestInput,
  RightsPortalDrug,
  RightsPortalDrugCalculatorResponse,
} from '@island.is/api/schema'
import * as styles from './Medicine.css'
import { EmptyTable } from './components/EmptyTable/EmptyTable'
import { DrugRow } from './components/DrugRow/DrugRow'
import { useIntl } from 'react-intl'
import { MedicineWrapper } from './components/MedicineWrapper/MedicineWrapper'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 8

export const MedicineCalulator = () => {
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [hoveredDrug, setHoveredDrug] = useState(-1)
  const [selectedDrugList, setSelectedDrugList] = useState<
    RightsPortalCalculatorRequestInput[]
  >([])

  const intl = useIntl()

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

  const [drugCalcQuery] = useGetDrugCalculationMutation()

  const [calculatorResults, setCalculatorResults] =
    useState<RightsPortalDrugCalculatorResponse | null>(null)

  const SHOW_TABLE = !!(
    debouncedSearch.length > 0 && drugs?.rightsPortalDrugs.data.length
  )

  const CALCULATOR_DISABLED = selectedDrugList.length === 0

  const handleCalculate = () => {
    if (!hasCalculated) setHasCalculated(true)
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
    if (selectedDrugList.length === 0) setCalculatorResults(null)
    if (hasCalculated) {
      handleCalculate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDrugList])

  const { width } = useWindowSize()

  const isMobile = width < 992

  const handleAddDrug = (drug: RightsPortalDrug) => {
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

  return (
    <MedicineWrapper>
      <Box marginBottom={SECTION_GAP}>
        <IntroHeader
          isSubheading
          span={['8/8']}
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
        <Box display="flex" alignItems="center" columnGap={2}>
          <FilterInput
            name="drugs"
            placeholder={formatMessage(messages.medicineSearchForDrug)}
            onChange={(value) => setSearch(value)}
            value={search}
          />
          {drugsLoading && <LoadingDots />}
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        rowGap={2}
        marginBottom={SECTION_GAP}
      >
        <T.Table>
          <T.Head>
            <tr className={styles.tableRowStyles}>
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
            </tr>
          </T.Head>
          {SHOW_TABLE && (
            <T.Body>
              {drugs?.rightsPortalDrugs.data?.map((drug, i) => {
                return (
                  <tr
                    onMouseLeave={() => setHoveredDrug(-1)}
                    onMouseOver={() => setHoveredDrug(i)}
                    key={i}
                  >
                    <T.Data>{drug.name}</T.Data>
                    <T.Data>{drug.form}</T.Data>
                    <T.Data>{drug.strength}</T.Data>
                    <T.Data>{drug.packaging}</T.Data>
                    <T.Data>{drug.price}</T.Data>
                    <T.Data>
                      <Box
                        className={styles.saveButtonWrapperStyle({
                          visible: hoveredDrug === i || isMobile,
                        })}
                      >
                        <Button
                          size="small"
                          variant="text"
                          icon="pencil"
                          onClick={() =>
                            drug?.name &&
                            drug.strength &&
                            selectedDrugList.find(
                              (d) => d.nordicCode === drug.nordicCode,
                            ) === undefined
                              ? handleAddDrug(drug)
                              : undefined
                          }
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
        {SHOW_TABLE && (
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
        )}
      </Box>
      <Box marginBottom={SECTION_GAP}>
        <Box
          marginBottom={CONTENT_GAP_LG}
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexWrap="wrap"
        >
          <Text variant="h5">{formatMessage(messages.medicineResults)}</Text>
          <Button
            dataTestId="calculate-button"
            size="medium"
            variant="primary"
            disabled={CALCULATOR_DISABLED}
            onClick={() => {
              if (!hasCalculated) setHasCalculated(true)
              handleCalculate()
            }}
          >
            {formatMessage(messages.calculate)}
          </Button>
        </Box>
        <Box className={CALCULATOR_DISABLED ? styles.disabledTable : ''}>
          <T.Table>
            <T.Head>
              <tr className={styles.tableRowStyles}>
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
                            .filter((drug) => drug.nordicCode !== d.nordicCode)
                            .map((drug, i) => ({ ...drug, lineNumber: i + 1 })),
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
                  <T.Data>{formatMessage(m.total)}</T.Data>
                  <T.Data></T.Data>
                  <T.Data></T.Data>
                  <T.Data>
                    {formatMessage(messages.medicinePaymentPaidAmount, {
                      amount: calculatorResults.totalPrice
                        ? intl.formatNumber(calculatorResults.totalPrice)
                        : calculatorResults.totalPrice,
                    })}
                  </T.Data>
                  <T.Data>
                    {formatMessage(messages.medicinePaymentPaidAmount, {
                      amount: calculatorResults.totalCustomerPrice
                        ? intl.formatNumber(
                            calculatorResults.totalCustomerPrice,
                          )
                        : calculatorResults.totalCustomerPrice,
                    })}
                  </T.Data>
                  <T.Data></T.Data>
                </tr>
              )}
            </T.Foot>
          </T.Table>
        </Box>
        {CALCULATOR_DISABLED && (
          <EmptyTable message={messages.medicineCalculatorNoDrugSelected} />
        )}
      </Box>
      <Box>
        <Text variant="small">
          {formatMessage(messages.medicineCalculatorFooter)}
        </Text>
      </Box>
    </MedicineWrapper>
  )
}

export default MedicineCalulator
