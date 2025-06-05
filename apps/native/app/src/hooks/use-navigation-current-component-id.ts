import { useContext, useEffect, useState } from 'react'
import { Navigation } from 'react-native-navigation'
import { NavigationContext } from 'react-native-navigation-hooks'

/**
 * Hook to get the current component ID from the navigation context.
 */
export const useNavigationCurrentComponentId = () => {
  const { componentId } = useContext(NavigationContext)
  const [currentComponentId, setCurrentComponentId] = useState(componentId)

  useEffect(() => {
    const subscription = Navigation.events().registerComponentDidAppearListener(
      (event) => {
        setCurrentComponentId(event.componentId)
      },
    )

    return () => {
      subscription.remove()
    }
  }, [])

  return currentComponentId
}
