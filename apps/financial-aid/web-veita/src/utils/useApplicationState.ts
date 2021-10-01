import { useContext } from 'react'
import { useMutation } from '@apollo/client'
import {
  Application,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { UpdateApplicationMutation } from '../../graphql'
import { ApplicationFiltersContext } from '../components/ApplicationFiltersProvider/ApplicationFiltersProvider'
import { AdminContext } from '../components/AdminProvider/AdminProvider'

interface SaveData {
  updateApplication: Application
}

export const useApplicationState = () => {
  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationMutation)

  const { applicationFilters, setApplicationFilters } = useContext(
    ApplicationFiltersContext,
  )
  const { admin } = useContext(AdminContext)

  const changeApplicationState = async (
    application: Application,
    state: ApplicationState,
    amount?: number,
    rejection?: string,
  ) => {
    const prevState = application.state

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
        if (applicationFilters && setApplicationFilters) {
          setApplicationFilters((preState) => ({
            ...preState,
            [prevState]: applicationFilters[prevState] - 1,
            [state]: applicationFilters[state] + 1,
          }))
        }

        return data.updateApplication
      }
    }
  }

  return changeApplicationState
}
