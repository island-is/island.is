import { useMutation } from '@apollo/client'
import {
  ApplicationState,
  ApplicationStateUrl,
  eventTypeFromApplicationState,
  UpdateApplicationTableResponseType,
} from '@island.is/financial-aid/shared/lib'
import { useContext } from 'react'
import { UpdateApplicationTableMutation } from '../../graphql'
import { AdminContext } from '../components/AdminProvider/AdminProvider'
import { ApplicationFiltersContext } from '../components/ApplicationFiltersProvider/ApplicationFiltersProvider'

interface SaveData {
  updateApplicationTable: UpdateApplicationTableResponseType
}

export const useAllApplications = () => {
  const [updateApplicationMutation, { loading: saveLoading }] =
    useMutation<SaveData>(UpdateApplicationTableMutation)

  const { setApplicationFilters } = useContext(ApplicationFiltersContext)
  const { admin } = useContext(AdminContext)

  const changeApplicationTable = async (
    applicationId: string,
    state: ApplicationState,
    stateUrl: ApplicationStateUrl,
  ) => {
    if (saveLoading === false && applicationId) {
      const { data } = await updateApplicationMutation({
        variables: {
          input: {
            id: applicationId,
            state,
            staffId: admin?.staff?.id,
            stateUrl,
            event: eventTypeFromApplicationState[state],
          },
        },
      })

      if (data) {
        if (data.updateApplicationTable.filters) {
          setApplicationFilters(data.updateApplicationTable.filters)
        }

        return data.updateApplicationTable.applications
      }
    }
  }

  return changeApplicationTable
}
