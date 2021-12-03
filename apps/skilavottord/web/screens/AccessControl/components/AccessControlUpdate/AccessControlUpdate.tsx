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
  currentPartner: AccessControl
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
  const { control, errors, setValue, handleSubmit } = useForm({
    mode: 'onChange',
  })

  useEffect(() => {
    console.log(currentPartner)
    if (currentPartner) {
      Object.entries(currentPartner).forEach(([key, value]) => {
        if (key === 'partnerId') {
          return setValue(
            key,
            recyclingPartners.find(
              (option) => option.value === currentPartner?.partnerId,
            ),
          )
        }
        if (key === 'role') {
          return setValue(
            key,
            roles.find((option) => option.value === currentPartner?.role),
          )
        }
        setValue(key, value)
      })
    }
  }, [currentPartner])

  const handleOnSubmit = handleSubmit(({ name, role, partnerId }) => {
    return onSubmit({
      name,
      role: role.value,
      partnerId: partnerId.value,
    })
  })

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
