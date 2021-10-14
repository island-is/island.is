import { useContext } from 'react'
import { useMutation } from '@apollo/client'
import {
  Application,
  ApplicationEventType,
  ApplicationFilters,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationFiltersContext } from '../components/ApplicationFiltersProvider/ApplicationFiltersProvider'
import { AdminContext } from '../components/AdminProvider/AdminProvider'
import {
  UpdateApplicationMutation,
  ApplicationFiltersMutation,
} from '../../graphql/sharedGql'

export const useApplicationState = () => {
  const [updateApplicationMutation, { loading: saveLoading }] = useMutation<{
    updateApplication: Application
  }>(UpdateApplicationMutation)

  const [applicationFiltersQuery, { loading: loadingFilters }] = useMutation<{
    applicationFilters: ApplicationFilters
  }>(ApplicationFiltersMutation)

  const { setApplicationFilters } = useContext(ApplicationFiltersContext)

  const { admin } = useContext(AdminContext)

  const fetchAndSetFilters = async () => {
    const { data } = await applicationFiltersQuery()
    if (data) {
      setApplicationFilters(data.applicationFilters)
    }
  }

  const changeApplicationState = async (
    applicationId: string,
    state: ApplicationState,
    event: ApplicationEventType,
    amount?: number,
    rejection?: string,
    comment?: string,
  ) => {
    if (saveLoading === false && loadingFilters === false && applicationId) {
      const { data } = await updateApplicationMutation({
        variables: {
          input: {
            id: applicationId,
            state,
            amount,
            rejection,
            comment,
            staffId: admin?.staff?.id,
            event,
          },
        },
      })

      if (data) {
        await fetchAndSetFilters()
        return data.updateApplication
      }
    }
  }

  return changeApplicationState
}
