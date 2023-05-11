import { AidOrNutrition } from '@island.is/api/schema'
import {
  Box,
  Table as T,
  Text,
  Inline,
  Button,
  SkeletonLoader,
  Tabs,
  TabType,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  amountFormat,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { FC } from 'react'
import { useGetAidsAndNutritionQuery } from './AidsAndNutrition.generated'
import LinkButton from '../../components/LinkButton/LinkButton'

const AidsAndNutrition = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetAidsAndNutritionQuery()

  const supportData = {
    aids: data?.getRightsPortalAidsAndNutrition?.aids ?? [],
    nutrition: data?.getRightsPortalAidsAndNutrition?.nutrition ?? [],
  }

  const tabs = [
    supportData.aids.length > 0 && {
      label: formatMessage(messages.aids),
      content: <AidsAndNutritionTabsContent data={supportData.aids} />,
    },
    supportData.nutrition.length > 0 && {
      label: formatMessage(messages.nutrition),
      content: <AidsAndNutritionTabsContent data={supportData.nutrition} />,
    },
  ].filter((x) => x !== false) as TabType[]

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
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.aidsAndNutritionTitle)}
        intro={formatMessage(messages.aidsAndNutritionDescription)}
      />
      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !supportData.aids.length && !supportData.nutrition.length && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading && !error && tabs.length > 0 && (
        <Box>
          <Tabs
            label={formatMessage(messages.chooseAidsOrNutrition)}
            tabs={tabs}
            contentBackground="transparent"
            selected="0"
            size="xs"
          />
        </Box>
      )}
    </Box>
  )
}

interface Props {
  data: Array<AidOrNutrition>
}

const AidsAndNutritionTabsContent: FC<Props> = ({ data }) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const generateRow = (rowItem: AidOrNutrition) => {
    const DataRowWithYellow: FC = ({ children }) => {
      return (
        <T.Data
          box={{
            background: rowItem.expiring ? 'yellow300' : 'transparent',
          }}
        >
          <Text variant="medium">{children}</Text>
        </T.Data>
      )
    }

    const row = (
      <T.Row key={rowItem.id}>
        <DataRowWithYellow>{rowItem.name}</DataRowWithYellow>
        <DataRowWithYellow>{rowItem.maxUnitRefund}</DataRowWithYellow>
        <DataRowWithYellow>
          {rowItem.refund.type === 'amount'
            ? amountFormat(rowItem.refund.value)
            : `${rowItem.refund.value}%`}
        </DataRowWithYellow>
        <DataRowWithYellow>{rowItem.available}</DataRowWithYellow>
        <DataRowWithYellow>{rowItem.location}</DataRowWithYellow>
        <DataRowWithYellow />
      </T.Row>
    )

    return row
  }

  return (
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
          <T.Body>{data.map((rowItem) => generateRow(rowItem))}</T.Body>
        </T.Table>
      </Box>{' '}
      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {formatMessage(messages['aidsAndNutritionDisclaimer'])}
        </Text>
        {}
        <Inline space={3}>
          <LinkButton
            to="https://island.is/greidsluthatttaka-vegna-naeringar-og-serfaedis"
            text={formatMessage(messages.aidsAndNutritionDescriptionInfo1)}
          />
          <LinkButton
            to="https://island.is/einnota-hjalpartaeki"
            text={formatMessage(messages.aidsAndNutritionDescriptionInfo2)}
          />
        </Inline>
      </Box>
    </Box>
  )
}

export default AidsAndNutrition
