import { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { UpdateStaffMutation } from '../../graphql'
import { toast } from '@island.is/island-ui/core'
import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

export const useStaff = () => {
  const { admin, setAdmin } = useContext(AdminContext)

  const [updateStaff, { loading: staffActivationLoading }] =
    useMutation(UpdateStaffMutation)

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
        toast.success('Stillingar hafa verið uppfærðar')
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra stillingar, vinsamlega reynið aftur síðar',
        )
      })
  }

  const updateInfo = async (
    id?: string,
    nationalId?: string,
    roles?: StaffRole[],
    nickname?: string,
    email?: string,
    usePseudoName?: boolean,
    updateAdmin?: boolean,
    municipalityIds?: string[],
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
            usePseudoName,
            municipalityIds,
          },
        },
      }).then((res) => {
        if (updateAdmin && res.data?.updateStaff && setAdmin && admin) {
          setAdmin({ ...admin, staff: res.data?.updateStaff })
        }

        toast.success('Stillingar hafa verið uppfærðar')
      })
    } catch (e) {
      toast.error(
        'Ekki tókst að uppfæra stillingar, vinsamlega reynið aftur síðar',
      )
    }
  }

  return { changeUserActivity, staffActivationLoading, updateInfo }
}
