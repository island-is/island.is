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
} from '@island.is/island-ui/core'
import { DocumentsListItemTypes } from './DocumentScreen.types'
import amountFormat from '../../utils/amountFormat'
import { showPdfDocument } from '@island.is/service-portal/graphql'

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

  const [fromDate, setFromDate] = useState<string>()
  const [toDate, setToDate] = useState<string>()

  const [loadDocumentsList, { data, loading, called }] = useLazyQuery(
    getFinanceDocumentsListQuery,
  )

  const billsDataArray: DocumentsListItemTypes[] =
    data?.getDocumentsList?.documentsList || []

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
          {loading && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {billsDataArray.length === 0 && called && !loading && (
            <AlertBanner
              description="Leit skilaði engum niðurstöðum. Vinsamlegast leitaðu aftur."
              variant="warning"
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
                        onClick={() => showPdf(listItem.id)}
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

export default DocumentScreen
