import React, { FC, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import {
  AccessControl,
  Role,
  UpdateAccessControlInput,
} from '@island.is/skilavottord-web/graphql/schema'

import { getPartnerId } from '@island.is/skilavottord-web/utils/accessUtils'
import { AccessControlModal } from '../AccessControlModal/AccessControlModal'
import { UserContext } from '@island.is/skilavottord-web/context'

interface AccessControlUpdateProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (partner: UpdateAccessControlInput) => Promise<void>
  recyclingPartners: Option[]
  roles: Option[]
  currentPartner?: AccessControl
  municipalities: Option[]
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
  municipalities,
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

  const { user } = useContext(UserContext)

  useEffect(() => {
    reset({
      ...currentPartner,
      role: roles.find((option) => option.value === currentPartner?.role),
      partnerId: recyclingPartners.find(
        (option) =>
          option.value === currentPartner?.recyclingPartner?.companyId,
      ),
      municipalityId: municipalities.find(
        (option) =>
          option.value === currentPartner?.recyclingPartner?.companyId,
      ),
    })
  }, [currentPartner, municipalities, recyclingPartners, reset, roles])

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, partnerId, email, phone, municipalityId }) => {
      return onSubmit({
        nationalId,
        name,
        email,
        phone,
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
      partnerIdRequired={
        watch('role')?.value === Role.recyclingCompanyAdmin ||
        watch('role')?.value === Role.recyclingCompany
      }
      nationalIdDisabled
      currentPartner={currentPartner}
      municipalities={municipalities}
    />
  )
}
