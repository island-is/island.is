import { useStore } from '../../store/stateProvider'
import { useEffect } from 'react'
import { ServicePortalRoute } from '@island.is/service-portal/core'
import { ActionType } from '../../store/actions'

export const useRoutes = () => {
  const [{ userInfo, modules }, dispatch] = useStore()

  useEffect(() => {
    const r = modules.reduce(
      (prev, curr) => [...prev, ...curr.routes(userInfo)],
      [] as ServicePortalRoute[],
    )
    dispatch({
      type: ActionType.SetRoutesFulfilled,
      payload: r,
    })
  }, [userInfo, dispatch, modules])
}

export default useRoutes
