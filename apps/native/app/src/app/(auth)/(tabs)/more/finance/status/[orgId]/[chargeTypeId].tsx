import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'

import { InfoLine, InfoLineRow } from '@/ui'
import { useGetFinanceStatusDetailsQuery } from '@/graphql/types/schema'
import { testIDs } from '@/utils/test-ids'
import { StackScreen } from '../../../../../../../components/stack-screen'

export default function FinanceStatusDetailScreen() {
  const { chargeTypeId, orgId, index } = useLocalSearchParams<{
    chargeTypeId: string
    orgId: string
    index: string
  }>()
  const intl = useIntl()
  const { loading, networkStatus, ...financeStatusDetails } =
    useGetFinanceStatusDetailsQuery({
      variables: {
        input: {
          orgID: orgId,
          chargeTypeID: chargeTypeId,
        },
      },
    })
  const error = !!financeStatusDetails.error
  const item =
    financeStatusDetails.data?.getFinanceStatusDetails.chargeItemSubjects[
      Number(index)
    ]

  if (!item) {
    return null
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      testID={testIDs.SCREEN_FINANCE_DETAIL}
      stickyHeaderIndices={[0]}
    >
      <StackScreen
        options={{
          title: intl.formatMessage({ id: 'financeDetail.title' }),
        }}
        networkStatus={networkStatus}
        closeable
      />
      <View>
        <InfoLineRow>
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.paymentBase' })}
            value={item.chargeItemSubject}
          />
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.yearAndPeriod' })}
            value={item.timePeriod}
          />
        </InfoLineRow>
        <InfoLineRow>
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.dueDate' })}
            value={item.dueDate}
          />
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.finalDueDate' })}
            value={item.finalDueDate}
          />
        </InfoLineRow>
        <InfoLineRow>
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.principal' })}
            value={`${intl.formatNumber(item.principal)} kr.`}
          />
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.interest' })}
            value={`${intl.formatNumber(item.interest)} kr.`}
          />
        </InfoLineRow>
        <InfoLineRow>
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.costs' })}
            value={`${intl.formatNumber(item.cost)} kr.`}
          />
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.payments' })}
            value={`${intl.formatNumber(item.paid)} kr.`}
          />
        </InfoLineRow>
        <InfoLineRow>
          <InfoLine
            loading={loading}
            error={error}
            label={intl.formatMessage({ id: 'financeDetail.status' })}
            value={`${intl.formatNumber(item.totals)} kr.`}
          />
        </InfoLineRow>
      </View>
    </ScrollView>
  )
}
