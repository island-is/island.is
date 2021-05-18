import React from 'react'
import { ImageSourcePropType, Platform, SafeAreaView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import closeIcon from '../../assets/icons/close.png'
import { testIDs } from '../../../../app/src/utils/test-ids'

const Header = styled.View`
  padding-top: 20px;
  padding-bottom: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const HeaderTitle = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 21px;
  color: ${(props) => props.theme.shade.foreground};
`

const Handle = styled.View`
  position: absolute;
  width: 120px;
  height: 4px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.dark100};
  top: 5px;
  left: 50%;
  margin-left: -60px;
  opacity: 1;
`

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${(props) =>
    props.theme.isDark ? '#080817' : props.theme.color.blue100};
  align-items: center;
  justify-content: center;
`

const CloseIcon = styled.Image`
  width: 24px;
  height: 24px;
`

export function NavigationBarSheet({
  title,
  onClosePress,
  style,
}: {
  title: string
  onClosePress(): void
  style?: any
}) {
  const theme = useTheme()
  return (
    <>
      {Platform.OS === 'ios' && !Platform.isPad && (
        <Handle
          style={{
            backgroundColor: theme.shade.shade200,
          }}
        />
      )}
      <SafeAreaView>
        <Header style={style}>
          <HeaderTitle>{title}</HeaderTitle>
          <CloseButton onPress={onClosePress} testID={testIDs.NAVBAR_SHEET_CLOSE_BUTTON}>
            <CloseIcon
              style={{
                tintColor: theme.color.blue400,
              }}
              source={closeIcon as ImageSourcePropType}
            />
          </CloseButton>
        </Header>
      </SafeAreaView>
    </>
  )
}
