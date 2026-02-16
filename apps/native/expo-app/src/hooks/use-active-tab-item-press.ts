import { useState } from 'react'
import {
  useNavigationBottomTabPress,
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks/dist'

export function useActiveTabItemPress(tabIndex: number, scrollFn: any) {
  const [active, setActive] = useState(false)
  useNavigationComponentDidAppear(() => {
    setActive(true)
  })
  useNavigationComponentDidDisappear(() => {
    setActive(false)
  })
  useNavigationBottomTabPress((e) => {
    if (e.tabIndex === tabIndex && active) {
      scrollFn()
    }
  })
}
