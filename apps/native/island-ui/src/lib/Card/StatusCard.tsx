import React from 'react'
import styled from 'styled-components/native';

const Host = styled.View`
  position: relative;
  flex: 1;
  flex-flow: row;
  width: 100%;
  padding: 15px 15px;
  margin-bottom: 20px;

  border-radius: ${props => props.theme.border.radius.large};

  background-color: ${props => props.theme.shade.background};
  overflow: hidden;
`;

const Left = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  margin-bottom: 8px;

  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.shade.foreground};
`;

const Description = styled.Text`
  margin-bottom: 16px;
  font-size: 16px;
  color: ${props => props.theme.shade.shade600};
`;

const Right = styled.View``;

const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  height: 15px;

  background-color: rgba(128, 128, 128, 0.2);
`;

const Bar = styled.View<{ width?: number}>`
  flex: 1;
  width: ${(props: any) => props.width ?? 0}%;
  background-color: ${props => props.theme.isDark ? props.theme.color.roseTinted600 : props.theme.color.roseTinted300};
`;

interface StatusCardProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  progress?: number;
}

export function StatusCard({ title, description, badge, progress }: StatusCardProps) {
  return (
    <Host>
      <Left>
        <Title>
          {title}
        </Title>
        <Description>
          {description}
        </Description>
      </Left>
      <Right>
        {badge}
      </Right>
      <BottomBar>
        <Bar width={progress} />
      </BottomBar>
    </Host>
  )
}
