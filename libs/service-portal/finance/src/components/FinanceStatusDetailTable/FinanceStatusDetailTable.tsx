import cn from 'classnames'

import {
  Box,
  Button,
  Column,
  Columns,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  amountFormat,
  formSubmit,
  m,
  tableStyles,
} from '@island.is/service-portal/core'

import {
  FinanceStatusDetailsType,
  FinanceStatusOrganizationChargeType,
  FinanceStatusOrganizationType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'
import { exportGjoldSundurlidunFile } from '../../utils/filesGjoldSundurlidun'
import * as styles from './FinanceStatusDetailTable.css'

interface Props {
  organization: FinanceStatusOrganizationType
  chargeType: FinanceStatusOrganizationChargeType
  financeStatusDetails: FinanceStatusDetailsType
  downloadURL: string
}

const FinanceStatusDetailTable = ({
  organization,
  chargeType,
  financeStatusDetails,
  downloadURL,
}: Props) => {
  const { formatMessage } = useLocale()

  const headerArray = [
    { value: formatMessage(m.feeBase) },
    { value: formatMessage(m.yearAndSeason) },
    { value: formatMessage(m.dueDate) },
    { value: formatMessage(m.finalDueDate) },
    { value: formatMessage(m.principal), align: 'right' },
    { value: formatMessage(m.interest), align: 'right' },
    { value: formatMessage(m.cost), align: 'right' },
    { value: formatMessage(m.payments), align: 'right' },
    { value: formatMessage(m.status), align: 'right' },
  ]

  return (
    <Box className={styles.wrapper} background="white">
      <T.Table>
        <T.Head>
          <T.Row>
            {headerArray.map((item, i) => (
              <T.HeadData
                box={{
                  textAlign: item.align as 'right' | undefined,
                  paddingRight: 2,
                  paddingLeft: 2,
                }}
                key={i}
                text={{ truncate: true }}
                style={tableStyles}
              >
                <Text variant="medium" fontWeight="semiBold">
                  {item.value}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {financeStatusDetails?.chargeItemSubjects?.map((row, i) => (
            <T.Row key={i}>
              {[
                { value: row.chargeItemSubject },
                { value: row.timePeriod },
                { value: row.dueDate },
                { value: row.finalDueDate },
                { value: amountFormat(row.principal), align: 'right' },
                { value: amountFormat(row.interest), align: 'right' },
                { value: amountFormat(row.cost), align: 'right' },
                { value: amountFormat(row.paid), align: 'right' },
                { value: amountFormat(row.totals), align: 'right' },
              ].map((item, ii) =>
                ii === 0 && row.documentID ? (
                  <T.Data
                    box={{
                      paddingRight: 2,
                      paddingLeft: 2,
                      position: 'relative',
                    }}
                    key={ii}
                    style={tableStyles}
                  >
                    <Button
                      variant="text"
                      onClick={() =>
                        formSubmit(`${downloadURL}${row.documentID}`)
                      }
                    >
                      {item.value}
                    </Button>
                  </T.Data>
                ) : (
                  <T.Data
                    box={{ paddingRight: 2, paddingLeft: 2 }}
                    key={ii}
                    style={tableStyles}
                  >
                    <div
                      className={cn(styles.td, {
                        [styles.alignTd]: item.align,
                      })}
                    >
                      <Text variant="medium">{item.value}</Text>
                    </div>
                  </T.Data>
                ),
              )}
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
      <Box paddingX={2} paddingTop={2} background="blue100">
        <Columns>
          <Column width="content">
            <Text fontWeight="semiBold" variant="medium">
              {formatMessage(m.contactInfo)}
            </Text>
          </Column>
        </Columns>
        <Box>
          {organization.homepage && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="medium" as="span">
                {formatMessage(m.website)}:
              </Text>{' '}
              <a
                href={`//${organization.homepage}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Text variant="medium" color="blue400" as="span">
                  {organization.homepage}
                </Text>
              </a>
            </Box>
          )}
          {organization.email && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="medium" as="span">
                {formatMessage(m.email)}:
              </Text>{' '}
              <a
                href={`mailto:${organization.email}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Text variant="medium" color="blue400" as="span">
                  {organization.email}
                </Text>
              </a>
            </Box>
          )}
          {organization.phone && (
            <Box display="inlineBlock">
              <Text variant="medium" as="span">
                {formatMessage(m.phone)}:
              </Text>{' '}
              <a
                href={`tel:+354${organization.phone}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Text variant="medium" color="blue400" as="span">
                  {organization.phone}
                </Text>
              </a>
            </Box>
          )}
        </Box>
      </Box>
      <Box paddingX={2} paddingBottom={2} paddingTop={1} background="blue100">
        <Button
          colorScheme="default"
          icon="arrowForward"
          iconType="filled"
          onClick={() =>
            exportGjoldSundurlidunFile(
              financeStatusDetails,
              chargeType.name || 'details',
              'xlsx',
            )
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
              exportGjoldSundurlidunFile(
                financeStatusDetails,
                chargeType.name || 'details',
                'csv',
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
    </Box>
  )
}

export default FinanceStatusDetailTable
