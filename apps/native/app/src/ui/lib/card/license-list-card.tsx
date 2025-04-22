import React from 'react'
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { GenericLicenseType } from '../../../graphql/types/schema'
import { isString } from '../../../utils/is-string'
import BackgroundADR from '../../assets/card/adr-bg.png'
import LogoCoatOfArms from '../../assets/card/agency-logo.png'
import CoatOfArms from '../../assets/card/logo-coat-of-arms.png'
import BackgroundDriversLicense from '../../assets/card/okuskirteini.png'
import DisabilityLicenseBg from '../../assets/card/ororka_bg.png'
import BackgroundPCardLicense from '../../assets/card/p-card.png'
import BackgroundPassport from '../../assets/card/passport-bg.png'
import BackgroundIdentityDocument from '../../assets/card/nafnskirteini-bg.png'
import LogoEhic from '../../assets/card/sjukratryggingar.png'
import BackgroundWeaponLicense from '../../assets/card/skotvopnaleyfi.png'
import LogoRegistersIceland from '../../assets/card/thjodskra-logo.png'
import DisabilityLicenseLogo from '../../assets/card/tryggingastofnun_logo.png'
import LogoNatureConservationAgency from '../../assets/card/nvs-logo.png'
import BackgroundHuntingCard from '../../assets/card/veidikort-bg.png'
import LogoAOSH from '../../assets/card/vinnueftirlitid-logo.png'
import BackgroundVinnuvelar from '../../assets/card/vinnuvelar-bg.png'
import chevronForward from '../../assets/icons/chevron-forward.png'
import { dynamicColor, theme } from '../../utils'
import { Typography } from '../typography/typography'

export const LICENSE_CARD_ROW_GAP = theme.spacing.p2

const Host = styled(Animated.View)<{ emptyState?: boolean }>`
  position: relative;
  min-height: 80px;
  padding-vertical: ${({ theme }) => theme.spacing[2]}px;
  padding-left: ${({ theme }) => theme.spacing.p2}px;
  padding-right: ${({ theme }) => theme.spacing[1]}px;
  row-gap: ${LICENSE_CARD_ROW_GAP}px;
  border-radius: ${({ theme }) => theme.border.radius.extraLarge};
  border-width: ${({ emptyState }) => (emptyState ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.color.blue200};
  overflow: hidden;
  justify-content: center;
`

const ContentContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

const TextContent = styled.View`
  gap: ${({ theme }) => theme.spacing.p2}px;
  flex-direction: row;
`

const Base64Image = styled.Image`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme: { border } }) => border.radius.large};
`

const Title = styled(Typography)<{ color: string }>`
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const ImgWrap = styled.View`
  flex-shrink: 0;
  align-content: center;
  justify-content: center;
  height: 42px;
  width: 42px;
`

export const LicenseCardPresets: Record<GenericLicenseType, CardPreset> = {
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
    logo: LogoNatureConservationAgency,
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
    backgroundColor: '#B9C1E6',
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
    title: 'Vegabréf: Almennt',
    logo: LogoRegistersIceland,
    backgroundImage: BackgroundPassport,
    backgroundColor: '#CACFE4',
  },
  IdentityDocument: {
    title: 'Nafnskírteini',
    logo: LogoRegistersIceland,
    backgroundImage: BackgroundIdentityDocument,
    backgroundColor: '#C5E3F2',
  },
}

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

interface LicenseCardProps {
  title?: string | null
  nativeID?: string
  style?: StyleProp<ViewStyle>
  type?: GenericLicenseType
  logo?: ImageSourcePropType | string
  backgroundImage?: ImageSourcePropType
  backgroundColor?: string
  subtitle?: string | null
  emptyState?: boolean
  link?: React.ReactNode
  childName?: string | null
}

export function LicenseListCard({
  nativeID,
  style,
  type,
  subtitle,
  ...props
}: LicenseCardProps) {
  const theme = useTheme()

  const preset = type
    ? LicenseCardPresets[type]
    : LicenseCardPresets.DriversLicense
  const title = props.title ?? preset?.title
  const logo = props.logo ?? preset?.logo
  const backgroundImage = props.backgroundImage ?? preset?.backgroundImage
  const backgroundColor = props.backgroundColor ?? preset?.backgroundColor
  const textColor = theme.shades.light.foreground

  return (
    <Host emptyState={props.emptyState}>
      {!props.emptyState && (
        <BackgroundImage
          source={backgroundImage}
          color={backgroundColor}
          resizeMode="cover"
        />
      )}
      <ContentContainer>
        <TextContent>
          {logo && (
            <ImgWrap>
              {isString(logo) ? (
                <Base64Image source={{ uri: logo }} />
              ) : (
                <Image source={logo} style={{ height: 42, width: 42 }} />
              )}
            </ImgWrap>
          )}
          <Content>
            <Title
              numberOfLines={1}
              ellipsizeMode="tail"
              color={textColor}
              variant="heading5"
            >
              {title}
            </Title>
            {props.childName && (
              <Typography variant="eyebrow" style={{ marginBottom: 2 }}>
                {props.childName}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body3" color={textColor}>
                {subtitle}
              </Typography>
            )}
          </Content>
        </TextContent>
        {props.link ? (
          props.link
        ) : (
          <Image
            source={chevronForward}
            style={{
              height: 24,
              width: 24,
              tintColor: theme.color.dark400,
              opacity: 0.3,
            }}
          />
        )}
      </ContentContainer>
    </Host>
  )
}
