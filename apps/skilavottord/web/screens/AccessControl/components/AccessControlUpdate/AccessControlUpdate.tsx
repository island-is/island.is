import React, { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import {
  AccessControl,
  UpdateAccessControlInput,
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

export const AccessControlUpdate: FC<AccessControlUpdateProps> = ({
  title,
  text,
  show,
  onCancel,
  onSubmit,
  recyclingPartners,
  roles,
  currentPartner,
}) => {
  const { control, errors, reset, handleSubmit } = useForm({
    mode: 'onChange',
  })

  useEffect(() => {
    reset({
      ...currentPartner,
      role: roles.find((option) => option.value === currentPartner?.role),
      partnerId: recyclingPartners.find(
        (option) => option.value === currentPartner?.partnerId,
      ),
    })
  }, [currentPartner])

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, partnerId }) => {
      return onSubmit({
        nationalId,
        name,
        role: role.value,
        partnerId: partnerId.value,
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
      isNationalIdDisabled
    />
  )
}
