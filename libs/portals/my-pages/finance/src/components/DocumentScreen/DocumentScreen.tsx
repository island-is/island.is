import format from 'date-fns/format'
import sub from 'date-fns/sub'
import sortBy from 'lodash/sortBy'
import { useEffect, useState } from 'react'

import {
  Accordion,
  AccordionItem,
  AlertBanner,
  Box,
  Button,
  DatePicker,
  Filter,
  FilterInput,
  Inline,
  Pagination,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  amountFormat,
  FJARSYSLAN_SLUG,
  FootNote,
  formSubmit,
  m,
  tableStyles,
} from '@island.is/portals/my-pages/core'
import { dateFormat } from '@island.is/shared/constants'

import { Problem } from '@island.is/react-spa/shared'
import * as styles from '../../screens/Finance.css'
import { exportGeneralDocuments } from '../../utils/filesGeneral'
import { billsFilter } from '../../utils/simpleFilter'
import DropdownExport from '../DropdownExport/DropdownExport'
import FinanceIntro from '../FinanceIntro'
import { useGetFinanceDocumentsListLazyQuery } from './DocumentScreen.generated'
import { DocumentsListItemTypes } from './DocumentScreen.types'
import { useFinanceSwapHook } from '../../utils/financeSwapHook'

const ITEMS_ON_PAGE = 20

interface Props {
  title: string
  intro?: string
  listPath: string
  defaultDateRangeMonths?: number
}

const DocumentScreen = ({
  title,
  intro,
  listPath,
  defaultDateRangeMonths = 3,
}: Props) => {
  const { formatMessage } = useLocale()
  useFinanceSwapHook()

  const [page, setPage] = useState(1)
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [q, setQ] = useState<string>('')
  const backInTheDay = sub(new Date(), {
    months: defaultDateRangeMonths,
  })

  const [loadDocumentsList, { data, loading, called, error }] =
    useGetFinanceDocumentsListLazyQuery()

  const billsDataArray: DocumentsListItemTypes[] =
    (data?.getDocumentsList?.documentsList &&
      billsFilter(data.getDocumentsList.documentsList, q)) ||
    []

  const totalPages =
    billsDataArray.length > ITEMS_ON_PAGE
      ? Math.ceil(billsDataArray.length / ITEMS_ON_PAGE)
      : 0

  function clearAllFilters() {
    setFromDate(backInTheDay)
    setToDate(new Date())
    setQ('')
  }

  useEffect(() => {
    if (toDate && fromDate) {
      loadDocumentsList({
        variables: {
          input: {
            dayFrom: format(fromDate, 'yyyy-MM-dd'),
            dayTo: format(toDate, 'yyyy-MM-dd'),
            listPath: listPath,
          },
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toDate, fromDate])

  useEffect(() => {
    setFromDate(backInTheDay)
    setToDate(new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box marginTop={[1, 1, 2, 2, 4]} marginBottom={[6, 6, 10]}>
      <FinanceIntro text={intro} />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && (
        <Stack space={2}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flexStart"
            flexWrap="wrap"
            rowGap={2}
            columnGap={2}
          >
            <Inline space={2}>
              <Filter
                resultCount={0}
                variant="popover"
                align="left"
                reverse
                labelClear={formatMessage(m.clearFilter)}
                labelClearAll={formatMessage(m.clearAllFilters)}
                labelOpen={formatMessage(m.openFilter)}
                labelClose={formatMessage(m.closeFilter)}
                popoverFlip={false}
                filterInput={
                  <FilterInput
                    placeholder={formatMessage(m.searchPlaceholder)}
                    name="finance-document-input"
                    value={q}
                    onChange={(e) => setQ(e)}
                    backgroundColor="blue"
                  />
                }
                onFilterClear={clearAllFilters}
              >
                <Box className={styles.dateFilterSingle} paddingX={3}>
                  <Box marginTop={1}>
                    <Accordion
                      dividerOnBottom={false}
                      dividerOnTop={false}
                      singleExpand={false}
                    >
                      <AccordionItem
                        key="date-accordion-item"
                        id="date-accordion-item"
                        label={formatMessage(m.datesLabel)}
                        labelColor="dark400"
                        labelUse="h5"
                        labelVariant="h5"
                        iconVariant="small"
                        startExpanded
                      >
                        <Box
                          className={styles.accordionBoxSingle}
                          display="flex"
                          flexDirection="column"
                        >
                          <DatePicker
                            label={formatMessage(m.datepickerFromLabel)}
                            placeholderText={formatMessage(m.datepickLabel)}
                            locale="is"
                            backgroundColor="blue"
                            size="xs"
                            handleChange={(d) => setFromDate(d)}
                            selected={fromDate}
                            appearInline
                          />
                          <Box marginTop={3}>
                            <DatePicker
                              label={formatMessage(m.datepickerToLabel)}
                              placeholderText={formatMessage(m.datepickLabel)}
                              locale="is"
                              backgroundColor="blue"
                              size="xs"
                              handleChange={(d) => setToDate(d)}
                              selected={toDate}
                              appearInline
                            />
                          </Box>
                        </Box>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </Box>
              </Filter>
              <Box>
                <Button
                  colorScheme="default"
                  icon="print"
                  iconType="filled"
                  onClick={() => window.print()}
                  preTextIconType="filled"
                  size="default"
                  type="button"
                  variant="utility"
                >
                  {formatMessage(m.print)}
                </Button>
              </Box>

              <DropdownExport
                onGetCSV={() =>
                  exportGeneralDocuments(billsDataArray, title, 'csv')
                }
                onGetExcel={() =>
                  exportGeneralDocuments(billsDataArray, title, 'xlsx')
                }
              />
            </Inline>
          </Box>
          <Box marginTop={2}>
            {!called && !loading && (
              <AlertBanner
                description={formatMessage(m.datesForResults)}
                variant="info"
              />
            )}
            {loading && (
              <Box padding={3}>
                <SkeletonLoader space={1} height={40} repeat={5} />
              </Box>
            )}
            {billsDataArray.length === 0 && called && !loading && !error && (
              <Problem
                type="no_data"
                noBorder={false}
                title={formatMessage(m.noData)}
                message={formatMessage(m.noTransactionFound)}
                imgSrc="./assets/images/sofa.svg"
                imgAlt=""
              />
            )}
            {billsDataArray.length > 0 ? (
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData style={tableStyles}>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(m.date)}
                      </Text>
                    </T.HeadData>
                    <T.HeadData style={tableStyles}>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(m.transactionType)}
                      </Text>
                    </T.HeadData>
                    <T.HeadData style={tableStyles}>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(m.performingOrganization)}
                      </Text>
                    </T.HeadData>
                    <T.HeadData
                      box={{ textAlign: 'right' }}
                      style={tableStyles}
                    >
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(m.amount)}
                      </Text>
                    </T.HeadData>
                    <T.HeadData style={tableStyles}>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(m.explanationNote)}
                      </Text>
                    </T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {sortBy(billsDataArray, (item) => {
                    return item.date
                  })
                    .reverse()
                    .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
                    .map((listItem) => (
                      <T.Row key={listItem.id}>
                        <T.Data style={tableStyles}>
                          <Text variant="medium">
                            {format(new Date(listItem.date), dateFormat.is)}
                          </Text>
                        </T.Data>
                        <T.Data
                          box={{ position: 'relative' }}
                          style={tableStyles}
                        >
                          <Button
                            variant="text"
                            size="medium"
                            onClick={() =>
                              formSubmit(
                                `${data?.getDocumentsList?.downloadServiceURL}${listItem.id}`,
                              )
                            }
                          >
                            {listItem.type}
                          </Button>
                        </T.Data>
                        <T.Data style={tableStyles}>
                          <Text variant="medium">{listItem.sender}</Text>
                        </T.Data>
                        <T.Data
                          box={{ textAlign: 'right' }}
                          style={tableStyles}
                        >
                          <Text variant="medium">
                            {amountFormat(listItem.amount)}
                          </Text>
                        </T.Data>
                        <T.Data style={tableStyles}>
                          <Text variant="medium">{listItem.note}</Text>
                        </T.Data>
                      </T.Row>
                    ))}
                </T.Body>
              </T.Table>
            ) : null}
            {totalPages > 0 ? (
              <Box paddingTop={8}>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  renderLink={(page, className, children) => (
                    <Box
                      cursor="pointer"
                      className={className}
                      onClick={() => setPage(page)}
                      component="button"
                    >
                      {children}
                    </Box>
                  )}
                />
              </Box>
            ) : null}
          </Box>
        </Stack>
      )}
      <FootNote serviceProviderSlug={FJARSYSLAN_SLUG} />
    </Box>
  )
}

export default DocumentScreen
