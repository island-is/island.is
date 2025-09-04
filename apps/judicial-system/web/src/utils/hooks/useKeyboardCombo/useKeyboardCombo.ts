import { useEffect } from 'react'

export const useKeyboardCombo = (
  keyCombo: string,
  callback: () => void,
): void => {
  const isSuperset = (setA: Set<string>, setB: Set<string>) => {
    for (const val of setA) {
      if (!setB.has(val)) return false
    }
    return true
  }

  useEffect(() => {
    const pressedKeys = new Set<string>()
    const keyComboSet = new Set<string>()
    const split = keyCombo.split('+')
    split.forEach((key) => keyComboSet.add(key.replace(' ', '')))

    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.metaKey) pressedKeys.add('Meta')
      if (evt.ctrlKey) pressedKeys.add('Control')
      pressedKeys.add(evt.key)

      if (isSuperset(keyComboSet, pressedKeys)) {
        callback()
        pressedKeys.clear()
      }
    }

    const handleKeyUp = (evt: KeyboardEvent) => {
      pressedKeys.delete(evt.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [callback, keyCombo])
}
