import { useEffect, useState } from 'react'
import { Keyboard, Platform } from 'react-native'

// On-screen keyboard height (0 when hidden). iOS uses the `Will` events so it
// tracks the keyboard animation; the height includes the iOS safe-area inset.
export const useKeyboardHeight = () => {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setHeight(e.endCoordinates?.height ?? 0)
    })
    const hideSub = Keyboard.addListener(hideEvent, () => setHeight(0))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return height
}
