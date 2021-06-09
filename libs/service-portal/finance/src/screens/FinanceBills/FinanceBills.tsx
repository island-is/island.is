import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
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
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  BillReceiptTypes,
  BillReceiptItemTypes,
} from './FinanceBillsData.types'
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

  const { data } = useQuery<Query>(getFinanceBillsListQuery, {
    variables: {
      input: {
        dayFrom: '2021-01-01',
        dayTo: '2021-05-31',
      },
    },
  })

  const billsDataArray: BillReceiptItemTypes[] =
    data?.getBillReceipts?.documentsList || []

  // TODO: This is still hardcoded. Add onclick to fetch document per table row.
  const { data: documentData } = useQuery<Query>(getFinanceDocumentQuery, {
    variables: {
      input: {
        documentID: 'SK11112704685439202101111609341083008',
      },
    },
  })

  const doc: any = documentData?.getFinanceDocument?.docment || {}

  console.log('doc', doc)

  const displayDocument = () => {
    console.log('clicked')
    if (documentIsPdf(doc)) {
      console.log('ispdf')
      window.open(getPdfURL(doc.document))
      return
    }
  }

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
                handleChange={function noRefCheck() {}}
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
                handleChange={function noRefCheck() {}}
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
          {billsDataArray.length > 0 ? (
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>Dagsetning</T.HeadData>
                  <T.HeadData>Tegund</T.HeadData>
                  <T.HeadData>Skýring</T.HeadData>
                  <T.HeadData>Framkvæmdaraðili</T.HeadData>
                  <T.HeadData>Upphæð</T.HeadData>
                  <T.HeadData></T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {billsDataArray.map((listItem) => (
                  <T.Row key={listItem.id}>
                    <T.Data>{listItem.date}</T.Data>
                    <T.Data>{listItem.type}</T.Data>
                    <T.Data>{listItem.note}</T.Data>
                    <T.Data>{listItem.sender}</T.Data>
                    <T.Data>{amountFormat(listItem.amount)}</T.Data>
                    <T.Data>
                      <button onClick={() => displayDocument()}>Skoða</button>
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
