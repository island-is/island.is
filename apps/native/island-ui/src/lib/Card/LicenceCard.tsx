import React from 'react';
import styled from 'styled-components/native';
import { Image, ImageSourcePropType } from 'react-native';
import isVerifiedLogo from '../../assets/card/is-verified.png'

const Host = styled.View<{ backgroundColor?: string }>`
  display: flex;
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
`;

const ValidationWrap = styled.View`
  font-family: 'IBMPlexSans-SemiBold';
  display: flex;
  flex-flow: row;
`;

const Validation = styled.Text`
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const TimeStamp = styled.Text`
  font-size: 12px;
`;

const ImgWrap = styled.View`
`;


interface LicenceCardProps {
  title: string;
  agencyLogo: ImageSourcePropType;
  backgroundColor?: string;
  nativeID?: string;
}

export function LicenceCard({ title, backgroundColor = '#F8F5FA', agencyLogo, nativeID }: LicenceCardProps) {
  return (
    <Host backgroundColor={backgroundColor} nativeID={nativeID}>
      <Content>
        <Title numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Title>
        <ValidationWrap>
          <Image source={isVerifiedLogo as ImageSourcePropType} style={{ width: 13, height: 13, marginRight: 8 }} />
          <Validation>
            Í gildi
          </Validation>
        </ValidationWrap>

        <TimeStamp>
          16:24 - 14.03.2021
        </TimeStamp>
      </Content>
      <ImgWrap>
        <Image source={agencyLogo} style={{ width: 68, height: 87 }} />
      </ImgWrap>
    </Host>
  );
}
