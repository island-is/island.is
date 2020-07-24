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
        const nav = await Promise.all(
          Object.keys(modules).map((key) => modules[key].navigation(userInfo)),
        )

        dispatch({
          type: 'fetchNavigationFulfilled',
          payload: {
            navigation: {
              ...navigation,
              applications: nav[0],
              documents: nav[1],
              settings: nav[2],
            },
          },
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
