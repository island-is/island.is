import React, { useState, useEffect, FC } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { dateFormat } from '@island.is/shared/constants'
import format from 'date-fns/format'
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
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { DocumentsListItemTypes } from './DocumentScreen.types'
import amountFormat from '../../utils/amountFormat'
import { showPdfDocument } from '@island.is/service-portal/graphql'

const ITEMS_ON_PAGE = 20

interface Props {
  title: string
  intro: string
  listPath: string
}

const getFinanceDocumentsListQuery = gql`
  query getFinanceDocumentsListQuery($input: GetDocumentsListInput!) {
    getDocumentsList(input: $input) {
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

const DocumentScreen: FC<Props> = ({ title, intro, listPath }) => {
  const { showPdf } = showPdfDocument()
  const { formatMessage } = useLocale()

  const [page, setPage] = useState(1)
  const [fromDate, setFromDate] = useState<string>()
  const [toDate, setToDate] = useState<string>()

  const [loadDocumentsList, { data, loading, called, error }] = useLazyQuery(
    getFinanceDocumentsListQuery,
  )

  const billsDataArray: DocumentsListItemTypes[] =
    data?.getDocumentsList?.documentsList || []

  const totalPages =
    billsDataArray.length > ITEMS_ON_PAGE
      ? Math.ceil(billsDataArray.length / ITEMS_ON_PAGE)
      : 0

  useEffect(() => {
    if (toDate && fromDate) {
      loadDocumentsList({
        variables: {
          input: {
            dayFrom: fromDate,
            dayTo: toDate,
            listPath: listPath,
          },
        },
      })
    }
  }, [toDate, fromDate])

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
        <Box marginTop={[1, 1, 2, 2, 5]}>
          <GridRow>
            <GridColumn span={['1/1', '4/12']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => {
                  const date = format(d, 'yyyy-MM-dd')
                  setFromDate(date)
                }}
                icon="calendar"
                iconType="outline"
                size="sm"
                label={formatMessage(m.dateFrom)}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '4/12']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => {
                  const date = format(d, 'yyyy-MM-dd')
                  setToDate(date)
                }}
                icon="calendar"
                iconType="outline"
                size="sm"
                label={formatMessage(m.dateTo)}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
          </GridRow>
        </Box>
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
                  <T.HeadData>
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
                      <T.Data>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => showPdf(listItem.id)}
                        >
                          {listItem.type}
                        </Button>
                      </T.Data>
                      <T.Data>{listItem.sender}</T.Data>
                      <T.Data>{amountFormat(listItem.amount)}</T.Data>
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
