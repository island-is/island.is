import { useIntl } from 'react-intl'
import { ScrollView, View } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import { Input, InputRow, NavigationBarSheet } from '../../ui'
import { useGetFinanceStatusDetailsQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { testIDs } from '../../utils/test-ids'

const { useNavigationOptions } = createNavigationOptionHooks(() => ({
  topBar: {
    visible: false,
  },
}))

export const FinanceStatusDetailScreen: NavigationFunctionComponent<{
  chargeTypeId: string
  orgId: string
  index: string
}> = ({ componentId, chargeTypeId, orgId, index }) => {
  useNavigationOptions(componentId)
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
    <View style={{ flex: 1 }} testID={testIDs.SCREEN_FINANCE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({ id: 'financeDetail.title' })}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{ marginHorizontal: 16 }}
      />
      <ScrollView style={{ flex: 1 }}>
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
    </View>
  )
}
