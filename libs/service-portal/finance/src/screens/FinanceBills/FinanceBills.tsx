import React, { useState, useEffect } from 'react'
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
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { BillReceiptItemTypes } from './FinanceBillsData.types'
import amountFormat from '../../utils/amountFormat'

// Todo: This is can be shared with "Documents"
const base64ToArrayBuffer = (base64Pdf: string) => {
  const binaryString = window.atob(base64Pdf)
  const binaryLen = binaryString.length
  const bytes = new Uint8Array(binaryLen)
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i)
    bytes[i] = ascii
  }
  return bytes
}

const getPdfURL = (base64Pdf: string) => {
  const byte = base64ToArrayBuffer(base64Pdf)
  const blob = new Blob([byte], { type: 'application/pdf' })
  return URL.createObjectURL(blob)
}

const documentIsPdf = (data: any) => {
  console.log('ispdf, data', data)
  return (data?.type || '').toLowerCase() === 'pdf' && data?.document
}
// :End shared

const getFinanceBillsListQuery = gql`
  query getFinanceBillsListQuery($input: GetBillReceiptsInput!) {
    getBillReceipts(input: $input) {
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

const getFinanceDocumentQuery = gql`
  query getFinanceBillsListQuery($input: GetFinanceDocumentInput!) {
    getFinanceDocument(input: $input) {
      docment {
        type
        document
      }
    }
  }
`

const FinanceBills = () => {
  useNamespaces('sp.finance-bills')
  const { formatMessage } = useLocale()

  const [fromDate, setFromDate] = useState<string>()
  const [toDate, setToDate] = useState<string>()

  const [loadFinanceBills, { data, loading, called }] = useLazyQuery(
    getFinanceBillsListQuery,
  )

  const billsDataArray: BillReceiptItemTypes[] =
    data?.getBillReceipts?.documentsList || []

  useEffect(() => {
    if (toDate && fromDate) {
      loadFinanceBills({
        variables: {
          input: {
            dayFrom: fromDate,
            dayTo: toDate,
          },
        },
      })
    }
  }, [toDate, fromDate])

  const [loadFinanceDocument] = useLazyQuery(getFinanceDocumentQuery, {
    onCompleted: (docData) => {
      const pdfData = docData?.getFinanceDocument?.docment || null
      if (pdfData && documentIsPdf(pdfData)) {
        window.open(getPdfURL(pdfData.document))
      } else {
        console.warn('No PDF data') // Should warn the user with toast?
      }
    },
  })

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:finance-bills-title',
            defaultMessage: 'Greiðsluseðlar og Greiðslukvittanir',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'service.portal:finance-bills-intro',
                defaultMessage:
                  'Eitthvað mega hresst og peppað um Greiðsluseðla og Greiðslukvittanir mögulega í tveimur línum.',
              })}
            </Text>
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
                label="Dagsetning frá"
                locale="is"
                placeholderText="Veldu dagsetningu"
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
                label="Dagsetning til"
                locale="is"
                placeholderText="Veldu dagsetningu"
              />
            </GridColumn>
          </GridRow>
        </Box>
        <Box marginTop={2}>
          {!called && !loading && (
            <AlertBanner
              description="Veldu dagsetningar til að fá niðurstöður"
              variant="info"
            />
          )}
          {billsDataArray.length > 0 ? (
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    <Text variant="eyebrow">Dagsetning</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="eyebrow">Tegund</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="eyebrow">Skýring</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="eyebrow">Framkvæmdaraðili</Text>
                  </T.HeadData>
                  <T.HeadData>
                    <Text variant="eyebrow">Upphæð</Text>
                  </T.HeadData>
                  <T.HeadData></T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {billsDataArray.map((listItem) => (
                  <T.Row key={listItem.id}>
                    <T.Data>
                      {format(new Date(listItem.date), dateFormat.is)}
                    </T.Data>
                    <T.Data>{listItem.type}</T.Data>
                    <T.Data>{listItem.note}</T.Data>
                    <T.Data>{listItem.sender}</T.Data>
                    <T.Data>{amountFormat(listItem.amount)}</T.Data>
                    <T.Data>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() =>
                          loadFinanceDocument({
                            variables: {
                              input: {
                                documentID: listItem.id,
                              },
                            },
                          })
                        }
                      >
                        Skoða
                      </Button>
                    </T.Data>
                  </T.Row>
                ))}
              </T.Body>
            </T.Table>
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceBills
