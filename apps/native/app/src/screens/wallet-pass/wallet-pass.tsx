import { useQuery } from '@apollo/client'
import {
  dynamicColor,
  Field,
  FieldCard,
  FieldGroup,
  FieldLabel,
  FieldRow,
  LicenceCard,
} from '@island.is/island-ui-native'
import React from 'react'
import {
  Button,
  Platform,
  SafeAreaView,
  View,
  ActivityIndicator,
  NativeModules,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import PassKit, { AddPassButton } from 'react-native-passkit-wallet'
import * as FileSystem from 'expo-file-system'
import styled, { useTheme } from 'styled-components/native'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { client } from '../../graphql/client'
import {
  GenericUserLicenseStatus,
  IGenericLicenseDataField,
  IGenericUserLicense,
} from '../../graphql/fragments/license.fragment'
import { GENERATE_PKPASS_MUTATION } from '../../graphql/queries/generate-pkpass.mutation'
import {
  GenericLicenseType,
  GetGenericLicenseInput,
  GetLicenseResponse,
  GET_GENERIC_LICENSE_QUERY,
} from '../../graphql/queries/get-license.query'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { LicenseStatus } from '../../types/license-type'
import { useState } from 'react'

const Information = styled.ScrollView`
  flex: 1;
  background-color: ${dynamicColor(({ theme }) => ({
    dark: theme.shades.dark.shade100,
    light: theme.color.blue100,
  }))};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: -70px;
  padding-top: 70px;
  z-index: 10;
`
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
`

const Spacer = styled.View`
  height: 150px;
`

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'walletPass.screenTitle' }),
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
)

const FieldRender = ({ data, level = 1 }: any) => {
  return (
    <>
      {(data || []).map(
        (
          { type, name, label, value, fields }: IGenericLicenseDataField,
          i: number,
        ) => {
          const key = `field-${type}-${i}`

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
                )
              } else {
                return <Field key={key} label={label} value={value} />
              }

            case 'Group':
              if (label) {
                return (
                  <View key={key} style={{ marginTop: 24, paddingBottom: 4 }}>
                    <FieldLabel>{label}</FieldLabel>
                    {FieldRender({ data: fields, level: 2 })}
                  </View>
                )
              }
              return (
                <FieldGroup key={key}>
                  <FieldRow>{FieldRender({ data: fields, level: 2 })}</FieldRow>
                </FieldGroup>
              )

            case 'Category':
              return (
                <FieldCard key={key} code={name} title="">
                  <FieldRow>{FieldRender({ data: fields, level: 3 })}</FieldRow>
                </FieldCard>
              )

            default:
              return <Field key={key} label={label} value={value} />
          }
        },
      )}
    </>
  )
}

export const WalletPassScreen: NavigationFunctionComponent<{
  id: string
  item?: any
}> = ({ id, item, componentId }) => {
  useNavigationOptions(componentId)
  const theme = useTheme()
  const licenseRes = useQuery<GetLicenseResponse, GetGenericLicenseInput>(
    GET_GENERIC_LICENSE_QUERY,
    {
      client,
      variables: {
        input: {
          licenseType: GenericLicenseType.DriversLicense,
        },
      },
    },
  )

  const [addingToWallet, setAddingToWallet] = useState(false)

  const data: IGenericUserLicense = {
    ...item,
    ...licenseRes.data?.genericLicense,
  }

  const onAddPkPass = async () => {
    const { canAddPasses, addPass } = Platform.select({
      ios: PassKit,
      android: NativeModules.IslandModule,
    })
    const canAddPass = await canAddPasses()
    if (canAddPass) {
      try {
        setAddingToWallet(true)
        const { data } = await client.mutate({
          mutation: GENERATE_PKPASS_MUTATION,
          variables: {
            input: {
              licenseType: GenericLicenseType.DriversLicense,
            },
          },
        })
        if (Platform.OS === 'android') {
          const pkPassUri =
            FileSystem.documentDirectory! + Date.now() + '.pkpass'
          await FileSystem.downloadAsync(
            data.generatePkPass.pkpassUrl,
            pkPassUri,
          )
          const pkPassContentUri = await FileSystem.getContentUriAsync(
            pkPassUri,
          )
          addPass(pkPassContentUri, 'com.snjallveskid')
          setAddingToWallet(false)
          return
        }
        const res = await fetch(data.generatePkPass.pkpassUrl)
        const blob = await res.blob()
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const passData = reader.result?.toString()!
          addPass(passData.substr(41), 'com.snjallveskid')
          setAddingToWallet(false)
        }
      } catch (err) {
        alert('Failed to fetch or add pass')
        setAddingToWallet(false)
        console.error(err)
      }
    } else {
      if (Platform.OS === 'android') {
        alert('You cannot add passes. Please make sure you have Snjallveskið installed on your device.')
      } else {
        alert('You cannot add passes on this device')
      }
    }
  }

  const fields = data?.payload?.data ?? []
  const hasPkpass = data?.license?.pkpass || false
  let hasValidPkpass = false


  // quick fix until this will be handled in api
  // fint out if licence was given out before 15 águst 1997 then it should not be possible to add licence to wallet

  try {
    const startDateForValidPkpass = Date.parse('1997-08-15T00:00:00')
    const parsedData = JSON.parse(data?.payload?.rawData)
    const issuedAt = parsedData?.utgafuDagsetning
    const hasImage = !!parsedData?.mynd?.id

    hasValidPkpass = Date.parse(issuedAt) > startDateForValidPkpass || hasImage;

  } catch (error) {
    // noop
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 140 }} />
      <Information contentInset={{ bottom: 162 }}>
        <SafeAreaView style={{ marginHorizontal: 16 }}>
          {!data?.payload?.data && licenseRes.loading ? (
            <ActivityIndicator
              size="large"
              color="#0061FF"
              style={{ marginTop: 32 }}
            />
          ) : (
            <FieldRender data={fields} />
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
        }}
      >
        <LicenceCard
          nativeID={`license-${data?.license?.type}_destination`}
          title={data?.license.type}
          type={data?.license.type as any}
          date={new Date(Number(data?.fetch.updated))}
          status={
            data.license.status === GenericUserLicenseStatus.HasLicense
              ? LicenseStatus.VALID
              : LicenseStatus.NOT_VALID
          }
          agencyLogo={agencyLogo}
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
          }}
        >
          {Platform.OS === 'ios' ? (
            <AddPassButton
              style={{ height: 52 }}
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
            style={{ marginTop: 32 }}
          />
        </LoadingOverlay>
      )}
    </View>
  )
}

WalletPassScreen.options = getNavigationOptions
