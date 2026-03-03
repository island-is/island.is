import { NetworkStatus } from '@apollo/client'
import {
  NativeStackHeaderItem,
  NativeStackHeaderItemProps,
  NativeStackNavigationOptions
} from '@react-navigation/native-stack'
import {
  Stack
} from 'expo-router'
import { cloneElement, useCallback } from 'react'
import { Image, Platform, TouchableNativeFeedback } from 'react-native'
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
        <Image
          source={item.icon?.type === 'image' ? item.icon.source : undefined}
          style={{ width: 24, height: 24, marginHorizontal: 8 }}
        />
      </TouchableNativeFeedback>
    )
  }
}

function callbackOrValue<T>(
  callbackOrValue?:
    | T
    | ((props: NativeStackHeaderItemProps) => T)
    | undefined,
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
  closeable
}: StackScreenProps) {
  const headerLeftItems = useCallback((props?: NativeStackHeaderItemProps) => {
    const currentLeftItems = callbackOrValue(options?.headerLeftItems, props) || [];
    return [
      ...currentLeftItems,
    ]
  }, [options?.headerLeftItems])

  const headerRightItems = useCallback((props?: NativeStackHeaderItemProps) => {
    const currentRightItems = callbackOrValue(options?.headerRightItems, props) || [];

    const result = [
      navbarOfflineItem(networkStatus),
      ...currentRightItems,
      closeable ? navbarCloseItem() : undefined,
    ].filter(Boolean) as NativeStackHeaderItem[];

    return result;
  }, [options?.headerRightItems, networkStatus, closeable])

  return (
    <Stack.Screen
      options={{
        unstable_headerLeftItems: headerLeftItems,
        headerLeft:
          Platform.OS === 'android' && headerLeftItems?.length
            ? () => <>{headerLeftItems().map(mapAndroidHeaderItem)}</>
            : undefined,
        unstable_headerRightItems: headerRightItems,
        headerRight:
          Platform.OS === 'android'
            ? () => <>{headerRightItems().map(mapAndroidHeaderItem)}</>
            : undefined,
        ...options,
      }}
    />
  )
}
