import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Image, ImageSourcePropType } from 'react-native';
import isVerifiedLogo from '../../assets/card/is-verified.png'
import { LicenseType } from '../../../../app/src/types/license-type'

const Host = styled.View<{ backgroundColor?: string }>`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 12px 24px;
  border-radius: 16px;
  background-color: ${props => props.backgroundColor ?? props.theme.color.blueberry100};
`

const Content = styled.View`
  justify-content: center;
`;

const Title = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  margin-bottom: 8px;
  font-size: 16px;
  color: ${props => props.theme.shade.foreground};
`;

const ValidationWrap = styled.View`
  font-family: 'IBMPlexSans-SemiBold';
  display: flex;
  flex-flow: row;
`;

const Validation = styled.Text`
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 17px;
  font-weight: bold;
  color: ${props => props.theme.shade.foreground};
`;

const TimeStamp = styled.Text`
  font-size: 13px;
  color: ${props => props.theme.shade.foreground};
`;

const ImgWrap = styled.View`
`;

function mapLicenseColor(type: LicenseType) {
  let backgroundColor = '#eeeeee'
  if (type === LicenseType.DRIVERS_LICENSE) {
    backgroundColor = '#f5e4ec'
  }
  if (type === LicenseType.IDENTIDY_CARD) {
    backgroundColor = '#fff7e7'
  }
  if (type === LicenseType.PASSPORT) {
    backgroundColor = '#ddefff'
  }
  if (type === LicenseType.WEAPON_LICENSE) {
    backgroundColor = '#fffce0'
  }
  return backgroundColor
}


interface LicenceCardProps {
  title: string;
  status?: string;
  date?: string;
  agencyLogo: ImageSourcePropType;
  type: LicenseType;
  nativeID?: string;
  style?: any;
}

export function LicenceCard({ title, type, agencyLogo, nativeID, style, date, status }: LicenceCardProps) {
  const theme = useTheme();
  let backgroundColor = theme.shade.shade400;
  switch (type) {
    case LicenseType.DRIVERS_LICENSE:
      backgroundColor = theme.isDark ? '#5F414E' : '#f5e4ec';
      break;
    case LicenseType.IDENTIDY_CARD:
      backgroundColor = theme.isDark ? '#403E3B' : '#fff7e7';
      break;
    case LicenseType.PASSPORT:
      backgroundColor = theme.isDark ? '#283139' : '#ddefff';
      break;
    case LicenseType.WEAPON_LICENSE:
      backgroundColor = theme.isDark ? '#474421' : '#fffce0';
      break;
  }

  return (
    <Host backgroundColor={backgroundColor} nativeID={nativeID} style={style}>
      <Content>
        <Title numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Title>
        <ValidationWrap>
          <Image source={isVerifiedLogo as ImageSourcePropType} style={{ width: 13, height: 13, marginRight: 8 }} />
          <Validation>
            {status}
          </Validation>
        </ValidationWrap>
        <TimeStamp>
          {date}
        </TimeStamp>
      </Content>
      <ImgWrap>
        <Image source={agencyLogo} style={{ width: 68, height: 87 }} />
      </ImgWrap>
    </Host>
  );
}
