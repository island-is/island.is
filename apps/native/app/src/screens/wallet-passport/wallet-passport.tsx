import {useQuery} from '@apollo/client';
import {Alert, dynamicColor, Input, InputRow, LicenceCard} from '@ui';
import React from 'react';
import {useIntl} from 'react-intl';
import {Platform, SafeAreaView, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import styled from 'styled-components/native';
import {client} from '../../graphql/client';
import {GET_IDENTITY_DOCUMENT_QUERY} from '../../graphql/queries/get-identity-document.query';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {LicenseStatus, LicenseType} from '../../types/license-type';

const Information = styled.ScrollView`
  flex: 1;
  background-color: ${dynamicColor(({theme}) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue100,
  }))};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: -70px;
  padding-top: 70px;
  z-index: 10;
`;
const Spacer = styled.View`
  height: 150px;
`;

const {
  useNavigationOptions,
  getNavigationOptions,
} = createNavigationOptionHooks(
  (theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({id: 'walletPass.screenTitle'}),
      },
      noBorder: true,
    },
  }),
  {
    topBar: {
      rightButtons: [],
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
    },
  },
);
const capitalizeEveryWord = (s: string) => {
  if (typeof s !== 'string') return '';

  const arr = s.split(' ');

  const capitalized = arr.map(
    item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
  );

  const word = capitalized.join(' ');
  return word;
};

export const WalletPassportScreen: NavigationFunctionComponent<{
  id: string;
  cardHeight?: number;
}> = ({id, componentId, cardHeight = 140}) => {
  useNavigationOptions(componentId);

  const intl = useIntl();
  const {data, loading, error} = useQuery(GET_IDENTITY_DOCUMENT_QUERY, {
    client,
    fetchPolicy: 'cache-first',
  });

  const passportData = data?.getIdentityDocument;
  const item = passportData?.find((x: any) => x.number === id) || null;

  const isInvalid = item?.status?.toLowerCase() === 'invalid';
  const expireWarning = !!item?.expiresWithinNoticeTime;

  if (!item) return null;

  return (
    <View style={{flex: 1}}>
      <View style={{height: cardHeight}} />
      <Information contentInset={{bottom: 162}}>
        <SafeAreaView style={{marginHorizontal: 0}}>
          <View style={{paddingTop: 24, paddingHorizontal: 16}}>
            <Alert
              title={intl.formatMessage({id: 'walletPassport.infoTitle'})}
              message={intl.formatMessage({
                id: 'walletPassport.infoDescription',
              })}
              type="info"
              hasBorder
            />
          </View>

          {expireWarning ? (
            <View
              style={{paddingTop: 16, paddingHorizontal: 16, paddingBottom: 10}}
            >
              <Alert
                title={intl.formatMessage({id: 'walletPassport.warningTitle'})}
                message={intl.formatMessage({
                  id: 'walletPassport.warningDescription',
                })}
                type="warning"
                hasBorder
              />
            </View>
          ) : null}

          <InputRow>
            <Input
              label={intl.formatMessage({id: 'walletPassport.displayName'})}
              value={capitalizeEveryWord(
                `${item?.displayFirstName} ${item?.displayLastName}`,
              )}
              loading={loading}
              error={!!error}
              size="big"
              borderDark
            />
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({id: 'walletPassport.number'})}
              value={item?.numberWithType}
              loading={loading}
              error={!!error}
              noBorder
            />
          </InputRow>

          <InputRow>
            {item?.issuingDate ? (
              <Input
                label={intl.formatMessage({id: 'walletPassport.issuingDate'})}
                value={
                  item?.issuingDate
                    ? intl.formatDate(new Date(item?.issuingDate))
                    : '-'
                }
                loading={loading}
                error={!!error}
                noBorder
                isCompact
              />
            ) : null}
            {item?.expirationDate ? (
              <Input
                label={intl.formatMessage({
                  id: 'walletPassport.expirationDate',
                })}
                value={
                  item?.expirationDate
                    ? intl.formatDate(new Date(item?.expirationDate))
                    : '-'
                }
                loading={loading}
                error={!!error}
                isCompact
              />
            ) : null}
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({id: 'walletPassport.mrzName'})}
              value={`${item?.mrzLastName} ${item?.mrzFirstName}`}
              loading={loading}
              error={!!error}
            />
          </InputRow>
        </SafeAreaView>
        {Platform.OS === 'android' && <Spacer />}
      </Information>
      <SafeAreaView
        style={{
          marginTop: 16,
          marginHorizontal: 16,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <LicenceCard
          nativeID={`license-${LicenseType.PASSPORT}_destination`}
          type={LicenseType.PASSPORT}
          date={new Date(item?.expirationDate)}
          status={isInvalid ? LicenseStatus.NOT_VALID : LicenseStatus.VALID}
        />
      </SafeAreaView>
    </View>
  );
};

WalletPassportScreen.options = getNavigationOptions;
