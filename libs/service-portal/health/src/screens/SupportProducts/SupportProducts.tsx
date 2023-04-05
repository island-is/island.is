import { gql, useQuery } from '@apollo/client'
import { AidOrNutrition, Query } from '@island.is/api/schema'
import {
  Box,
  Table as T,
  Text,
  Inline,
  LinkV2,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ErrorScreen, IntroHeader, m } from '@island.is/service-portal/core'
import * as styles from './SupportProducts.css'
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
        <Text variant="medium">{rowItem.name}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{rowItem.maxUnitRefund}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">0 kr.</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{rowItem.available}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{rowItem.refund.value ?? '0 kr.'}</Text>
      </T.Data>
      <T.Data>
        <Text variant="medium">{rowItem.location}</Text>
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
      <Box width="full" marginTop={4} display="flex" justifyContent="center">
        <Text variant="h5" as="h3">
          {formatMessage(messages.noData)}
        </Text>
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
      <Inline space={3}>
        <LinkV2
          color="blue400"
          underline="normal"
          underlineVisibility="always"
          newTab={true}
          href={
            'https://island.is/greidsluthatttaka-vegna-naeringar-og-serfaedis'
          }
        >
          <Text variant="small">
            {formatMessage(messages.supportProductsDescriptionInfo1)}
          </Text>
          <Icon
            aria-hidden="true"
            icon="open"
            type="outline"
            size="small"
            className={styles.iconStyle}
          />
        </LinkV2>
        <LinkV2
          color="blue400"
          underline="normal"
          underlineVisibility="always"
          newTab={true}
          href="https://island.is/einnota-hjalpartaeki"
        >
          <Text variant="small">
            {formatMessage(messages.supportProductsDescriptionInfo2)}
          </Text>

          <Icon
            aria-hidden="true"
            icon="open"
            type="outline"
            size="small"
            className={styles.iconStyle}
          />
        </LinkV2>
      </Inline>

      <Box marginTop={[2, 2, 5]}>
        <Box marginTop={2}>
          <Box marginBottom={[1, 1, 3]}>
            <Text variant="h3">
              {formatMessage(messages.mySupportProducts)}
            </Text>
          </Box>
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
                    {' '}
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

export default SupportProducts
