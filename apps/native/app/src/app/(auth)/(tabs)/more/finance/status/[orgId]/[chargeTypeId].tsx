import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'

import { Input, InputRow, NavigationBarSheet } from '@/ui'
import { useGetFinanceStatusDetailsQuery } from '@/graphql/types/schema'
import { testIDs } from '@/utils/test-ids'

export default function FinanceStatusDetailScreen() {
  const { chargeTypeId, orgId, index } = useLocalSearchParams<{
    chargeTypeId: string
    orgId: string
    index: string
  }>()
  const intl = useIntl()
  const { loading, ...financeStatusDetails } = useGetFinanceStatusDetailsQuery({
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={{ flex: 1 }} testID={testIDs.SCREEN_FINANCE_DETAIL} stickyHeaderIndices={[0]}>
        <NavigationBarSheet
          title={intl.formatMessage({ id: 'financeDetail.title' })}
          onClosePress={() => router.back()}
          style={{ marginHorizontal: 16 }}
          showLoading={loading}
        />
        <View>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.paymentBase' })}
              value={item.chargeItemSubject}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.yearAndPeriod' })}
              value={item.timePeriod}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.dueDate' })}
              value={item.dueDate}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.finalDueDate' })}
              value={item.finalDueDate}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.principal' })}
              value={`${intl.formatNumber(item.principal)} kr.`}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.interest' })}
              value={`${intl.formatNumber(item.interest)} kr.`}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.costs' })}
              value={`${intl.formatNumber(item.cost)} kr.`}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.payments' })}
              value={`${intl.formatNumber(item.paid)} kr.`}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({ id: 'financeDetail.status' })}
              value={`${intl.formatNumber(item.totals)} kr.`}
            />
          </InputRow>
        </View>
      </ScrollView>
    </>
  )
}
