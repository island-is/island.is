import React, { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import {
  AccessControl,
  UpdateAccessControlInput,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'

import { AccessControlModal } from '../AccessControlModal/AccessControlModal'

interface AccessControlUpdateProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (partner: UpdateAccessControlInput) => Promise<void>
  recyclingPartners: Option[]
  roles: Option[]
  currentPartner?: AccessControl
}

export const AccessControlUpdate: FC<
  React.PropsWithChildren<AccessControlUpdateProps>
> = ({
  title,
  text,
  show,
  onCancel,
  onSubmit,
  recyclingPartners,
  roles,
  currentPartner,
}) => {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  useEffect(() => {
    reset({
      ...currentPartner,
      role: roles.find((option) => option.value === currentPartner?.role),
      partnerId: recyclingPartners.find(
        (option) =>
          option.value === currentPartner?.recyclingPartner?.companyId,
      ),
    })
  }, [currentPartner])

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, partnerId, email, phone }) => {
      return onSubmit({
        nationalId,
        name,
        email,
        phone,
        role: role.value,
        partnerId: partnerId?.value || null,
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
      nationalIdDisabled
    />
  )
}
