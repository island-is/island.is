import React, { FC } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Table as T } from '@island.is/island-ui/core'
import {
  FinanceStatusOrganizationType,
  FinanceStatusDetailsType,
  FinanceStatusOrganizationChargeType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'
import { Box, Text, Columns, Column } from '@island.is/island-ui/core'

interface Props {
  organization: FinanceStatusOrganizationType
  chargeType: FinanceStatusOrganizationChargeType
}

const GetFinanceStatusDetailsQuery = gql`
  query GetFinanceStatusDetailsQuery {
    getFinanceStatusDetails
  }
`

const FinanceStatusDetailTable: FC<Props> = ({ organization, chargeType }) => {
  const detailsQuery = useQuery(GetFinanceStatusDetailsQuery, {
    variables: {
      nationalID: '2704685439', //userInfo.profile.nationalId
      OrgID: organization?.id,
      chargeTypeID: chargeType?.id,
    },
  })
  const financeStatusDetails: FinanceStatusDetailsType =
    detailsQuery.data?.getFinanceStatusDetails || {}
  console.log({ financeStatusDetails })

  const currencyKr = (kr: number) =>
    typeof kr === 'number' ? `${kr.toLocaleString('de-DE')} kr.` : ''

  console.log('financeStatusDetails:: ', financeStatusDetails)
  return (
    <Box background="white">
      <T.Table>
        <T.Head>
          <T.Row>
            {[
              'Gjaldgrunnur',
              'Ár og tímabil',
              'Gjalddagi',
              'Eindagi',
              'Höfuðstóll',
              'Vextir',
              'Kostnaður',
              'Greiðslur',
              'Staða',
            ].map((item, i) => (
              <T.HeadData key={i} text={{ truncate: true }}>
                <Text fontWeight="semiBold" variant="small">
                  {item}
                </Text>
              </T.HeadData>
            ))}
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
                currencyKr(row.principal),
                currencyKr(row.interest),
                currencyKr(row.cost),
                currencyKr(row.dueTotals),
                currencyKr(row.totals),
              ].map((item, i) => (
                <T.Data key={i} text={{ truncate: true }}>
                  <Text variant="small">{item}</Text>
                </T.Data>
              ))}
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
          {organization['e-mail'] && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="small" as="span">
                Netfang:
              </Text>{' '}
              <a href={`mailto:${organization['e-mail']}`} target="_blank">
                <Text color="blue400" variant="small" as="span">
                  {organization['e-mail']}
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
