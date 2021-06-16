import React, { FC } from 'react'
import { Table as T } from '@island.is/island-ui/core'
import { gql } from '@apollo/client'
import {
  FinanceStatusOrganizationType,
  FinanceStatusDetailsType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'
import { Box, Text, Columns, Column, Button } from '@island.is/island-ui/core'
import {
  exportGjoldSundurlidunCSV,
  exportGjoldSundurlidunXSLX,
} from '../../utils/filesGjoldSundurlidun'
import amountFormat from '../../utils/amountFormat'
import { downloadXlsxDocument } from '@island.is/service-portal/graphql'
import { gjoldSundurlidunHeaders } from '../../utils/dataHeaders'
import * as styles from './FinanceStatusDetailTable.treat'

const GetExcelSheetData = gql`
  query GetExcelSheetData($input: ExcelSheetInput!) {
    getExcelDocument(input: $input)
  }
`

interface Props {
  organization: FinanceStatusOrganizationType
  financeStatusDetails: FinanceStatusDetailsType
}

const FinanceStatusDetailTable: FC<Props> = ({
  organization,
  financeStatusDetails,
}) => {
  const { downloadSheet } = downloadXlsxDocument()
  return (
    <Box className={styles.wrapper} background="white">
      <T.Table>
        <T.Head>
          <T.Row>
            {gjoldSundurlidunHeaders.map((item, i) => (
              <T.HeadData key={i} text={{ truncate: true }}>
                <Text fontWeight="semiBold" variant="small">
                  {item}
                </Text>
              </T.HeadData>
            ))}
            <T.HeadData>
              <Box className={styles.buttonTd}>
                <Button
                  colorScheme="default"
                  icon="arrowForward"
                  iconType="filled"
                  onClick={() =>
                    downloadSheet({
                      headers: gjoldSundurlidunHeaders,
                      data: exportGjoldSundurlidunXSLX(financeStatusDetails),
                    })
                  }
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                >
                  Sækja Excel
                </Button>
                <div className={styles.btnSpacer}>
                  <Button
                    colorScheme="default"
                    icon="arrowForward"
                    iconType="filled"
                    onClick={() =>
                      exportGjoldSundurlidunCSV(
                        financeStatusDetails,
                        organization?.chargeTypes?.[0].name || 'details',
                      )
                    }
                    preTextIconType="filled"
                    size="small"
                    type="button"
                    variant="text"
                  >
                    Sækja CSV
                  </Button>
                </div>
              </Box>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {financeStatusDetails?.chargeItemSubjects?.map((row, i) => (
            <T.Row key={i}>
              {[
                row.chargeItemSubject,
                row.timePeriod,
                row.dueDate,
                row.finalDueDate,
                amountFormat(row.principal),
                amountFormat(row.interest),
                amountFormat(row.cost),
                amountFormat(row.paid),
                amountFormat(row.totals),
              ].map((item, ii) => (
                <T.Data key={ii}>
                  <div className={styles.td}>
                    <Text variant="small">{item}</Text>
                  </div>
                </T.Data>
              ))}
              <T.Data></T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
      <Box padding={2} background="blue100">
        <Columns>
          <Column width="content">
            <Text fontWeight="semiBold" variant="small">
              Tengiliða upplýsingar
            </Text>
          </Column>
        </Columns>
        <Box>
          {organization.homepage && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="small" as="span">
                Heimasíða:
              </Text>{' '}
              <a href={`//${organization.homepage}`} target="_blank">
                <Text color="blue400" variant="small" as="span">
                  {organization.homepage}
                </Text>
              </a>
            </Box>
          )}
          {organization.email && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="small" as="span">
                Netfang:
              </Text>{' '}
              <a href={`mailto:${organization.email}`} target="_blank">
                <Text color="blue400" variant="small" as="span">
                  {organization.email}
                </Text>
              </a>
            </Box>
          )}
          {/* TODO: Format tel display and href?? */}
          {organization.phone && (
            <Box display="inlineBlock">
              <Text variant="small" as="span">
                Sími:
              </Text>{' '}
              <a href={`tel:${organization.phone}`} target="_blank">
                <Text color="blue400" variant="small" as="span">
                  {organization.phone}
                </Text>
              </a>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default FinanceStatusDetailTable
