import { Barcode } from '@ui/lib/barcode/barcode'
import { Skeleton } from '@ui/lib/skeleton/skeleton'
import React from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { ExpirationProgressBar } from '../../../components/progress-bar/expiration-progress-bar'
import { GenericLicenseType } from '../../../graphql/types/schema'
import { isString } from '../../../utils/is-string'
import { prefixBase64 } from '../../../utils/prefix-base-64'
import BackgroundADR from '../../assets/card/adr-bg.png'
import LogoCoatOfArms from '../../assets/card/agency-logo.png'
import IconStatusNonVerified from '../../assets/card/danger.png'
import IconStatusVerified from '../../assets/card/is-verified.png'
import CoatOfArms from '../../assets/card/logo-coat-of-arms.png'
import BackgroundDriversLicense from '../../assets/card/okuskirteini.png'
import DisabilityLicenseBg from '../../assets/card/ororka_bg.png'
import BackgroundPCardLicense from '../../assets/card/p-card.png'
import BackgroundPassport from '../../assets/card/passport-bg.png'
import LogoEhic from '../../assets/card/sjukratryggingar.png'
import BackgroundWeaponLicense from '../../assets/card/skotvopnaleyfi.png'
import LogoRegistersIceland from '../../assets/card/thjodskra-logo.png'
import DisabilityLicenseLogo from '../../assets/card/tryggingastofnun_logo.png'
import LogoEnvironmentAgency from '../../assets/card/ust-logo.png'
import BackgroundHuntingCard from '../../assets/card/veidikort-bg.png'
import LogoAOSH from '../../assets/card/vinnueftirlitid-logo.png'
import BackgroundVinnuvelar from '../../assets/card/vinnuvelar-bg.png'
import { dynamicColor, theme } from '../../utils'
import { font } from '../../utils/font'
import { Typography } from '../typography/typography'
import { screenWidth } from '../../../utils/dimensions'

export const LICENSE_CARD_ROW_GAP = theme.spacing.p2

const Host = styled(Animated.View)`
  position: relative;
  min-height: 104px;
  padding: ${({ theme }) => theme.spacing[2]}px;
  row-gap: ${LICENSE_CARD_ROW_GAP}px;
  border-radius: ${({ theme }) => theme.border.radius.extraLarge};
  overflow: hidden;
  justify-content: center;
`

const ContentContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const BarcodeWrapper = styled.View<{ minHeight?: number }>`
  flex: 1;
  border-radius: ${({ theme }) => theme.border.radius.large};
  min-height: ${({ minHeight }) => minHeight}px;
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
  width: 64px;
  height: 72px;
  border-radius: ${({ theme: { border } }) => border.radius.large};
`

const Title = styled.Text<{ color: string }>`
  margin-bottom: 8px;

  ${font({
    fontWeight: '600',
    color: (props) => props.color,
  })}
`

const ValidationWrap = styled.View`
  display: flex;
  flex-flow: row;
  margin-bottom: 4px;
`

const OfflineMessage = styled(Typography)`
  opacity: 1;
  padding: ${({ theme }) => theme.spacing[3]}px;
  text-align: center;
`

const Validation = styled.Text<{ color: string }>`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: (props) => props.color,
  })}
`

const TimeStamp = styled.Text<{ color: string }>`
  ${font({
    fontSize: 13,
    color: (props) => props.color,
  })}
`

const ImgWrap = styled.View`
  flex-shrink: 0;
  align-content: center;
  justify-content: center;
  height: 72px;
  width: 72px;
`

// Todo when we know the status type add to intl
const statusIcon: StatusStyles = {
  NOT_VALID: {
    text: 'Ekki í gildi',
    icon: IconStatusNonVerified,
  },
  VALID: {
    text: 'Í gildi',
    icon: IconStatusVerified,
  },
}

const LicenseCardPresets: Record<LicenseType, CardPreset> = {
  DriversLicense: {
    title: 'Ökuskírteini (IS)',
    logo: LogoCoatOfArms,
    backgroundImage: BackgroundDriversLicense,
    backgroundColor: '#F5E4EC',
    barcode: {
      background: '#F5EAEF',
      overlay: '#F0DDE5',
    },
  },
  AdrLicense: {
    title: 'ADR skírteini',
    logo: LogoAOSH,
    backgroundImage: BackgroundADR,
    backgroundColor: '#F2FAEC',
    barcode: {
      background: '#FAFDF7',
      overlay: '#F4FCEE',
    },
  },
  MachineLicense: {
    title: 'Vinnuvélaskírteini',
    logo: LogoAOSH,
    backgroundImage: BackgroundVinnuvelar,
    backgroundColor: '#C5E6AF',
    barcode: {
      background: '#DEF1D1',
      overlay: '#C8E6B3',
    },
  },
  FirearmLicense: {
    title: 'Skotvopnaleyfi',
    logo: CoatOfArms,
    backgroundImage: BackgroundWeaponLicense,
    backgroundColor: '#EBEBF2',
    barcode: {
      background: '#FDFDF7',
      overlay: '#FAFAEB',
    },
  },
  HuntingLicense: {
    title: 'Veiðikort',
    logo: LogoEnvironmentAgency,
    backgroundImage: BackgroundHuntingCard,
    backgroundColor: '#E2EDFF',
    barcode: {
      background: '#DBECF4',
      overlay: '#B3D3E3',
    },
  },
  Ehic: {
    title: 'Evrópska sjúkratryggingakortið',
    logo: LogoEhic,
    backgroundImage: BackgroundPassport,
    backgroundColor: '#E2EDFF',
  },
  DisabilityLicense: {
    title: 'Örorkuskírteini',
    logo: DisabilityLicenseLogo,
    backgroundImage: DisabilityLicenseBg,
    backgroundColor: '#C5D5C8',
    barcode: {
      background: '#D7E3D7',
      overlay: '#A0BAA2',
    },
  },
  PCard: {
    title: 'Stæðiskort',
    logo: LogoCoatOfArms,
    backgroundImage: BackgroundPCardLicense,
    backgroundColor: '#F2F7FF',
  },
  Passport: {
    title: 'Almennt vegabréf',
    logo: LogoRegistersIceland,
    backgroundImage: BackgroundPassport,
    backgroundColor: '#fff',
  },
}

export enum CustomLicenseType {
  Passport = 'Passport',
}

type LicenseType = GenericLicenseType | CustomLicenseType

type CardPreset = {
  title: string
  logo: ImageSourcePropType
  backgroundImage: ImageSourcePropType
  backgroundColor: string
  barcode?: {
    background: string
    overlay: string
  }
}

type StatusStyle = {
  text: string
  icon: ImageSourcePropType
}

type StatusStyles = {
  [key: string]: StatusStyle
}

interface LicenseCardProps {
  status: 'VALID' | 'NOT_VALID'
  title?: string
  date?: Date | string
  nativeID?: string
  style?: StyleProp<ViewStyle>
  type?: LicenseType
  logo?: ImageSourcePropType | string
  backgroundImage?: ImageSourcePropType
  backgroundColor?: string
  showBarcodeOfflineMessage?: boolean
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
  ...props
}: LicenseCardProps) {
  const theme = useTheme()

  const intl = useIntl()
  const variant = statusIcon[status]
  const preset = type
    ? LicenseCardPresets[type]
    : LicenseCardPresets.DriversLicense
  const title = props.title ?? preset?.title
  const logo = props.logo ?? preset?.logo
  const backgroundImage = props.backgroundImage ?? preset?.backgroundImage
  const backgroundColor = props.backgroundColor ?? preset?.backgroundColor
  const textColor = theme.shades.light.foreground
  const showBarcodeView =
    status === 'VALID' &&
    !!((barcode && barcode?.value) || (barcode?.loading && !barcode?.value))

  const barcodeWidth =
    screenWidth - theme.spacing[4] * 2 - theme.spacing.smallGutter * 2
  const barcodeHeight = barcodeWidth / 3

  return (
    <Host>
      <BackgroundImage
        source={backgroundImage}
        color={backgroundColor}
        resizeMode="cover"
      />
      <ContentContainer>
        <Content>
          <Title numberOfLines={1} ellipsizeMode="tail" color={textColor}>
            {title}
          </Title>
          {variant && (
            <ValidationWrap>
              <Image
                source={variant.icon as ImageSourcePropType}
                resizeMode="contain"
                style={{ width: 15, height: 15, marginRight: 8 }}
              />
              <Validation color={textColor}>{variant.text}</Validation>
            </ValidationWrap>
          )}
          {date && (
            <TimeStamp color={textColor}>
              {type === CustomLicenseType.Passport
                ? intl.formatMessage({ id: 'walletPass.expirationDate' })
                : intl.formatMessage({ id: 'walletPass.lastUpdate' })}
              {': '}
              {type === CustomLicenseType.Passport ? (
                <FormattedDate value={date} {...{ dateStyle: 'short' }} />
              ) : (
                <FormattedDate
                  value={date}
                  {...{ dateStyle: 'short', timeStyle: 'short' }}
                />
              )}
            </TimeStamp>
          )}
        </Content>
        {logo && (
          <ImgWrap>
            {isString(logo) ? (
              <Base64Image source={{ uri: prefixBase64(logo) }} />
            ) : (
              <Image source={logo} style={{ height: 72, width: 72 }} />
            )}
          </ImgWrap>
        )}
      </ContentContainer>
      {showBarcodeView && (
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
      {showBarcodeOfflineMessage && !showBarcodeView && (
        <BarcodeWrapper minHeight={barcodeHeight}>
          <BarcodeContainer
            style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
          >
            <OfflineMessage variant="body3" style={{ opacity: 1 }}>
              {intl.formatMessage({
                id: 'walletPass.errorNotConnectedNoBarcode',
              })}
            </OfflineMessage>
          </BarcodeContainer>
        </BarcodeWrapper>
      )}
    </Host>
  )
}
