import {
  Text,
  Box,
  Pagination,
  Table as T,
  SkeletonLoader,
  FilterInput,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../../../lib/messages'
import { CONTENT_GAP_LG, SECTION_GAP } from '../constants'
import { IntroHeader } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useDebounce } from 'react-use'
import {
  useGetDrugCalculationMutation,
  useGetDrugsQuery,
} from '../Medicine.generated'
import {
  RightsPortalCalculatorRequestInput,
  RightsPortalDrugCalculatorResponse,
} from '@island.is/api/schema'
import * as styles from './Medicine.css'
import { EmptyTable } from '../components/EmptyTable/EmptyTable'
import { DrugRow } from '../components/DrugRow/DrugRow'

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 8

export const MedicineCalulator = () => {
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER)

  const [hoveredDrug, setHoveredDrug] = useState(-1)
  const [selectedDrugList, setSelectedDrugList] = useState<
    RightsPortalCalculatorRequestInput[]
  >([])

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

  const [calculatorResults, setCalculatorResults] = useState<
    RightsPortalDrugCalculatorResponse[]
  >([])

  const SHOW_TABLE = debouncedSearch.length > 0
  const CALCULATOR_DISABLED = selectedDrugList.length === 0

  const handleCalculate = () => {
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
    drugCalcQuery({
      variables: {
        input: input,
      },
      onCompleted: (data) => {
        // route not implemented
      },
    })
  }

  const handleAddDrug = (
    drug: RightsPortalCalculatorRequestInput,
    name: string,
    strength: string,
  ) => {
    setSelectedDrugList((list) => {
      return [
        ...list,
        {
          lineNumber: list.length + 1,
          nordicCode: drug.nordicCode,
          price: drug.price,
          units: 1,
          name: name,
          strength: strength,
        },
      ]
    })
  }

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
          loading={drugsLoading}
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
                      {hoveredDrug === i && (
                        <Button
                          size="small"
                          variant="text"
                          icon="pencil"
                          onClick={() =>
                            drug?.name && drug.strength
                              ? handleAddDrug(drug, drug.name, drug.strength)
                              : undefined
                          }
                        >
                          {formatMessage(messages.medicineSelect)}
                        </Button>
                      )}
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
              onClick={() => console.log('print')}
              disabled={CALCULATOR_DISABLED}
            >
              Prenta
            </Button>
            <Button
              variant="utility"
              icon="download"
              size="small"
              onClick={() => console.log('download')}
              disabled={CALCULATOR_DISABLED}
            >
              Sækja
            </Button>
          </Box>
          <Button
            size="medium"
            variant="primary"
            disabled={CALCULATOR_DISABLED}
            onClick={handleCalculate}
          >
            Reikna
          </Button>
        </Box>
        <Box className={CALCULATOR_DISABLED ? styles.disabledTable : ''}>
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
                    <DrugRow
                      drug={d}
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
                      handleRemove={() =>
                        setSelectedDrugList((list) =>
                          list.filter(
                            (drug) => drug.nordicCode !== d.nordicCode,
                          ),
                        )
                      }
                    />
                  </tr>
                )
              })}
            </T.Body>
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
    </Box>
  )
}
