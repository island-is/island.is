import React, { useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Animated, Image, SafeAreaView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components/native'

import externalLinkIcon from '../../assets/icons/external-link.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { useConfig } from '../../config'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  useGetAirDiscountFlightLegsQuery,
  useGetAirDiscountQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import {
  AirDiscountCard,
  Alert,
  Bullet,
  Heading,
  Link,
  LinkText,
  Problem,
  Skeleton,
  TopLine,
  Typography,
} from '../../ui'
import { AirfaresUsageTable } from './airfares-usage-table'

const BulletList = styled.View`
  margin-vertical: 12px;
`

const TOSLink = styled.View`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const AlertWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  margin-bottom: ${({ theme }) => theme.spacing[3]}px;
`
const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'airDiscount.screenTitle' }),
      },
    },
  }))

const SkeletonItem = () => {
  const theme = useTheme()
  return (
    <Skeleton
      active
      backgroundColor={{
        dark: theme.shades.dark.shade300,
        light: theme.color.blue100,
      }}
      overlayColor={{
        dark: theme.shades.dark.shade200,
        light: theme.color.blue200,
      }}
      overlayOpacity={1}
      height={104}
      style={{
        borderRadius: 16,
        marginBottom: theme.spacing[2],
      }}
    />
  )
}

const Empty = () => {
  const theme = useTheme()
  const intl = useIntl()
  return (
    <View style={{ marginBottom: theme.spacing[4] }}>
      <Problem
        type="no_data"
        title={intl.formatMessage({ id: 'airDiscount.emptyListTitle' })}
        message={intl.formatMessage({ id: 'airDiscount.emptyListDescription' })}
      />
    </View>
  )
}

const Disabled = ({ componentId }: { componentId: string }) => {
  const intl = useIntl()
  const theme = useTheme()
  const config = useConfig()

  return (
    <View
      style={{
        margin: theme.spacing[2],
      }}
    >
      <Problem
        type="no_data"
        title={intl.formatMessage({ id: 'airDiscount.disabledTitle' })}
        message={intl.formatMessage({ id: 'airDiscount.disabledDescription' })}
        detailLink={{
          text: intl.formatMessage({ id: 'button.moreInfoHere' }),
          url: `${config.apiUrl.replace(/api$/, '')}minarsidur/loftbru`,
          componentId: componentId,
        }}
      />
    </View>
  )
}

export const AirDiscountScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)

  const intl = useIntl()
  const theme = useTheme()
  const scrollY = useRef(new Animated.Value(0)).current

  const ffIsAppAirDiscountPageDisabled = useFeatureFlag(
    'isAppAirDiscountPageDisabled',
    false,
  )

  const { data, loading, error } = useGetAirDiscountQuery({
    fetchPolicy: 'network-only',
  })

  const airDiscountFlightLegsRes = useGetAirDiscountFlightLegsQuery()

  useConnectivityIndicator({
    componentId,
    queryResult: airDiscountFlightLegsRes,
  })

  const flightLegs =
    airDiscountFlightLegsRes.data?.airDiscountSchemeUserAndRelationsFlights

  const connectionCodes = data?.airDiscountSchemeDiscounts?.filter(
    (discount) => discount.connectionDiscountCodes.length > 0,
  )

  const noRights =
    data?.airDiscountSchemeDiscounts?.filter(
      (item) => item.user.fund?.credit === 0 && item.user.fund.used === 0,
    ).length === data?.airDiscountSchemeDiscounts?.length

  if (ffIsAppAirDiscountPageDisabled) {
    return <Disabled componentId={componentId} />
  }

  return (
    <>
      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
      >
        <SafeAreaView style={{ marginHorizontal: theme.spacing[2] }}>
          <Heading>
            <FormattedMessage
              id="airDiscount.headingTitle"
              defaultMessage="Lægra fargjald með loftbrú"
            />
          </Heading>
          <Typography>
            <FormattedMessage
              id="airDiscount.headingSubtitle"
              defaultMessage="Hver einstaklingur með lögheimili innan skilgreinds svæðis á rétt á afslætti á sex flugleggjum á ári. með notkun afsláttar með Loftbrú staðfestir þú að hafa lesið notendaskilmála Loftbrúar."
            />
          </Typography>
          <BulletList>
            <Bullet>
              <FormattedMessage
                id="airDiscount.bulletPointDiscount"
                defaultMessage="Hver afsláttur nemur 40% af flugfargjaldi."
              />
            </Bullet>
            <Bullet>
              <FormattedMessage
                id="airDiscount.bulletPointUsage"
                defaultMessage="Kóðinn virkjar afslátt í bókunarvél félagsins."
              />
            </Bullet>
          </BulletList>
          <TOSLink>
            <Link
              url={
                'https://island.is/loftbru/notendaskilmalar-vegagerdarinnar-fyrir-loftbru'
              }
            >
              <LinkText>
                <FormattedMessage
                  id="airDiscount.tosLinkText"
                  defaultMessage="Notendaskilmálar"
                />{' '}
                <Image source={externalLinkIcon} />
              </LinkText>
            </Link>
          </TOSLink>

          {(loading || airDiscountFlightLegsRes.loading) && !error && (
            <SkeletonItem />
          )}
          {!loading && !error && noRights && <Empty />}

          {data && !noRights && (
            <View>
              <AlertWrapper>
                <Alert
                  type="warning"
                  title={intl.formatMessage({ id: 'airDiscount.alertTitle' })}
                  message={intl.formatMessage({
                    id: 'airDiscount.alertDescription',
                  })}
                  hasBorder
                />
              </AlertWrapper>

              <Typography
                weight="600"
                style={{ marginBottom: theme.spacing[1] }}
              >
                <FormattedMessage
                  id="airDiscount.myRights"
                  defaultMessage="Mín réttindi"
                />
              </Typography>
              {data?.airDiscountSchemeDiscounts
                ?.filter(
                  ({ user }) =>
                    !(user.fund?.used === 0 && user.fund.credit === 0),
                )
                .map(({ discountCode, user }) => (
                  <AirDiscountCard
                    key={`loftbru-item-${discountCode}`}
                    name={user.name}
                    code={discountCode}
                    credit={user.fund?.credit}
                    text={intl.formatMessage(
                      { id: 'airDiscount.remainingFares' },
                      {
                        remaining: user.fund?.credit,
                        total: user.fund?.total,
                      },
                    )}
                  />
                ))}
            </View>
          )}
          {connectionCodes && connectionCodes.length > 0 && (
            <View>
              <Typography
                weight="600"
                style={{ marginBottom: theme.spacing[1] }}
              >
                <FormattedMessage
                  id="airDiscount.activeConnectionCodes"
                  defaultMessage="Virkir afsláttarkóðar fyrir áframhaldandi flug"
                />
              </Typography>
              {connectionCodes.map((discount) => {
                return discount.connectionDiscountCodes.map(
                  (connectionCode) => {
                    return (
                      <AirDiscountCard
                        key={`loftbru-connection-${connectionCode.code}`}
                        name={discount.user.name}
                        code={connectionCode.code}
                        validUntil={connectionCode.validUntil}
                        text={intl.formatMessage(
                          { id: 'airDiscount.flight' },
                          { flight: connectionCode.flightDesc },
                        )}
                      />
                    )
                  },
                )
              })}
            </View>
          )}
        </SafeAreaView>

        {flightLegs && flightLegs.length > 0 && (
          <View
            style={{
              marginTop: theme.spacing[4],
            }}
          >
            <Typography
              weight="600"
              style={{
                marginBottom: theme.spacing[2],
                marginHorizontal: theme.spacing[2],
              }}
            >
              <FormattedMessage
                id="airDiscount.airfaresUsage"
                defaultMessage="Notkun á núverandi tímabili"
              />
            </Typography>
            <AirfaresUsageTable data={flightLegs} />
          </View>
        )}
      </Animated.ScrollView>
      <TopLine scrollY={scrollY} />
      <BottomTabsIndicator index={4} total={5} />
    </>
  )
}

AirDiscountScreen.options = getNavigationOptions
