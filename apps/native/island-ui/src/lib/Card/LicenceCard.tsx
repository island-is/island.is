import React from 'react'
import { Image, ImageSourcePropType } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { LicenseType } from '../../../../app/src/types/license-type'
import isVerifiedLogo from '../../assets/card/is-verified.png'
import weaponLicense from '../../assets/card/skotvopnaleyfi.png'
import driverLicence from '../../assets/card/okuskyrteini.png'
import fishingCard from '../../assets/card/veidikort.png'
import ust from '../../assets/card/ust.png'
import { font } from '../../utils/font'
import { dynamicColor } from '../../utils'


const Host = styled.View`
  display: flex;
  width: 100%;
  min-height: 112px;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 16px 24px;
  border-radius: 16px;
  overflow: hidden;
`
const BackgroundImage = styled.ImageBackground<{ color: any }>`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  flex: 1;
  background-color: ${dynamicColor(props => props.color)};
`;

const Content = styled.View`
  justify-content: center;
`

const Title = styled.Text<{ color: any }>`
  margin-bottom: 8px;

  ${font({
    fontWeight: '600',
    color: props => props.color,
  })}
`

const ValidationWrap = styled.View`
  display: flex;
  flex-flow: row;
  margin-bottom: 4px;
`

const Validation = styled.Text<{ color: any }>`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: props => props.color,
  })}
`

const TimeStamp = styled.Text<{ color: any }>`
  ${font({
    fontSize: 13,
    color: props => props.color,
  })}
`

const ImgWrap = styled.View`
  display: flex;
  align-content: center;
  justify-content: center;
`

interface LicenceCardProps {
  title: string
  status?: string
  date?: string
  agencyLogo: ImageSourcePropType
  type: LicenseType
  nativeID?: string
  style?: any
}

export function LicenceCard({
  title,
  type,
  agencyLogo,
  nativeID,
  style,
  date,
  status,
}: LicenceCardProps) {
  const theme = useTheme()
  let textColor = {
    dark: theme.shades.dark.foreground,
    light: theme.shades.light.foreground,
  }
  let backgroundColor = {
    dark: theme.shades.dark.shade400,
    light: theme.shades.light.shade400,
  };
  let backgroundImage = null;
  let logo = <Image source={agencyLogo} style={{ width: 68, height: 87 }} />;
  switch (type) {
    case LicenseType.DRIVERS_LICENSE:
      textColor = { dark: '#000000', light: '#000000' };
      backgroundColor = { dark: '#5F414E', light: '#f5e4ec' };
      backgroundImage = driverLicence
      break
    case LicenseType.IDENTIDY_CARD:
      backgroundColor = { dark: '#403E3B', light: '#fff7e7' };
      break
    case LicenseType.PASSPORT:
      backgroundColor = { dark: '#283139', light: '#ddefff' };
      break
    case LicenseType.FISHING_CARD:
      textColor = { dark: '#000000', light: '#000000' };
      backgroundColor = { dark: '#283139', light: '#ddefff' };
      backgroundImage = fishingCard
      logo = <Image source={ust} style={{ width: 58, height: 41 }} />
      break
    case LicenseType.WEAPON_LICENSE:
      textColor = { dark: '#000000', light: '#000000' };
      backgroundColor = { dark: '#474421', light: '#fffce0' };
      backgroundImage = weaponLicense
      break
  }

  return (
    <Host nativeID={nativeID} style={style}>
      <BackgroundImage source={backgroundImage} color={backgroundColor} />
      <Content>
        <Title numberOfLines={1} ellipsizeMode="tail" color={textColor}>
          {title}
        </Title>
        <ValidationWrap>
          <Image
            source={isVerifiedLogo as ImageSourcePropType}
            style={{ width: 13, height: 13, marginRight: 8 }}
          />
          <Validation color={textColor}>{status}</Validation>
        </ValidationWrap>
        <TimeStamp color={textColor}>{date}</TimeStamp>
      </Content>
      <ImgWrap>
        {logo}
      </ImgWrap>
    </Host>
  )
}
