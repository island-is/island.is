import React, { FC, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import {
  AccessControl,
  AccessControlRole,
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
    let recyclingPartner = null

    // recyclingCompany && recyclingCompanyAdmin can be added directly under municipality so we need to find the municipality if set
    if (
      currentPartner?.role === AccessControlRole.recyclingCompany ||
      currentPartner?.role === AccessControlRole.recyclingCompanyAdmin
    ) {
      recyclingPartner = recyclingPartners.find(
        (option) =>
          option.value === currentPartner?.recyclingPartner?.companyId,
      )

      if (!recyclingPartner) {
        recyclingPartner = municipalities.find(
          (option) =>
            option.value === currentPartner?.recyclingPartner?.companyId,
        )
      }
    }

    reset({
      ...currentPartner,
      role: roles.find((option) => option.value === currentPartner?.role),
      partnerId: recyclingPartner,
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
