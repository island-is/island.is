import {useQuery} from '@apollo/client';
import {
  dynamicColor,
  Field,
  FieldCard,
  FieldGroup,
  FieldLabel,
  FieldRow,
  LicenceCard,
  LicenseCardType,
} from '@ui';
import React from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  View,
  ActivityIndicator,
  NativeModules,
  Alert,
  Linking,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import PassKit, {AddPassButton} from 'react-native-passkit-wallet';
import * as FileSystem from 'expo-file-system';
import styled, {useTheme} from 'styled-components/native';
import {client} from '../../graphql/client';
import {
  GenericUserLicenseStatus,
  IGenericLicenseDataField,
  GenericUserLicensePkPassStatus,
  IGenericUserLicense,
} from '../../graphql/fragments/license.fragment';
import {GENERATE_PKPASS_MUTATION} from '../../graphql/queries/generate-pkpass.mutation';
import {
  GenericLicenseType,
  GetGenericLicenseInput,
  GetLicenseResponse,
  GET_GENERIC_LICENSE_QUERY,
} from '../../graphql/queries/get-license.query';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {LicenseStatus} from '../../types/license-type';
import {useState} from 'react';
import {useIntl} from 'react-intl';

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
const LoadingOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;

  background-color: #000;
  opacity: 0.25;
  width: 100%;
  height: 100%;
`;

const Spacer = styled.View`
  height: 150px;
`;

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks(
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

const FieldRender = ({data, level = 1, licenseType}: any) => {
  return (
    <>
      {(data || []).map(
        (
          {type, name, label, value, fields}: IGenericLicenseDataField,
          i: number,
        ) => {
          const key = `field-${type}-${i}`;

          switch (type) {
            case 'Value':
              if (level === 1) {
                return (
                  <FieldGroup key={key}>
                    <FieldRow>
                      <Field
                        size={i === 0 ? 'large' : 'small'}
                        label={label}
                        value={value}
                      />
                    </FieldRow>
                  </FieldGroup>
                );
              } else {
                return <Field key={key} label={label} value={value} compact />;
              }

            case 'Group':
              if (label) {
                return (
                  <View key={key} style={{marginTop: 24, paddingBottom: 4}}>
                    <FieldLabel>{label}</FieldLabel>
                    {FieldRender({
                      data: fields,
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </View>
                );
              }
              return (
                <FieldGroup key={key}>
                  <FieldRow>
                    {FieldRender({
                      data: fields,
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </FieldRow>
                </FieldGroup>
              );

            case 'Category':
              return (
                <FieldCard
                  key={key}
                  code={name}
                  title={label}
                  type={licenseType}
                  hasFields={!!fields}>
                  <FieldRow>
                    {FieldRender({
                      data: fields,
                      level: 3,
                      licenseType: licenseType,
                    })}
                  </FieldRow>
                </FieldCard>
              );

            default:
              return <Field key={key} label={label} value={value} />;
          }
        },
      )}
    </>
  );
};

export const WalletPassScreen: NavigationFunctionComponent<{
  id: string;
  item?: any;
  cardHeight?: number;
}> = ({id, item, componentId, cardHeight = 140}) => {
  useNavigationOptions(componentId);
  const theme = useTheme();
  const intl = useIntl();
  const licenseRes = useQuery<GetLicenseResponse, GetGenericLicenseInput>(
    GET_GENERIC_LICENSE_QUERY,
    {
      client,
      variables: {
        input: {
          licenseType: item?.license?.type,
        },
      },
    },
  );

  const [addingToWallet, setAddingToWallet] = useState(false);

  const data: IGenericUserLicense = {
    ...item,
    ...licenseRes.data?.genericLicense,
  };

  const onAddPkPass = async () => {
    const {canAddPasses, addPass} = Platform.select({
      ios: PassKit,
      android: NativeModules.IslandModule,
    });

    const canAddPass = await canAddPasses();

    if (canAddPass || Platform.OS === 'android') {
      try {
        setAddingToWallet(true);
        const {data} = await client.mutate({
          mutation: GENERATE_PKPASS_MUTATION,
          variables: {
            input: {
              licenseType: item?.license?.type,
            },
          },
        });
        if (Platform.OS === 'android') {
          const pkPassUri =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            FileSystem.documentDirectory! + Date.now() + '.pkpass';

          await FileSystem.downloadAsync(
            data.generatePkPass.pkpassUrl,
            pkPassUri,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
              },
            },
          );
          const pkPassContentUri = await FileSystem.getContentUriAsync(
            pkPassUri,
          );

          addPass(pkPassContentUri, 'com.snjallveskid').catch(() => {
            if (!canAddPass) {
              Alert.alert(
                'Villa',
                'You cannot add passes. Please make sure you have Smartwallet installed on your device.',
              );
            } else {
              Alert.alert('Villa', 'Failed to fetch or add pass');
            }
          });
          setAddingToWallet(false);
          return;
        }
        const res = await fetch(data.generatePkPass.pkpassUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
          },
        });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const passData = reader.result?.toString();
          if (passData) {
            if (passData.includes('text/html')) {
              throw new Error('Pass has expired');
            }
            addPass(passData.substr(41), 'com.snjallveskid');
          }
          setAddingToWallet(false);
        };
      } catch (err) {
        if (!canAddPass) {
          Alert.alert(
            'You cannot add passes. Please make sure you have Smartwallet installed on your device.',
          );
        } else {
          Alert.alert(
            intl.formatMessage({
              id: 'walletPass.errorTitle',
            }),
            item?.license?.type === 'DriversLicense'
              ? intl.formatMessage({
                  id: 'walletPass.errorNotPossibleToAddDriverLicense',
                })
              : 'Failed to fetch or add pass',
            item?.license?.type === 'DriversLicense'
              ? [
                  {
                    text: intl.formatMessage({
                      id: 'walletPass.moreInfo',
                    }),
                    onPress: () =>
                      Linking.openURL('https://island.is/okuskirteini'),
                  },

                  {
                    text: intl.formatMessage({
                      id: 'walletPass.alertClose',
                    }),
                    style: 'cancel',
                  },
                ]
              : [],
          );
        }
        setAddingToWallet(false);
        console.error(err);
      }
    } else {
      Alert.alert('You cannot add passes on this device');
    }
  };

  const fields = data?.payload?.data ?? [];
  const hasPkpass = data?.license?.pkpass;
  const hasValidPkpass =
    data?.license?.pkpassStatus === GenericUserLicensePkPassStatus.Available;
  // this is coming soon.. disable add button if not true.
  // const hasValidatedPkpass = data?.license?.pkpassValidation;

  return (
    <View style={{flex: 1}}>
      <View style={{height: cardHeight}} />
      <Information contentInset={{bottom: 162}}>
        <SafeAreaView style={{marginHorizontal: 16}}>
          {!data?.payload?.data && licenseRes.loading ? (
            <ActivityIndicator
              size="large"
              color="#0061FF"
              style={{marginTop: 32}}
            />
          ) : (
            <FieldRender data={fields} licenseType={data?.license?.type} />
          )}
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
        }}>
        <LicenceCard
          nativeID={`license-${data?.license?.type}_destination`}
          type={data?.license?.type as LicenseCardType}
          date={new Date(Number(data?.fetch?.updated))}
          status={
            !data.payload?.metadata?.expired
              ? LicenseStatus.VALID
              : LicenseStatus.NOT_VALID
          }
        />
      </SafeAreaView>
      {hasPkpass && hasValidPkpass && (
        <SafeAreaView
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            marginHorizontal: 16,
            zIndex: 100,
          }}>
          {Platform.OS === 'ios' ? (
            <AddPassButton
              style={{height: 52}}
              addPassButtonStyle={
                theme.isDark
                  ? PassKit.AddPassButtonStyle.blackOutline
                  : PassKit.AddPassButtonStyle.black
              }
              onPress={onAddPkPass}
            />
          ) : (
            <Button
              title="Add to Wallet"
              onPress={onAddPkPass}
              color="#111111"
            />
          )}
        </SafeAreaView>
      )}
      {addingToWallet && (
        <LoadingOverlay>
          <ActivityIndicator
            size="large"
            color="#0061FF"
            style={{marginTop: 32}}
          />
        </LoadingOverlay>
      )}
    </View>
  );
};

WalletPassScreen.options = getNavigationOptions;
