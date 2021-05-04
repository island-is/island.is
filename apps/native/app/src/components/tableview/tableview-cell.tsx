import React from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';


interface TableViewCellProps {
  /**
   * Title of the cell
   */
  title: React.ReactNode;
  /**
   * Text to display below title
   */
  subtitle?: React.ReactNode;
  /**
   * Replace title/subtitle content with a react component
   */
  children?: React.ReactNode;
  /**
   * Component to render on the right side
   */
  accessory?: React.ReactNode;
  /**
   * Component or image to render on the left side
   */
  image?: React.ReactNode;
  /**
   * Should show border. (default true)
   */
  border?: boolean;
  /**
   * Component to render below title and subtitle
   */
   bottom?: React.ReactNode;
}

const Cell = styled.View<{ border: boolean }>`
  flex-direction: row;
  min-height: 71px;
  border-bottom-width: ${props => props.border ? 1 : 0}px;
  border-bottom-color: ${props => props.theme.color.blue100};
`;

const Left = styled.View`
  justify-content: center;
  padding-left: 15px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const Center = styled.View<{ accessory: boolean }>`
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding-right: ${props => props.accessory ? 15 : 0}px;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const Right = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 15px;
`;

const Content = styled.View`
  flex-direction: column;
`;

const Title = styled.View`
`;

const TitleText = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 16px;
  color: ${props => props.theme.color.dark400};
`;

const Subtitle = styled.View`
  margin-top: 2px;
`;

const SubtitleText = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 15px;
  color: ${props => props.theme.color.dark300};
`;

export function TableViewCell(props: TableViewCellProps) {
  const { title, subtitle, image, accessory, children, border = true, bottom } = props;

  return (
    <SafeAreaView style={{ marginHorizontal: 16 }}>
      <Cell border={border}>
        {image && <Left>{image}</Left>}
        <Center accessory={!!accessory}>
          {children !== undefined ? children : (
            <Content>
              {title && <Title>{typeof title === 'string' ? <TitleText>{title}</TitleText> : title}</Title>}
              {subtitle && <Subtitle>{typeof subtitle === 'string' ? <SubtitleText>{subtitle}</SubtitleText> : subtitle}</Subtitle>}
            </Content>
          )}
          {bottom}
        </Center>
        {accessory && <Right>
          {accessory}
        </Right>}
      </Cell>
    </SafeAreaView>
  )
}
