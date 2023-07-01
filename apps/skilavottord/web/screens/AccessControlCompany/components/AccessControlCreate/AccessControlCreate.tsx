import React, { FC, useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import {
  ModalProps,
  PartnerPageLayout,
} from '@island.is/skilavottord-web/components'
import {
  CreateAccessControlInput,
  AccessControlRole,
} from '@island.is/skilavottord-web/graphql/schema'
import { UserContext } from '@island.is/skilavottord-web/context'

import { AccessControlModal } from '../AccessControlModal/AccessControlModal'

interface AccessControlCreateProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (partner: CreateAccessControlInput) => Promise<void>
  // recyclingPartners: Option[]
  roles: Option[]
}

export const AccessControlCreate: FC<
  React.PropsWithChildren<AccessControlCreateProps>
> = ({
  title,
  text,
  show,
  onCancel,
  onSubmit,
  // recyclingPartners,
  roles,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const { user } = useContext(UserContext)

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, email, phone, recyclingLocation }) => {
      return onSubmit({
        nationalId,
        name,
        phone,
        email,
        recyclingLocation,
        // role: AccessControlRole.recyclingCompany,
        role: role.value,
        partnerId: user?.partnerId,
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
      // recyclingPartners={recyclingPartners}
      roles={roles}
      control={control}
      errors={errors}
      // partnerIdRequired={watch('role')?.value === Role.recyclingCompanyAdmin}
    />
  )
}
