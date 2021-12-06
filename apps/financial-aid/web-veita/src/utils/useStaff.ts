import { useMutation } from '@apollo/client'
import { UpdateStaffMutation } from '../../graphql'
import { toast } from '@island.is/island-ui/core'
import { StaffRole } from '@island.is/financial-aid/shared/lib'

export const useStaff = () => {
  const [updateStaff, { loading: staffActivationLoading }] = useMutation(
    UpdateStaffMutation,
  )

  const changeUserActivity = async (active: boolean, id: string) => {
    await updateStaff({
      variables: {
        input: {
          id,
          active,
        },
      },
    })
      .then(() => {
        toast.success('Það tókst að uppfæra notanda')
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra notanda, vinsamlega reynið aftur síðar',
        )
      })
  }

  const updateInfo = async (
    id: string,
    nationalId: string,
    roles: StaffRole[],
    nickname?: string,
    email?: string,
  ) => {
    try {
      await updateStaff({
        variables: {
          input: {
            id,
            nationalId,
            roles,
            nickname,
            email,
          },
        },
      }).then(() => {
        toast.success('Það tókst að uppfæra notanda')
      })
    } catch (e) {
      toast.error(
        'Ekki tókst að uppfæra notanda, vinsamlega reynið aftur síðar',
      )
    }
  }

  return { changeUserActivity, staffActivationLoading, updateInfo }
}
