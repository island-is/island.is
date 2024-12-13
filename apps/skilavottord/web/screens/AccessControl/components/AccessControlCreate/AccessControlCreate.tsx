import React, { FC, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import {
  CreateAccessControlInput,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'

import { AccessControlModal } from '../AccessControlModal/AccessControlModal'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasMunicipalityRole } from '@island.is/skilavottord-web/auth/utils'

interface AccessControlCreateProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (partner: CreateAccessControlInput) => Promise<void>
  recyclingPartners: Option[]
  roles: Option[]
  municipalities: Option[]
}

export const AccessControlCreate: FC<
  React.PropsWithChildren<AccessControlCreateProps>
> = ({
  title,
  text,
  show,
  onCancel,
  onSubmit,
  recyclingPartners,
  roles,
  municipalities,
}) => {
  const { user } = useContext(UserContext)

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  const getPartnerId = (
    municipalityId: string,
    partnerId: string,
    role: Role,
  ) => {
    // If the user has municipality role, then he can only create a new access under the same municipality
    if (hasMunicipalityRole(user?.role) && hasMunicipalityRole(role)) {
      return user.partnerId
    }

    // If selected role is municipality, use municipalityId, else use partnerId
    return hasMunicipalityRole(role) ? municipalityId : partnerId || null
  }

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, partnerId, email, phone, municipalityId }) => {
      return onSubmit({
        nationalId,
        name,
        phone,
        email,
        role: role.value,
        partnerId: getPartnerId(municipalityId, partnerId, role),
      })
    },
  )

  useEffect(() => {
    // clear the form if re-opened
    reset()
  }, [show, reset])

  return (
    <AccessControlModal
      title={title}
      text={text}
      show={show}
      onCancel={onCancel}
      onSubmit={handleOnSubmit}
      recyclingPartners={recyclingPartners}
      municipalities={municipalities}
      roles={roles}
      control={control}
      errors={errors}
      partnerIdRequired={
        watch('role')?.value === Role.recyclingCompanyAdmin ||
        watch('role')?.value === Role.recyclingCompany
      }
    />
  )
}
