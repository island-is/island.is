import { LayoutComponent, Navigation, Options } from 'react-native-navigation'
import { ComponentRegistry } from '../utils/component-registry'
import { useCallback } from 'react'

type ComponentName = typeof ComponentRegistry[keyof typeof ComponentRegistry]

/**
 * Hook providing navigation modal wrappers for React Native Navigation.
 * Provides a simplified interface for working with the Navigation modal methods.
 * It also makes sure that the modals exist in the component registry.
 *
 * @example
 * const { showModal, dismissModal } = useNavigationModal()
 *
 * showModal(ComponentRegistry.DocumentReplyScreen, {
 *   passProps: {
 *     documentId: '123',
 *   },
 * })
 *
 * dismissModal(ComponentRegistry.DocumentReplyScreen)
 */
export const useNavigationModal = () => {
  const showModal = useCallback(
    <P extends object = Record<string, never>>(
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
