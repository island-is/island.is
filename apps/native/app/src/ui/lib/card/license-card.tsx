import React from 'react'
import { FormattedDate, FormattedTime, useIntl } from 'react-intl'
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { ApolloError } from '@apollo/client'

import { Barcode } from '../barcode/barcode'
import { Skeleton } from '../skeleton/skeleton'
import { ExpirationProgressBar } from '../../../components/progress-bar/expiration-progress-bar'
import { GenericLicenseType } from '../../../graphql/types/schema'
import { isString } from '../../../utils/is-string'
import IconStatusNonVerified from '../../assets/card/danger.png'
import IconStatusVerified from '../../assets/card/is-verified.png'
import { LicenseCardPresets } from './license-list-card'
import { dynamicColor } from '../../utils/dynamic-color'
import { Typography } from '../typography/typography'
import { screenWidth } from '../../../utils/dimensions'
import { BARCODE_MAX_WIDTH } from '@/constants/wallet.constants'
import {
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'

const Host = styled(Animated.View)`
  position: relative;
  min-height: 104px;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-radius: ${({ theme }) => theme.border.radius.extraLarge};
  overflow: hidden;
  justify-content: center;
`

const ContentContainer = styled.View<{ marginBottom: number }>`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`

const BarcodeWrapper = styled.View<{ minHeight?: number }>`
  flex: 1;
  border-radius: ${({ theme }) => theme.border.radius.large};
  min-height: ${({ minHeight }) => minHeight}px;
  max-width: ${BARCODE_MAX_WIDTH}px;
  overflow: hidden;
`

const BarcodeContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => theme.spacing.smallGutter}px;
  align-items: center;
  justify-content: center;
`

const ProgressBarContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
`

const BackgroundImage = styled.ImageBackground<{ color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  flex: 1;
  background-color: ${dynamicColor((props) => props.color)};
`

const Content = styled.View`
  flex-shrink: 1;
  justify-content: center;
`

const Base64Image = styled.Image`
  height: 72px;
  width: 64px;
  align-self: flex-end;
  border-radius: ${({ theme: { border } }) => border.radius.large};
`

const Title = styled(Typography)<{ color: string }>`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;
`

const ValidationWrap = styled.View`
  display: flex;
  flex-flow: row;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const OfflineMessage = styled(Typography)`
  padding: ${({ theme }) => theme.spacing[3]}px;
  text-align: center;
  max-width: 95%;
`

const ImgWrap = styled.View`
  flex-shrink: 0;
  align-content: center;
  justify-content: center;
  height: 72px;
  width: 72px;
`

interface LicenseCardProps {
  status: 'VALID' | 'NOT_VALID'
  title?: string
  date?: Date | string
  nativeID?: string
  style?: StyleProp<ViewStyle>
  type?: GenericLicenseType
  logo?: ImageSourcePropType | string
  backgroundImage?: ImageSourcePropType
  backgroundColor?: string
  showBarcodeOfflineMessage?: boolean
  allowLicenseBarcode?: boolean
  loading?: boolean
  error?: ApolloError
  barcode?: {
    value?: string | null
    loading?: boolean
    expirationTime?: Date
    expirationTimeCallback?(): void
    width: number
    height: number
  }
}

export function LicenseCard({
  nativeID,
  style,
  date,
  status,
  type,
  barcode,
  showBarcodeOfflineMessage,
  allowLicenseBarcode,
  loading,
  error,
  ...props
}: LicenseCardProps) {
  const theme = useTheme()
  const intl = useIntl()
  const preset = type
    ? LicenseCardPresets[type]
    : LicenseCardPresets.DriversLicense
  const title = props.title ?? preset?.title
  const isTablet = screenWidth > 760
  const logo = props.logo ?? preset?.logo
  const backgroundImage = props.backgroundImage ?? preset?.backgroundImage
  const backgroundColor = props.backgroundColor ?? preset?.backgroundColor
  const textColor = theme.shades.light.foreground
  const showExpireDate =
    type === GenericLicenseType.Passport ||
    type === GenericLicenseType.IdentityDocument
  const showBarcodeView =
    status === 'VALID' &&
    !!((barcode && barcode?.value) || (barcode?.loading && !barcode?.value))

  const barcodeWidth = isTablet
    ? BARCODE_MAX_WIDTH
    : screenWidth - theme.spacing[4] * 2 - theme.spacing.smallGutter * 2
  const barcodeHeight = barcodeWidth / 3

  const badSessionError = error
    ? findProblemInApolloError(error as any, [ProblemType.BAD_SESSION])
    : undefined

  return (
    <Host>
      <BackgroundImage
        source={backgroundImage}
        color={backgroundColor}
        resizeMode="cover"
      />
      <ContentContainer marginBottom={barcode ? theme.spacing[1] : 0}>
        <Content>
          <Title
            numberOfLines={1}
            ellipsizeMode="tail"
            color={textColor}
            variant="heading5"
          >
            {title}
          </Title>

          <ValidationWrap>
            {loading ? (
              <Skeleton
                active
                height={16}
                style={{
                  width: 62,
                  borderRadius: 4,
                  opacity: 0.5,
                }}
              />
            ) : (
              <>
                <Image
                  source={
                    error
                      ? IconStatusNonVerified
                      : status === 'VALID'
                      ? IconStatusVerified
                      : IconStatusNonVerified
                  }
                  resizeMode="contain"
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 8,
                    tintColor: error && theme.color.yellow600,
                  }}
                />
                <Typography color={textColor} variant="eyebrow">
                  {intl.formatMessage({
                    id: error
                      ? 'walletPass.errorFetchingLicense'
                      : status === 'VALID'
                      ? 'walletPass.validLicense'
                      : 'walletPass.expiredLicense',
                  })}
                </Typography>
              </>
            )}
          </ValidationWrap>
          {date && (
            <Typography variant="body3" color={textColor}>
              {showExpireDate
                ? intl.formatMessage({ id: 'walletPass.expirationDate' })
                : intl.formatMessage({ id: 'walletPass.lastUpdate' })}
              {': '}
              {showExpireDate ? (
                <FormattedDate value={date} {...{ dateStyle: 'short' }} />
              ) : (
                <>
                  <FormattedTime value={date} />
                  {' - '}
                  <FormattedDate value={date} {...{ dateStyle: 'short' }} />
                </>
              )}
            </Typography>
          )}
        </Content>
        {logo && (
          <ImgWrap>
            {isString(logo) ? (
              <Base64Image source={{ uri: logo }} />
            ) : (
              <Image source={logo} style={{ height: 72, width: 72 }} />
            )}
          </ImgWrap>
        )}
      </ContentContainer>
      {showBarcodeView && !showBarcodeOfflineMessage && !error && (
        <BarcodeWrapper minHeight={barcode?.height}>
          {!barcode.loading && barcode?.value ? (
            <BarcodeContainer>
              <Barcode
                value={barcode.value}
                width={barcode.width}
                height={barcode.height}
              />
              {barcode?.expirationTime && (
                <ProgressBarContainer>
                  <ExpirationProgressBar
                    expirationDate={barcode.expirationTime}
                    doneCallback={barcode?.expirationTimeCallback}
                    expireTime={
                      barcode.expirationTime.getTime() - new Date().getTime()
                    }
                    barContainerWidth={barcode.width}
                  />
                </ProgressBarContainer>
              )}
            </BarcodeContainer>
          ) : (
            <Skeleton
              active
              backgroundColor={
                preset.barcode?.background ?? theme.color.blue100
              }
              overlayColor={preset.barcode?.overlay ?? theme.color.blue200}
              overlayOpacity={1}
              style={{ flex: 1 }}
            />
          )}
        </BarcodeWrapper>
      )}
      {allowLicenseBarcode && (error || showBarcodeOfflineMessage) && (
        <BarcodeWrapper minHeight={barcodeHeight}>
          <BarcodeContainer
            style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
          >
            <OfflineMessage variant="body3" style={{ opacity: 1 }}>
              {intl.formatMessage({
                id: error
                  ? badSessionError
                    ? 'walletPass.barcodeErrorBadSession'
                    : 'walletPass.barcodeErrorFailedToFetch'
                  : 'walletPass.barcodeErrorNotConnected',
              })}
            </OfflineMessage>
          </BarcodeContainer>
        </BarcodeWrapper>
      )}
    </Host>
  )
}
