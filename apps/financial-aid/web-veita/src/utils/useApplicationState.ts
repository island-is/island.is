import { useContext } from 'react'
import { useMutation } from '@apollo/client'
import {
  Application,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { UpdateApplicationMutation } from '../../graphql'
import { ApplicationFiltersContext } from '../components/ApplicationFiltersProvider/ApplicationFiltersProvider'

interface SaveData {
  application: Application
}

export const useApplicationState = () => {
  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationMutation)

  const { applicationFilters, setApplicationFilters } = useContext(
    ApplicationFiltersContext,
  )

  const save = async (
    application: Application,
    state: ApplicationState,
    amount?: number,
    rejection?: string,
  ) => {
    const prevState = application.state

    if (saveLoading === false && application) {
      await updateApplicationMutation({
        variables: {
          input: {
            id: application.id,
            state: state,
            amount: amount,
            rejection: rejection,
          },
        },
      })
    }

    if (applicationFilters && setApplicationFilters) {
      setApplicationFilters((preState) => ({
        ...preState,
        [prevState]: applicationFilters[prevState] - 1,
        [state]: applicationFilters[state] + 1,
      }))
    }
  }

  return save
}
