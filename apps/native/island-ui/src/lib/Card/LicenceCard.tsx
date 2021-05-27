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
const BackgroundImage = styled.ImageBackground<{ backgroundColor?: string }>`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  flex: 1;
`;

const Content = styled.View`
  justify-content: center;
`

const Title = styled.Text`
  margin-bottom: 8px;

  ${font({
    fontWeight: '600',
  })}
`

const ValidationWrap = styled.View`
  display: flex;
  flex-flow: row;
  margin-bottom: 4px;
`

const Validation = styled.Text`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
  })}
`

const TimeStamp = styled.Text`
  ${font({
    fontSize: 13,
  })}
  color: ${(props) => props.theme.shade.foreground};
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
  let backgroundColor = theme.shade.shade400
  let backgroundImage = null;
  let logo = <Image source={agencyLogo} style={{ width: 68, height: 87 }} />;
  switch (type) {
    case LicenseType.DRIVERS_LICENSE:
      backgroundColor = theme.isDark ? '#5F414E' : '#f5e4ec'
      backgroundImage = driverLicence
      break
    case LicenseType.IDENTIDY_CARD:
      backgroundColor = theme.isDark ? '#403E3B' : '#fff7e7'
      break
    case LicenseType.PASSPORT:
      backgroundColor = theme.isDark ? '#283139' : '#ddefff'
      break
    case LicenseType.FISHING_CARD:
      backgroundColor = theme.isDark ? '#283139' : '#ddefff'
      backgroundImage = fishingCard
      logo = <Image source={ust} style={{ width: 58, height: 41 }} />
      break
    case LicenseType.WEAPON_LICENSE:
      backgroundColor = theme.isDark ? '#474421' : '#fffce0'
      backgroundImage = weaponLicense
      break
  }

  return (
    <Host nativeID={nativeID} style={style}>
      <BackgroundImage source={backgroundImage} backgroundColor={backgroundColor} />
      <Content>
        <Title numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Title>
        <ValidationWrap>
          <Image
            source={isVerifiedLogo as ImageSourcePropType}
            style={{ width: 13, height: 13, marginRight: 8 }}
          />
          <Validation>{status}</Validation>
        </ValidationWrap>
        <TimeStamp>{date}</TimeStamp>
      </Content>
      <ImgWrap>
        {logo}
      </ImgWrap>
    </Host>
  )
}
