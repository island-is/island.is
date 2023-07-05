import {NavigationBarSheet, InputRow, Input} from '@ui';
import {useIntl} from 'react-intl';
import {ScrollView, Text, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {testIDs} from '../../utils/test-ids';

const {useNavigationOptions} = createNavigationOptionHooks(() => ({
  topBar: {
    visible: false,
  },
}));

export const FinanceStatusDetailScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();

  const item = {
    chargeItemSubject: '2804882329',
    timePeriod: '202307',
    estimate: false,
    dueDate: '01.07.2023',
    finalDueDate: '31.07.2023',
    principal: 13722,
    interest: 0,
    cost: 0,
    paid: 0,
    totals: 13722,
    dueTotals: 13722,
    documentID: '',
    payID: '',
  };

  const loading = false;
  const error = false;

  return (
    <View style={{flex: 1}} testID={testIDs.SCREEN_FINANCE_DETAIL}>
      <NavigationBarSheet
        componentId={componentId}
        title={intl.formatMessage({id: 'financeDetail.title'})}
        onClosePress={() => Navigation.dismissModal(componentId)}
        style={{marginHorizontal: 16}}
      />
      <ScrollView style={{flex: 1}}>
        <View>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.paymentBase'})}
              value={item.chargeItemSubject}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.yearAndPeriod'})}
              value={item.timePeriod}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.dueDate'})}
              value={item.dueDate}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.finalDueDate'})}
              value={item.finalDueDate}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.principal'})}
              value={String(item.principal) + ' kr.'}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.interest'})}
              value={String(item.interest) + ' kr.'}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.costs'})}
              value={String(item.cost) + ' kr.'}
            />
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.payments'})}
              value={String(item.paid) + ' kr.'}
            />
          </InputRow>
          <InputRow>
            <Input
              loading={loading}
              error={error}
              label={intl.formatMessage({id: 'financeDetail.status'})}
              value={String(item.totals) + ' kr.'}
            />
          </InputRow>
        </View>
      </ScrollView>
    </View>
  );
};
