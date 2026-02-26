import React from 'react'
import {
  ImageSourcePropType,
  Platform,
  PlatformColor,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { LoadingIcon } from '../../../components/nav-loading-spinner/loading-icon'
import { OfflineIcon } from '../../../components/offline/offline-icon'
import { useOfflineStore } from '../../../stores/offline-store'
import closeIcon from '../../assets/icons/close.png'
import { dynamicColor } from '../../utils/dynamic-color'
import { font } from '../../utils/font'
import { SafeAreaView } from 'react-native-safe-area-context'

const Header = styled.View`
  padding-top: 20px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`

const HeaderTitle = styled.Text`
  margin-top: 32px;
  ${font({
    fontWeight: '600',
    fontSize: 26,
    lineHeight: 32,
    color: 'foreground',
  })}
`

const Handle = styled.View`
  position: absolute;
  width: 120px;
  height: ${({ theme }) => theme.spacing.smallGutter}px;
  border-radius: ${({ theme }) => theme.spacing.smallGutter}px;
  background-color: ${dynamicColor('shade300')};
  top: 5px;
  left: 50%;
  margin-left: -60px;
  opacity: 1;
`

const IconsWrapper = styled.View`
  margin-left: auto;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

const CloseButton = styled.TouchableOpacity`
  width: ${({ theme }) => theme.spacing[4]}px;
  height: ${({ theme }) => theme.spacing[4]}px;
  border-radius: ${({ theme }) => theme.spacing[2]}px;
  background-color: ${dynamicColor((props) => ({
    dark: props.theme.color.dark400,
    light: props.theme.color.blue100,
  }))};
  align-items: center;
  justify-content: center;
`

const CloseIcon = styled.Image`
  width: ${({ theme }) => theme.spacing[3]}px;
  height: ${({ theme }) => theme.spacing[3]}px;
`

type NavigationBarSheetProps = {
  title?: React.ReactNode
  componentId?: string
  onClosePress(): void
  style?: ViewStyle
  showLoading?: boolean
  closable?: boolean
}

export function NavigationBarSheet(props: NavigationBarSheetProps) {
  return null;
}

export function OldNavigationBarSheet({
  title,
  onClosePress,
  style,
  showLoading,
  closable = true,
}: NavigationBarSheetProps) {
  const isConnected = useOfflineStore(({ isConnected }) => isConnected)
  const wd = useWindowDimensions()
  const theme = useTheme()
  const isLandscape = wd.width > wd.height
  const isHandle = Platform.OS === 'ios' && !Platform.isPad && !isLandscape

  // @todo use a store to register if a modal is beeing shown.
  // then do the same isHandle check there to toggle status-bar color

  return (
    <View
      style={{
        backgroundColor:
          Platform.OS === 'ios'
            ? PlatformColor('systemBackground')
            : theme.shade.background,
      }}
    >
      {isHandle && closable && <Handle />}
      <SafeAreaView edges={['left', 'right']}>
        {(closable || title) && (
          <Header style={style}>
            {typeof title === 'string' ? (
              <HeaderTitle>{title}</HeaderTitle>
            ) : (
              title
            )}
            <IconsWrapper>
              {/*Only show loading icon if connected*/}
              {showLoading && isConnected ? <LoadingIcon /> : null}
              <OfflineIcon />
              {closable && (
                <CloseButton
                  onPress={onClosePress}
                  testID="NAVBAR_SHEET_CLOSE_BUTTON"
                  accessibilityLabel="Close"
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                  }}
                >
                  <CloseIcon
                    style={{
                      tintColor: theme.color.blue400,
                    }}
                    source={closeIcon as ImageSourcePropType}
                  />
                </CloseButton>
              )}
            </IconsWrapper>
          </Header>
        )}
      </SafeAreaView>
    </View>
  )
}
