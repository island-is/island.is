import { useContext } from 'react'
import { useMutation } from '@apollo/client'
import {
  Application,
  ApplicationState,
  UpdateApplicationResponseType,
} from '@island.is/financial-aid/shared/lib'
import { UpdateApplicationMutation } from '../../graphql'
import { ApplicationFiltersContext } from '../components/ApplicationFiltersProvider/ApplicationFiltersProvider'
import { AdminContext } from '../components/AdminProvider/AdminProvider'

interface SaveData {
  updateApplicationRes: UpdateApplicationResponseType
}

export const useApplicationState = () => {
  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationMutation)

  const { setApplicationFilters } = useContext(ApplicationFiltersContext)

  const { admin } = useContext(AdminContext)

  const changeApplicationState = async (
    application: Application,
    state: ApplicationState,
    amount?: number,
    rejection?: string,
  ) => {
    if (saveLoading === false && application) {
      const { data } = await updateApplicationMutation({
        variables: {
          input: {
            id: application.id,
            state,
            amount,
            rejection,
            staffId: admin?.staff?.id,
          },
        },
      })

      if (data) {
        if (data.updateApplicationRes.filters) {
          setApplicationFilters(data.updateApplicationRes.filters)
        }
        return data.updateApplicationRes.application
      }
    }
  }

  return changeApplicationState
}
