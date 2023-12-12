import React from 'react';
import styled from 'styled-components/native';
import {dynamicColor, useDynamicColor} from '../../utils';
import {font} from '../../utils/font';
import {Image} from 'react-native';
import closeIcon from '../../assets/icons/close.png';

const Host = styled.Pressable`
  overflow: hidden;
  flex-direction: row;
  gap: 4px;
  border-radius: ${({theme}) => theme.border.radius.standard};
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

const Text = styled.Text`
  ${font({
    fontSize: 14,
    fontWeight: '600',
    color: ({theme}) => ({
      light: theme.color.blue400,
      dark: theme.color.blue300,
    }),
  })}
`;

interface TagProps {
  title: string;
  onClose?(): void;
  closable?: boolean;
}

export function Tag({title, closable, onClose}: TagProps) {
  const dynamicColor = useDynamicColor();
  return (
    <Host
      onPress={onClose}
      style={({pressed}) => ({
        backgroundColor: pressed
          ? dynamicColor({
              light: '#E9F1FF',
              dark: '#0050D1',
            })
          : dynamicColor({
              light: dynamicColor.theme.color.blue100,
              dark: dynamicColor.theme.color.blue600,
            }),
      })}>
      <Text>{title}</Text>
      {closable && (
        <Image
          source={closeIcon}
          style={{width: 16, height: 16, marginTop: 1}}
        />
      )}
    </Host>
  );
}
