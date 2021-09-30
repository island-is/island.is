import { useMutation } from '@apollo/client'
import {
  Application,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { UpdateApplicationTableMutation } from '../../graphql'

interface SaveData {
  updateApplication: Application[]
}

export const useAllApplications = () => {
  const [
    updateApplicationMutation,
    { loading: saveLoading },
  ] = useMutation<SaveData>(UpdateApplicationTableMutation)

  const changeApplicationTable = async (
    applicationId: string,
    state: ApplicationState,
    staffId: string,
  ) => {
    if (saveLoading === false && applicationId) {
      const { data } = await updateApplicationMutation({
        variables: {
          input: {
            id: applicationId,
            state,
            staffId,
          },
        },
      })

      if (data) {
        return data.updateApplication
      }
    }
  }

  return changeApplicationTable
}
