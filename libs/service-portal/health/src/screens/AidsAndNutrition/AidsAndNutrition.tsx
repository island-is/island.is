import { gql, useQuery } from '@apollo/client'
import { AidOrNutrition, Query } from '@island.is/api/schema'
import {
  Box,
  Table as T,
  Text,
  Inline,
  Button,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ErrorScreen, IntroHeader, m } from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { SUPPORT_PRODUCTS } from '../../utils/constants'
import { FootNote } from '../../components/FootNote.tsx/FootNote'

const GetAidsAndNutrition = gql`
  query GetAidsAndNutrition {
    getRightsPortalAidsAndNutrition {
      aids {
        name
        available
        expiring
        location
        maxUnitRefund
        refund {
          type
          value
        }
      }
      nutrition {
        name
        available
        expiring
        location
        maxUnitRefund
        refund {
          type
          value
        }
      }
    }
  }
`

const generateRow = (rowItem: AidOrNutrition) => {
  const row = (
    <T.Row>
      <T.Data>
        <Text variant="medium">{rowItem.name}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{rowItem.maxUnitRefund}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{`${rowItem.refund.value}${
          rowItem.refund.type === 'amount' ? ' kr.' : '%'
        }`}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{rowItem.available}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{rowItem.location}</Text>
      </T.Data>
    </T.Row>
  )

  return row
}

const AidsAndNutrition = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useQuery<Query>(GetAidsAndNutrition)
  const supportData = data?.getRightsPortalAidsAndNutrition

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.aidsAndNutrition).toLowerCase(),
        })}
      />
    )
  }

  if (!supportData) {
    return (
      <Box width="full" marginTop={4} display="flex" justifyContent="center">
        <Text variant="h5" as="h3">
          {formatMessage(messages.noData)}
        </Text>
      </Box>
    )
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.aidsAndNutritionTitle)}
        intro={formatMessage(messages.aidsAndNutritionDescription)}
      />
      <Inline space={3}>
        <>
          <a
            href="https://island.is/greidsluthatttaka-vegna-naeringar-og-serfaedis"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="small" variant="text" icon="open" iconType="outline">
              {formatMessage(messages.aidsAndNutritionDescriptionInfo1)}
            </Button>
          </a>
          <a
            href="https://island.is/einnota-hjalpartaeki"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="small" variant="text" icon="open" iconType="outline">
              {formatMessage(messages.aidsAndNutritionDescriptionInfo2)}
            </Button>
          </a>
        </>
      </Inline>

      <Box marginTop={[2, 2, 5]}>
        <Box marginTop={2}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage(messages.name)}
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage(messages.maxUnitRefund)}
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage(messages.insuranceRatio)}
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage(messages.availableRefund)}
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="medium" fontWeight="semiBold">
                    {formatMessage(messages.location)}
                  </Text>
                </T.HeadData>
                <T.HeadData />
              </T.Row>
            </T.Head>
            <T.Body>
              {supportData.aids &&
                supportData.aids.map((rowItem) => generateRow(rowItem))}
              {supportData.nutrition &&
                supportData.nutrition.map((rowItem) => generateRow(rowItem))}
            </T.Body>
          </T.Table>
        </Box>
        <FootNote type={SUPPORT_PRODUCTS} />
      </Box>
    </Box>
  )
}

export default AidsAndNutrition
