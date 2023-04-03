import { gql, useQuery } from '@apollo/client'
import { AidOrNutrition, Query } from '@island.is/api/schema'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { SUPPORT_PRODUCTS } from '../../utils/constants'
import { FootNote } from '../../components/FootNote.tsx/FootNote'

const GetSupportProducts = gql`
  query GetAidsAndNutrition {
    getRightsPortalAidsAndNutrition {
      aids {
        name
        available
        expiring
        location
        maxUnitRefund
        refund {
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
        <Text>{rowItem.name}</Text>
      </T.Data>
      <T.Data>
        <Text>{rowItem.maxUnitRefund}</Text>
      </T.Data>
      <T.Data>
        <Text>0 kr.</Text>
      </T.Data>
      <T.Data>
        <Text>{rowItem.available}</Text>
      </T.Data>
      <T.Data>
        <Text>{rowItem.refund.value ?? '0 kr.'}</Text>
      </T.Data>
      <T.Data>
        <Text>{rowItem.location}</Text>
      </T.Data>
    </T.Row>
  )

  console.log(row)
  return row
}

const SupportProducts = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useQuery<Query>(GetSupportProducts)
  const supportData = data?.getRightsPortalAidsAndNutrition

  console.log(supportData)

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.supportProducts).toLowerCase(),
        })}
      />
    )
  }

  if (!supportData) {
    return (
      <Box marginTop={8}>
        <EmptyState />
      </Box>
    )
  }

  /*
        <>
          <a href="" target="_blank" rel="noreferrer">
            <Button size="small" variant="text">
              {formatMessage(messages.supportProductsDescriptionInfo1)}
            </Button>
          </a>
          <a href="" target="_blank" rel="noreferrer">
            <Button size="small" variant="text">
              {formatMessage(messages.supportProductsDescriptionInfo2)}
            </Button>
          </a>
        </>
  */

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.supportProductsTitle)}
        intro={formatMessage(messages.supportProductsDescription)}
      />

      <Box marginTop={[1, 1, 4]}>
        <Box marginTop={2}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(messages.name)}</T.HeadData>
                <T.HeadData>{formatMessage(messages.maxUnitRefund)}</T.HeadData>
                <T.HeadData>
                  {formatMessage(messages.insuranceRatio)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(messages.availableRefund)}
                </T.HeadData>
                <T.HeadData> {formatMessage(messages.location)}</T.HeadData>
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

export default SupportProducts
