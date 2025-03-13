import React, { FC, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import {
  CreateAccessControlInput,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'

import { UserContext } from '@island.is/skilavottord-web/context'
import { getPartnerId } from '@island.is/skilavottord-web/utils/accessUtils'
import { AccessControlModal } from '../AccessControlModal/AccessControlModal'

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

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, partnerId, email, phone, municipalityId }) => {
      return onSubmit({
        nationalId,
        name,
        phone,
        email,
        role: role.value,
        partnerId: getPartnerId(
          user,
          municipalityId?.value,
          partnerId?.value,
          role.value,
        ),
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
        (watch('role')?.value === Role.recyclingCompanyAdmin ||
          watch('role')?.value === Role.recyclingCompany) ??
        false
      }
    />
  )
}
