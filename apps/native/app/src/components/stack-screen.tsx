import { NetworkStatus } from '@apollo/client'
import {
  NativeStackHeaderItem,
  NativeStackHeaderItemProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack'
import { Stack } from 'expo-router'
import { cloneElement, useCallback, useMemo } from 'react'
import {
  Image,
  Platform,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native'
import { navbarCloseItem, navbarOfflineItem } from './navbar/navbar-items'

export type StackScreenOptions = Omit<
  NativeStackNavigationOptions,
  'unstable_headerLeftItems' | 'unstable_headerRightItems'
> & {
  headerRightItems?:
    | NativeStackHeaderItem[]
    | ((props: NativeStackHeaderItemProps) => NativeStackHeaderItem[])
  headerLeftItems?:
    | NativeStackHeaderItem[]
    | ((props: NativeStackHeaderItemProps) => NativeStackHeaderItem[])
}

export type StackScreenProps = {
  closeable?: boolean
  networkStatus?: NetworkStatus | NetworkStatus[]
  options?: StackScreenOptions
  name?: string
}

function mapAndroidHeaderItem(
  item: NativeStackHeaderItem | undefined,
  index: number,
) {
  if (!item) {
    return null
  }

  if (item.type === 'custom') {
    return cloneElement(item.element, { key: index })
  }

  if (item.type === 'button') {
    return (
      <TouchableNativeFeedback
        key={item.identifier ?? index}
        onPress={item.onPress}
      >
        {item.icon ? (
          <Image
            source={item.icon?.type === 'image' ? item.icon.source : undefined}
            style={{ width: 24, height: 24, marginHorizontal: 8 }}
          />
        ) : (
          <Text
            style={{
              fontFamily: item.labelStyle?.fontFamily,
              fontSize: item.labelStyle?.fontSize,
              fontWeight: item.labelStyle?.fontWeight as any,
              color: item.tintColor,
            }}
          >
            {item.label}
          </Text>
        )}
      </TouchableNativeFeedback>
    )
  }
}

function callbackOrValue<T>(
  callbackOrValue?: T | ((props: NativeStackHeaderItemProps) => T) | undefined,
  props?: NativeStackHeaderItemProps,
): T | undefined {
  if (typeof callbackOrValue === 'function') {
    return (callbackOrValue as Function)(props)
  }
  return callbackOrValue
}

export function StackScreen({
  networkStatus,
  options,
  closeable,
}: StackScreenProps) {
  const leftAlignSpacing = useMemo(() => {
    const title = options?.title
    if (typeof title === 'string') {
      return title.length < 24
    }
    return false
  }, [options?.title])
  const headerLeftItems = useCallback(
    (props?: NativeStackHeaderItemProps) => {
      const currentLeftItems =
        callbackOrValue(options?.headerLeftItems, props) || []
      return [...currentLeftItems]
    },
    [options?.headerLeftItems],
  )

  const headerRightItems = useCallback(
    (props?: NativeStackHeaderItemProps) => {
      const currentRightItems =
        callbackOrValue(options?.headerRightItems, props) || []

      const result = [
        leftAlignSpacing
          ? {
              type: 'custom',
              element: <View style={{ width: 30 }} />,
              hidesSharedBackground: true,
            }
          : undefined,
        navbarOfflineItem(networkStatus),
        ...currentRightItems,
        closeable && Platform.OS === 'ios' ? navbarCloseItem() : undefined,
      ].filter(Boolean) as NativeStackHeaderItem[]

      return result
    },
    [options?.headerRightItems, networkStatus, closeable, leftAlignSpacing],
  )

  // Android doesn't support dynamic header items, so we need to compute them here.
  const { headerLeft, headerRight } = useMemo(() => {
    if (Platform.OS === 'ios') {
      return {
        headerLeft: undefined,
        headerRight: undefined,
      }
    }
    const leftItems = headerLeftItems()
      .map(mapAndroidHeaderItem)
      .filter(Boolean)
    const rightItems = headerRightItems()
      .map(mapAndroidHeaderItem)
      .filter(Boolean)
    return {
      headerLeft: leftItems.length > 0 ? () => <>{leftItems}</> : undefined,
      headerRight: rightItems.length > 0 ? () => <>{rightItems}</> : undefined,
    }
  }, [headerLeftItems, headerRightItems])

  return (
    <Stack.Screen
      options={{
        unstable_headerLeftItems: headerLeftItems,
        headerLeft,
        unstable_headerRightItems: headerRightItems,
        headerRight,
        ...options,
      }}
    />
  )
}
