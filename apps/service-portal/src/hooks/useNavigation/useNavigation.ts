import { useEffect } from 'react'
import { useStore } from '../../stateProvider'

const useNavigation = () => {
  const [
    { modules, navigation, navigationState, userInfo },
    dispatch,
  ] = useStore()

  useEffect(() => {
    async function fetchNavigation() {
      dispatch({ type: 'fetchNavigationPending' })

      try {
        // TODO: Wait for them all or load them in as soon as they arrive?
        const navigation = await Promise.all(
          modules.map((module) => module.navigation(userInfo)),
        )

        dispatch({
          type: 'fetchNavigationFulfilled',
          payload: navigation,
        })
      } catch (err) {
        dispatch({ type: 'fetchNavigationFailed' })
      }
    }

    fetchNavigation()
  }, [userInfo]) // eslint-disable-line

  return {
    navigation,
    navigationState,
  }
}

export default useNavigation
