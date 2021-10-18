import React from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { Image, ImageSourcePropType } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import {
  LicenseStatus,
  LicenseType,
} from '../../../../app/src/types/license-type'
import danger from '../../assets/card/danger.png'
import isVerifiedLogo from '../../assets/card/is-verified.png'
import driverLicence from '../../assets/card/okuskirteini.png'
import weaponLicense from '../../assets/card/skotvopnaleyfi.png'
import ust from '../../assets/card/ust.png'
import fishingCard from '../../assets/card/veidikort.png'
import { dynamicColor } from '../../utils'
import { font } from '../../utils/font'

const Host = styled.View`
  padding: 16px 24px;
  min-height: 112px;
  flex-flow: row nowrap;
  justify-content: space-between;
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
  background-color: ${dynamicColor((props) => props.color)};
`

const Content = styled.View`
  flex-shrink: 1;
  justify-content: center;
`

const Title = styled.Text<{ color: any }>`
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

const Validation = styled.Text<{ color: any }>`
  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    color: (props) => props.color,
  })}
`

const TimeStamp = styled.Text<{ color: any }>`
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

interface LicenceCardProps {
  title: string
  status: LicenseStatus
  date?: Date | string
  agencyLogo: ImageSourcePropType
  type: LicenseType
  nativeID?: string
  style?: any
}

type StatusStyle = {
  text: string
  icon: ImageSourcePropType
}

type StatusStyles = {
  [Type in LicenseStatus]: StatusStyle
}

// Todo when we know the status type add to intl
const statusIcon: StatusStyles = {
  NOT_VALID: {
    text: 'Ekki í gildi',
    icon: danger,
  },
  VALID: {
    text: 'Í gildi',
    icon: isVerifiedLogo,
  },
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
  const intl = useIntl()
  const variant = statusIcon[status]
  let titleString = title
  let textColor = {
    dark: theme.shades.dark.foreground,
    light: theme.shades.light.foreground,
  }
  let backgroundColor = {
    dark: theme.shades.dark.shade400,
    light: theme.shades.light.shade400,
  }
  let backgroundImage = null
  let logo = <Image source={agencyLogo} style={{ width: 68, height: 87 }} />
  switch (type) {
    case LicenseType.DRIVERS_LICENSE:
      titleString = 'Ökuskírteini (IS)'
      textColor = { dark: '#000000', light: '#000000' }
      backgroundColor = { dark: '#5F414E', light: '#f5e4ec' }
      backgroundImage = driverLicence
      break
    case LicenseType.IDENTIDY_CARD:
      backgroundColor = { dark: '#403E3B', light: '#fff7e7' }
      break
    case LicenseType.PASSPORT:
      backgroundColor = { dark: '#283139', light: '#ddefff' }
      break
    case LicenseType.FISHING_CARD:
      textColor = { dark: '#000000', light: '#000000' }
      backgroundColor = { dark: '#283139', light: '#ddefff' }
      backgroundImage = fishingCard
      logo = <Image source={ust} style={{ width: 58, height: 41 }} />
      break
    case LicenseType.WEAPON_LICENSE:
      textColor = { dark: '#000000', light: '#000000' }
      backgroundColor = { dark: '#474421', light: '#fffce0' }
      backgroundImage = weaponLicense
      break
  }

  return (
    <Host nativeID={nativeID} style={style}>
      <BackgroundImage source={backgroundImage} color={backgroundColor} />
      <Content>
        <Title numberOfLines={1} ellipsizeMode="tail" color={textColor}>
          {titleString}
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
            {intl.formatMessage({ id: 'walletPass.lastUpdate' })}{': '}
            <FormattedDate dateStyle="short" timeStyle="short" value={date} />
          </TimeStamp>
        )}
      </Content>
      <ImgWrap>{logo}</ImgWrap>
    </Host>
  )
}
