import React, { FC } from 'react'
import { Table as T } from '@island.is/island-ui/core'
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
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import * as styles from './FinanceStatusDetailTable.treat'

interface Props {
  organization: FinanceStatusOrganizationType
  financeStatusDetails: FinanceStatusDetailsType
  token: string
}

const FinanceStatusDetailTable: FC<Props> = ({
  organization,
  financeStatusDetails,
  token,
}) => {
  const { downloadSheet } = downloadXlsxDocument()
  const { formatMessage } = useLocale()
  return (
    <Box className={styles.wrapper} background="white">
      <T.Table>
        <T.Head>
          <T.Row>
            {[
              formatMessage(m.feeBase),
              formatMessage(m.yearAndSeason),
              formatMessage(m.dueDate),
              formatMessage(m.finalDueDate),
              formatMessage(m.principal),
              formatMessage(m.interest),
              formatMessage(m.cost),
              formatMessage(m.payments),
              formatMessage(m.status),
              formatMessage(m.chargeType),
            ].map((item, i) => (
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
                      token: token,
                    })
                  }
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                >
                  {formatMessage(m.getAsExcel)}
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
                    {formatMessage(m.getAsCsv)}
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
              {formatMessage(m.contactInfo)}
            </Text>
          </Column>
        </Columns>
        <Box>
          {organization.homepage && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="small" as="span">
                {formatMessage(m.website)}:
              </Text>{' '}
              <a
                href={`//${organization.homepage}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Text color="blue400" variant="small" as="span">
                  {organization.homepage}
                </Text>
              </a>
            </Box>
          )}
          {organization.email && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="small" as="span">
                {formatMessage(m.email)}:
              </Text>{' '}
              <a
                href={`mailto:${organization.email}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Text color="blue400" variant="small" as="span">
                  {organization.email}
                </Text>
              </a>
            </Box>
          )}
          {organization.phone && (
            <Box display="inlineBlock">
              <Text variant="small" as="span">
                {formatMessage(m.phone)}:
              </Text>{' '}
              <a
                href={`tel:+354${organization.phone}`}
                rel="noreferrer noopener"
                target="_blank"
              >
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
