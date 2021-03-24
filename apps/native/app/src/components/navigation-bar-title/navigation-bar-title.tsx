import { theme } from '@island.is/island-ui/theme';
import React from 'react';
import { View, Text } from 'react-native';

interface NavigationBarTitleProps {
  title: string;
}

export const NavigationBarTitle = ({ title }: NavigationBarTitleProps) => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <Text
      style={{
        color: theme.color.blue600,
        fontFamily: 'IBMPlexSans-Bold',
        fontSize: 19,
        fontWeight: '600',
        paddingLeft: 16
      }}
    >
      {title}
    </Text>
   </View>
);
