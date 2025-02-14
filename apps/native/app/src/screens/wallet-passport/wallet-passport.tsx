import React from 'react'
import { useIntl } from 'react-intl'
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'

import {
  Accordion,
  AccordionItem,
  Alert,
  CustomLicenseType,
  dynamicColor,
  font,
  LicenseCard,
  LinkText,
  theme,
} from '../../ui'
import IconStatusVerified from '../../assets/icons/valid.png'
import IconStatusNonVerified from '../../assets/icons/warning.png'
import {
  GenericLicenseType,
  useListLicensesQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useBrowser } from '../../lib/use-browser'
import { useLocale } from '../../hooks/use-locale'
import { FieldRender } from '../wallet-pass/components/field-render'

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
const Spacer = styled.View`
  height: 150px;
`

const Label = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontSize: 13,
    lineHeight: 17,
  })}
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
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

export const WalletPassportScreen: NavigationFunctionComponent<{
  id: string
  cardHeight?: number
}> = ({ id, componentId, cardHeight = 140 }) => {
  useNavigationOptions(componentId)
  useConnectivityIndicator({ componentId })
  const { openBrowser } = useBrowser()

  const intl = useIntl()
  const { data, loading, error } = useListLicensesQuery({
    variables: {
      input: {
        includedTypes: [GenericLicenseType.Passport],
      },
      locale: useLocale(),
    },
  })

  const passportData = data?.genericLicenseCollection?.licenses
  const item =
    passportData?.find(
      (passport) => passport.payload?.metadata?.licenseNumber === id,
    ) || null

  const childrenPassport =
    passportData?.filter((passport) => passport.isOwnerChildOfUser) ?? []

  const isInvalid = item?.payload?.metadata?.expired
  const expireDate = item?.payload?.metadata?.expireDate
  const expireWarning = false //!!item?.expiresWithinNoticeTime

  if (!item) return null

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: cardHeight }} />
      <Information contentInset={{ bottom: 162 }}>
        <SafeAreaView
          style={{ marginHorizontal: 0, paddingHorizontal: theme.spacing[2] }}
        >
          <View
            style={{
              paddingTop: theme.spacing[5],
            }}
          >
            <Alert
              title={intl.formatMessage({ id: 'walletPassport.infoTitle' })}
              message={intl.formatMessage({
                id: 'walletPassport.infoDescription',
              })}
              type="info"
              hasBorder
            />
          </View>

          {expireWarning ? (
            <View
              style={{
                paddingTop: theme.spacing[2],
                paddingHorizontal: theme.spacing[2],
                paddingBottom: 10,
              }}
            >
              <Alert
                title={intl.formatMessage({
                  id: 'walletPassport.warningTitle',
                })}
                message={intl.formatMessage({
                  id: 'walletPassport.warningDescription',
                })}
                type="warning"
                hasBorder
              />
            </View>
          ) : null}

          {!item?.payload?.data && loading ? (
            <ActivityIndicator
              size="large"
              color="#0061FF"
              style={{ marginTop: theme.spacing[4] }}
            />
          ) : item?.payload?.data ? (
            <FieldRender
              data={item?.payload?.data}
              licenseType={GenericLicenseType.Passport}
            />
          ) : null}

          {childrenPassport?.length > 0 ? (
            <View style={{ marginTop: theme.spacing[3] }}>
              <Label>
                {intl.formatMessage({ id: 'walletPassport.children' })}
              </Label>
              <Accordion>
                {childrenPassport?.map((child, index) => {
                  const isInvalid = child.payload?.metadata?.expired
                  const childName = child.payload?.data?.find(
                    (field) => field.label === 'Nafn einstaklings',
                  )?.value
                  const fieldsWithoutName = child.payload?.data?.filter(
                    (field) => field.label !== 'Nafn einstaklings',
                  )
                  const noPassport = child?.payload?.data?.length === 0
                  return (
                    <AccordionItem
                      key={index}
                      title={childName ?? '-'}
                      icon={
                        <Image
                          source={
                            isInvalid
                              ? IconStatusNonVerified
                              : IconStatusVerified
                          }
                          style={{ width: 24, height: 24 }}
                          resizeMode="contain"
                        />
                      }
                    >
                      <View style={{ paddingHorizontal: theme.spacing[2] }}>
                        {noPassport ? (
                          <View
                            style={{
                              marginVertical: 16,
                              paddingHorizontal: 16,
                            }}
                          >
                            <Label>
                              {intl.formatMessage({
                                id: 'walletPassport.noPassport',
                              })}
                            </Label>
                            <TouchableOpacity
                              style={{ flexWrap: 'wrap' }}
                              onPress={() =>
                                openBrowser(
                                  `https://island.is/vegabref`,
                                  componentId,
                                )
                              }
                            >
                              <LinkText>
                                {intl.formatMessage({
                                  id: 'walletPassport.noPassportLink',
                                })}
                              </LinkText>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <FieldRender
                            data={fieldsWithoutName}
                            licenseType={GenericLicenseType.Passport}
                            compact={true}
                          />
                        )}
                      </View>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </View>
          ) : null}
        </SafeAreaView>
        {Platform.OS === 'android' && <Spacer />}
      </Information>
      <SafeAreaView
        style={{
          marginTop: theme.spacing[2],
          marginHorizontal: theme.spacing[2],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <LicenseCard
          nativeID={`license-${CustomLicenseType.Passport}_destination`}
          type={CustomLicenseType.Passport}
          date={expireDate ? new Date(expireDate) : undefined}
          status={isInvalid ? 'NOT_VALID' : 'VALID'}
        />
      </SafeAreaView>
    </View>
  )
}

WalletPassportScreen.options = getNavigationOptions
