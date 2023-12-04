import {
  Accordion,
  AccordionItem,
  Alert,
  dynamicColor,
  font,
  Input,
  InputRow,
  LicenceCard,
  LinkText,
} from '@ui'
import React from 'react'
import { useIntl } from 'react-intl'
import {
  Image,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled from 'styled-components/native'
import IconStatusVerified from '../../assets/icons/valid.png'
import IconStatusNonVerified from '../../assets/icons/warning.png'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import { useGetIdentityDocumentQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { openBrowser } from '../../lib/rn-island'
import { LicenseStatus, LicenseType } from '../../types/license-type'

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
const capitalizeEveryWord = (s: string) => {
  if (typeof s !== 'string') return ''

  const arr = s.split(' ')

  const capitalized = arr.map(
    (item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
  )

  const word = capitalized.join(' ')
  return word
}

export const WalletPassportScreen: NavigationFunctionComponent<{
  id: string
  cardHeight?: number
}> = ({ id, componentId, cardHeight = 140 }) => {
  useNavigationOptions(componentId)

  const showChildrenPassport = useFeatureFlag(
    'isChildrenPassportEnabled',
    false,
  )

  const intl = useIntl()
  const { data, loading, error } = useGetIdentityDocumentQuery({
    fetchPolicy: 'cache-first',
  })

  const passportData = data?.getIdentityDocument
  const item = passportData?.find((x) => x.number === id) || null

  const childrenPassport = data?.getIdentityDocumentChildren ?? []

  const isInvalid = item?.status?.toLowerCase() === 'invalid'
  const expireWarning = !!item?.expiresWithinNoticeTime

  if (!item) return null

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: cardHeight }} />
      <Information contentInset={{ bottom: 162 }}>
        <SafeAreaView style={{ marginHorizontal: 0 }}>
          <View style={{ paddingTop: 24, paddingHorizontal: 16 }}>
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
                paddingTop: 16,
                paddingHorizontal: 16,
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

          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'walletPassport.displayName' })}
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
              label={intl.formatMessage({ id: 'walletPassport.number' })}
              value={item?.numberWithType}
              loading={loading}
              error={!!error}
              noBorder
              copy
            />
          </InputRow>

          <InputRow>
            {item?.issuingDate ? (
              <Input
                label={intl.formatMessage({ id: 'walletPassport.issuingDate' })}
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
                noBorder
                isCompact
              />
            ) : null}
          </InputRow>

          <InputRow>
            <Input
              label={intl.formatMessage({ id: 'walletPassport.mrzName' })}
              value={`${item?.mrzLastName} ${item?.mrzFirstName}`}
              loading={loading}
              noBorder
              error={!!error}
            />
          </InputRow>

          {showChildrenPassport && childrenPassport?.length > 0 ? (
            <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
              <Label>
                {intl.formatMessage({ id: 'walletPassport.children' })}
              </Label>
              <Accordion>
                {childrenPassport?.map((child) => {
                  const isInvalid =
                    child?.passports?.some(
                      (p) => p.status?.toLowerCase() === 'invalid',
                    ) || child?.passports?.length === 0
                  const noPassport = child?.passports?.length === 0
                  return (
                    <AccordionItem
                      key={child.childNationalId}
                      title={child?.childName ?? '-'}
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
                      <View>
                        {child.passports?.map((passport) => {
                          return (
                            <View key={passport.number}>
                              <InputRow>
                                <Input
                                  label={intl.formatMessage({
                                    id: 'walletPassport.number',
                                  })}
                                  value={passport?.numberWithType}
                                  loading={loading}
                                  error={!!error}
                                  noBorder
                                  isCompact
                                  copy
                                />
                              </InputRow>

                              <InputRow>
                                {passport?.issuingDate ? (
                                  <Input
                                    label={intl.formatMessage({
                                      id: 'walletPassport.issuingDate',
                                    })}
                                    value={
                                      passport?.issuingDate
                                        ? intl.formatDate(
                                            new Date(passport?.issuingDate),
                                          )
                                        : '-'
                                    }
                                    loading={loading}
                                    error={!!error}
                                    noBorder
                                    isCompact
                                  />
                                ) : null}
                                {passport?.expirationDate ? (
                                  <Input
                                    label={intl.formatMessage({
                                      id: 'walletPassport.expirationDate',
                                    })}
                                    value={
                                      passport?.expirationDate
                                        ? intl.formatDate(
                                            new Date(passport?.expirationDate),
                                          )
                                        : '-'
                                    }
                                    loading={loading}
                                    error={!!error}
                                    noBorder
                                    isCompact
                                  />
                                ) : null}
                              </InputRow>

                              <InputRow>
                                <Input
                                  label={intl.formatMessage({
                                    id: 'walletPassport.mrzName',
                                  })}
                                  value={`${passport?.mrzLastName} ${passport?.mrzFirstName}`}
                                  loading={loading}
                                  error={!!error}
                                  noBorder
                                  isCompact
                                />
                              </InputRow>
                            </View>
                          )
                        })}
                        {noPassport && (
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
  )
}

WalletPassportScreen.options = getNavigationOptions
