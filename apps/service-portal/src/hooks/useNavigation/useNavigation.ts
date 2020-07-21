import { useEffect } from 'react'
import { useStore } from '../../stateProvider'

const useNavigation = () => {
  const [
    { modules, navigation, navigationState, activeSubjectId },
    dispatch,
  ] = useStore()

  useEffect(() => {
    async function fetchNavigation() {
      dispatch({ type: 'fetchNavigationPending' })

      const moduleProps = {
        activeSubjectNationalId: activeSubjectId,
      }

      try {
        // TODO: Wait for them all or load them in as soon as they arrive?
        const nav = await Promise.all([
          modules.applicationsModule.navigation(moduleProps),
          modules.documentsModule.navigation(moduleProps),
          modules.settingsModule.navigation(moduleProps),
        ])

        dispatch({
          type: 'fetchNavigationFulfilled',
          payload: {
            subjectId: activeSubjectId,
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

    if (
      navigationState.state === 'passive' ||
      navigationState.subjectId !== activeSubjectId
    )
      fetchNavigation()
  }, [activeSubjectId])

  return {
    navigation,
    navigationState,
  }
}

export default useNavigation
