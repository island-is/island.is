import {useQuery} from '@apollo/client';
import {Text} from 'react-native';
import {client} from '../../graphql/client';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {GET_FINANCE_STATUS} from '../../graphql/queries/get-finance-status.query';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';

const {
  useNavigationOptions,
  getNavigationOptions,
} = createNavigationOptionHooks(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({id: 'finance.screenTitle'}),
      },
    },
  }),
  {
    topBar: {
      largeTitle: {
        visible: true,
      },
      scrollEdgeAppearance: {
        active: true,
        noBorder: true,
      },
    },
  },
);

export const FinanceScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const query = useQuery(GET_FINANCE_STATUS, {
    client,
  });
  console.log(query.data);

  return <Text>Finance</Text>;
};

FinanceScreen.options = getNavigationOptions;
