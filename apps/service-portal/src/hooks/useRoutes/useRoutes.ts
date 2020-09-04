import { useStore } from '../../store/stateProvider'
import { useEffect } from 'react'
import { ServicePortalRoute } from '@island.is/service-portal/core'
import { ActionType } from '../../store/actions'
import { useModuleProps } from '../useModuleProps/useModuleProps'

export const useRoutes = () => {
  const [{ modules }, dispatch] = useStore()
  const { userInfo, client } = useModuleProps()

  useEffect(() => {
    if (userInfo === null) return
    const r = modules.reduce(
      (prev, curr) => [
        ...prev,
        ...curr.routes({
          userInfo,
          client,
        }),
      ],
      [] as ServicePortalRoute[],
    )
    dispatch({
      type: ActionType.SetRoutesFulfilled,
      payload: r,
    })
  }, [userInfo, dispatch, modules, client])
}

export default useRoutes
