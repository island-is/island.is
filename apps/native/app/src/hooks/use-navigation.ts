import { LayoutComponent, Navigation, Options } from 'react-native-navigation'
import { ComponentRegistry } from '../utils/component-registry'
import { useCallback } from 'react'

type ComponentName = typeof ComponentRegistry[keyof typeof ComponentRegistry]

/**
 * Hook providing navigation helpers for React Native Navigation.
 *
 * @returns:
 *   - showModal: Show a modal with a registered component.
 *   - dismissModal: Dismiss a modal by component ID.
 *   - navigate: Push a new screen onto the navigation stack.
 */
export const useNavigation = () => {
  const showModal = useCallback(
    <P extends {} = {}>(
      name: ComponentName,
      options?: Omit<LayoutComponent<P>, 'name'>,
    ) => {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name,
                ...options,
              },
            },
          ],
        },
      })
    },
    [],
  )

  const dismissModal = useCallback(
    (componentId: string, mergeOptions?: Options) => {
      Navigation.dismissModal(componentId, mergeOptions)
    },
    [],
  )

  return { showModal, dismissModal }
}
