import React from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { Image, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import BackgroundADR from '../../assets/card/adr-bg.png'
import LogoCoatOfArms from '../../assets/card/agency-logo.png'
import BackgroundCovidCertificate from '../../assets/card/covid.png'
import IconStatusNonVerified from '../../assets/card/danger.png'
import IconStatusVerified from '../../assets/card/is-verified.png'
import CoatOfArms from '../../assets/card/logo-coat-of-arms.png'
import BackgroundDriversLicense from '../../assets/card/okuskirteini.png'
import DisabilityLicenseBg from '../../assets/card/ororka_bg.png'
import BackgroundPCardLicense from '../../assets/card/p-card.png'
import BackgroundPassport from '../../assets/card/passport-bg.png'
import BackgroundWeaponLicense from '../../assets/card/skotvopnaleyfi.png'
import LogoRegistersIceland from '../../assets/card/thjodskra-logo.png'
import DisabilityLicenseLogo from '../../assets/card/tryggingastofnun_logo.png'
import LogoEnvironmentAgency from '../../assets/card/ust.png'
import BackgroundHuntingCard from '../../assets/card/veidikort.png'
import LogoAOSH from '../../assets/card/vinnueftirlitid-logo.png'
import BackgroundVinnuvelar from '../../assets/card/vinnuvelar-bg.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  padding-top: 1px;
  padding: 16px 24px;
  min-height: 112px;
  flex-flow: row nowrap;
  justify-content: space-between;
  border-radius: 16px;
  overflow: hidden;
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
`
type CardStatus = 'NOT_VALID' | 'VALID'

interface LicenceCardProps {
  status: CardStatus
  title?: string
  date?: Date | string
  nativeID?: string
  style?: StyleProp<ViewStyle>
  type?: LicenseCardType
  logo?: ImageSourcePropType
  backgroundImage?: ImageSourcePropType
  backgroundColor?: string
}

type StatusStyle = {
  text: string
  icon: ImageSourcePropType
}

type StatusStyles = {
  [key: string]: StatusStyle
}

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

const LicenseCardPresets = {
  DriversLicense: {
    title: 'Ökuskírteini (IS)',
    logo: LogoCoatOfArms,
    backgroundImage: BackgroundDriversLicense,
    backgroundColor: '#F5E4EC',
  },
  AdrLicense: {
    title: 'ADR skírteini',
    logo: LogoAOSH,
    backgroundImage: BackgroundADR,
    backgroundColor: '#F2FAEC',
  },
  MachineLicense: {
    title: 'Vinnuvélaskírteini',
    logo: LogoAOSH,
    backgroundImage: BackgroundVinnuvelar,
    backgroundColor: '#C5E6AF',
  },
  PASSPORT: {
    title: 'Almennt vegabréf',
    logo: LogoRegistersIceland,
    backgroundImage: BackgroundPassport,
    backgroundColor: '#fff',
  },
  FirearmLicense: {
    title: 'Skotvopnaleyfi',
    logo: CoatOfArms,
    backgroundImage: BackgroundWeaponLicense,
    backgroundColor: '#EBEBF2',
  },
  HuntingCard: {
    title: 'Veiðikort',
    logo: LogoEnvironmentAgency,
    backgroundImage: BackgroundHuntingCard,
    backgroundColor: '#E2EDFF',
  },
  CovidCertificate: {
    title: 'Bólusetningarvottorð',
    logo: LogoCoatOfArms,
    backgroundImage: BackgroundCovidCertificate,
    backgroundColor: '#D6CFD6',
  },
  DisabilityLicense: {
    title: 'Örorkuskírteini',
    logo: DisabilityLicenseLogo,
    backgroundImage: DisabilityLicenseBg,
    backgroundColor: '#C5D5C8',
  },
  PCard: {
    title: 'Stæðiskort',
    logo: LogoCoatOfArms,
    backgroundImage: BackgroundPCardLicense,
    backgroundColor: '#F2F7FF',
  },
}

export type LicenseCardType = keyof typeof LicenseCardPresets

export function LicenceCard({
  nativeID,
  style,
  date,
  status,
  type,
  ...props
}: LicenceCardProps) {
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

  return (
    <Host nativeID={nativeID} style={style}>
      <BackgroundImage
        source={backgroundImage}
        color={backgroundColor}
        resizeMode="cover"
      />
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
            {type === 'PASSPORT'
              ? intl.formatMessage({ id: 'walletPass.expirationDate' })
              : intl.formatMessage({ id: 'walletPass.lastUpdate' })}
            {': '}
            {type === 'PASSPORT' ? (
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
          <Image source={logo} />
        </ImgWrap>
      )}
    </Host>
  )
}
