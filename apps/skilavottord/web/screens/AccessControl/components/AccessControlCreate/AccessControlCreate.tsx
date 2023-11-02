import React, { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import {
  CreateAccessControlInput,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'

import { AccessControlModal } from '../AccessControlModal/AccessControlModal'

interface AccessControlCreateProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (partner: CreateAccessControlInput) => Promise<void>
  recyclingPartners: Option[]
  roles: Option[]
}

export const AccessControlCreate: FC<
  React.PropsWithChildren<AccessControlCreateProps>
> = ({ title, text, show, onCancel, onSubmit, recyclingPartners, roles }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, partnerId, email, phone }) => {
      return onSubmit({
        nationalId,
        name,
        phone,
        email,
        role: role.value,
        partnerId: partnerId?.value,
      })
    },
  )

  return (
    <AccessControlModal
      title={title}
      text={text}
      show={show}
      onCancel={onCancel}
      onSubmit={handleOnSubmit}
      recyclingPartners={recyclingPartners}
      roles={roles}
      control={control}
      errors={errors}
      partnerIdRequired={watch('role')?.value === Role.recyclingCompanyAdmin}
    />
  )
}
