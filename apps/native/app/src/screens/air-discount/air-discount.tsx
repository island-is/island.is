import {
  Alert,
  EmptyListSmall,
  Heading,
  Link,
  LinkText,
  Skeleton,
  Typography,
} from '@ui'
import React from 'react'
import { SafeAreaView, ScrollView, View, Image } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { FormattedMessage, useIntl } from 'react-intl'
import styled, { useTheme } from 'styled-components/native'

import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import {
  useGetAirDiscountFlightLegsQuery,
  useGetAirDiscountQuery,
} from '../../graphql/types/schema'
import { AirDiscountCard } from '@ui/lib/card/air-discount-card'
import { Bullet } from '@ui/lib/bullet/bullet'
import { AirfaresUsageTable } from './airfares-usage-table'
import illustrationSrc from '../../assets/illustrations/le_jobs_s5.png'

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
    <View>
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
    </View>
  )
}

const Empty = () => {
  const theme = useTheme()
  return (
    <View style={{ marginBottom: theme.spacing[4] }}>
      <EmptyListSmall
        title={
          <FormattedMessage
            id="airDiscount.emptyListTitle"
            defaultMessage="Enginn réttur"
          />
        }
        description={
          <FormattedMessage
            id="airDiscount.emptyListDescription"
            defaultMessage="Einungis íbúar landsbyggðarinnar sem eiga lögheimili fjarri höfuðborgarsvæðinu og eyjum eiga rétt á Loftbrú."
          />
        }
        image={
          <Image
            source={illustrationSrc}
            style={{ width: 224, height: 231 }}
            resizeMode="contain"
          />
        }
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

  const { data, loading, error } = useGetAirDiscountQuery({
    fetchPolicy: 'cache-and-network',
  })

  const {
    data: flightLegsData,
    loading: flightLegsLoading,
    error: flightLegsError,
  } = useGetAirDiscountFlightLegsQuery({
    fetchPolicy: 'cache-and-network',
  })

  const flightLegs = flightLegsData?.airDiscountSchemeUserAndRelationsFlights

  const connectionCodes = data?.airDiscountSchemeDiscounts?.filter(
    (discount) => discount.connectionDiscountCodes.length > 0,
  )

  const noRights =
    data?.airDiscountSchemeDiscounts?.filter(
      (item) => item.user.fund?.credit === 0 && item.user.fund.used === 0,
    ).length === data?.airDiscountSchemeDiscounts?.length

  return (
    <ScrollView style={{ flex: 1 }}>
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
              />
            </LinkText>
          </Link>
        </TOSLink>

        {(loading || flightLegsLoading) && !error && <SkeletonItem />}
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
                hasBorder={true}
              />
            </AlertWrapper>

            <Typography weight="600" style={{ marginBottom: theme.spacing[1] }}>
              <FormattedMessage
                id="airDiscount.myRights"
                defaultMessage="Mín réttindi"
              />
            </Typography>
            {data?.airDiscountSchemeDiscounts
              ?.filter(
                (discount) =>
                  !(
                    discount.user.fund?.used === 0 &&
                    discount.user.fund.credit === 0
                  ),
              )
              .map((discount) => {
                return (
                  <AirDiscountCard
                    key={`loftbru-item-${discount.discountCode}`}
                    name={discount.user.name}
                    code={discount.discountCode}
                    credit={discount.user.fund?.credit}
                    text={intl.formatMessage(
                      { id: 'airDiscount.remainingFares' },
                      {
                        remaining: discount.user.fund?.credit,
                        total: discount.user.fund?.total,
                      },
                    )}
                  />
                )
              })}
          </View>
        )}
        {connectionCodes && connectionCodes.length > 0 && (
          <View>
            <Typography weight="600" style={{ marginBottom: theme.spacing[1] }}>
              <FormattedMessage
                id="airDiscount.activeConnectionCodes"
                defaultMessage="Virkir afsláttarkóðar fyrir áframhaldandi flug"
              />
            </Typography>
            {connectionCodes.map((discount) => {
              return discount.connectionDiscountCodes.map((connectionCode) => {
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
              })
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
    </ScrollView>
  )
}

AirDiscountScreen.options = getNavigationOptions
