import React, { useState, useEffect, FC } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { dateFormat } from '@island.is/shared/constants'
import format from 'date-fns/format'
import sub from 'date-fns/sub'
import { Table as T } from '@island.is/island-ui/core'
import {
  Box,
  Text,
  Columns,
  Column,
  Stack,
  GridRow,
  GridColumn,
  DatePicker,
  Button,
  AlertBanner,
  SkeletonLoader,
  Pagination,
  Input,
  Hidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { DocumentsListItemTypes } from './DocumentScreen.types'
import amountFormat from '../../utils/amountFormat'
import { billsFilter } from '../../utils/simpleFilter'
import { formSubmit } from '../../utils/documentFormSubmission'
import { User } from 'oidc-client'

const ITEMS_ON_PAGE = 20

interface Props {
  title: string
  intro: string
  listPath: string
  defaultDateRangeMonths?: number
  userInfo: User
}

const getFinanceDocumentsListQuery = gql`
  query getFinanceDocumentsListQuery($input: GetDocumentsListInput!) {
    getDocumentsList(input: $input) {
      downloadServiceURL
      documentsList {
        id
        date
        type
        note
        sender
        dateOpen
        amount
      }
    }
  }
`

const DocumentScreen: FC<Props> = ({
  title,
  intro,
  listPath,
  defaultDateRangeMonths = 3,
  userInfo,
}) => {
  const { formatMessage } = useLocale()

  const [page, setPage] = useState(1)
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [q, setQ] = useState<string>('')

  const [loadDocumentsList, { data, loading, called, error }] = useLazyQuery(
    getFinanceDocumentsListQuery,
  )

  const billsDataArray: DocumentsListItemTypes[] =
    (data?.getDocumentsList?.documentsList &&
      billsFilter(data.getDocumentsList.documentsList, q)) ||
    []

  const totalPages =
    billsDataArray.length > ITEMS_ON_PAGE
      ? Math.ceil(billsDataArray.length / ITEMS_ON_PAGE)
      : 0

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
  }, [toDate, fromDate])

  useEffect(() => {
    const backInTheDay = sub(new Date(), {
      months: defaultDateRangeMonths,
    })
    setFromDate(backInTheDay)
    setToDate(new Date())
  }, [])

  console.log('data?.getDocumentsList', data?.getDocumentsList)
  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {title}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">{intro}</Text>
          </Column>
        </Columns>
        <Hidden print={true}>
          <Box marginTop={[1, 1, 2, 2, 5]}>
            <GridRow>
              <GridColumn
                span={['1/1', '6/12', '6/12', '6/12', '4/12']}
                order={[2, 2, 2, 2, 0]}
              >
                <DatePicker
                  backgroundColor="blue"
                  handleChange={(d) => setFromDate(d)}
                  icon="calendar"
                  iconType="outline"
                  size="sm"
                  label={formatMessage(m.dateFrom)}
                  selected={fromDate}
                  locale="is"
                  placeholderText={formatMessage(m.chooseDate)}
                />
              </GridColumn>
              <GridColumn
                paddingTop={[2, 0]}
                span={['1/1', '6/12', '6/12', '6/12', '4/12']}
                order={[3, 3, 3, 3, 0]}
              >
                <DatePicker
                  backgroundColor="blue"
                  handleChange={(d) => setToDate(d)}
                  icon="calendar"
                  iconType="outline"
                  size="sm"
                  label={formatMessage(m.dateTo)}
                  selected={toDate}
                  locale="is"
                  placeholderText={formatMessage(m.chooseDate)}
                />
              </GridColumn>
              <GridColumn
                paddingTop={[2, 0]}
                paddingBottom={2}
                span={['1/1', '12/12', '12/12', '12/12', '4/12']}
                order={[1, 1, 1, 1, 3]}
              >
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
              </GridColumn>
            </GridRow>
            <Box marginTop={3}>
              <Input
                label="Leit"
                name="Search"
                placeholder={formatMessage(m.searchPlaceholder)}
                size="sm"
                onChange={(e) => setQ(e.target.value)}
                value={q}
              />
            </Box>
          </Box>
        </Hidden>
        <Box marginTop={2}>
          {error && (
            <AlertBanner
              description={formatMessage(m.errorFetch)}
              variant="error"
            />
          )}
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
            <AlertBanner
              description={formatMessage(m.noResultsTryAgain)}
              variant="warning"
            />
          )}
          {billsDataArray.length > 0 ? (
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    <Text variant="eyebrow">{formatMessage(m.date)}</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="eyebrow">
                      {formatMessage(m.transactionType)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="eyebrow">
                      {formatMessage(m.performingOrganization)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ textAlign: 'right' }}>
                    <Text variant="eyebrow">{formatMessage(m.amount)}</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="eyebrow">
                      {formatMessage(m.explanationNote)}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {billsDataArray
                  .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
                  .map((listItem) => (
                    <T.Row key={listItem.id}>
                      <T.Data>
                        {format(new Date(listItem.date), dateFormat.is)}
                      </T.Data>
                      <T.Data box={{ position: 'relative' }}>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() =>
                            formSubmit(
                              `${data?.getDocumentsList?.downloadServiceURL}${listItem.id}`,
                              userInfo.access_token,
                            )
                          }
                        >
                          {listItem.type}
                        </Button>
                      </T.Data>
                      <T.Data>{listItem.sender}</T.Data>
                      <T.Data box={{ textAlign: 'right' }}>
                        {amountFormat(listItem.amount)}
                      </T.Data>
                      <T.Data>{listItem.note}</T.Data>
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
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default DocumentScreen
