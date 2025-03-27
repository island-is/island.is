import * as kennitala from 'kennitala'
import React, {
  BaseSyntheticEvent,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Control, Controller } from 'react-hook-form'
import { FieldError, FieldValues } from 'react-hook-form/dist/types'
import { DeepMap } from 'react-hook-form/dist/types/utils'

import { Box, Button, Option, Select, Stack } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  hasDeveloperRole,
  hasMunicipalityRole,
  hasRecyclingFundRole,
} from '@island.is/skilavottord-web/auth/utils'
import { Modal, ModalProps } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  AccessControl,
  AccessControlRole,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'

interface AccessControlModalProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>
  recyclingPartners: Option[]
  roles: Option[]
  errors: DeepMap<FieldValues, FieldError>
  control: Control<FieldValues>
  nationalIdDisabled?: boolean
  partnerIdRequired?: boolean
  municipalities?: Option[]
  currentPartner?: AccessControl
}

export const AccessControlModal: FC<
  React.PropsWithChildren<AccessControlModalProps>
> = ({
  title,
  text,
  show,
  onCancel,
  onSubmit,
  recyclingPartners,
  municipalities,
  roles,
  nationalIdDisabled = false,
  partnerIdRequired = false,
  errors,
  control,
  currentPartner,
}) => {
  const {
    t: { accessControl: t },
  } = useI18n()

  const { user } = useContext(UserContext)
  const [showCompanies, setShowCompaniesSelection] = useState(true)
  const [showMunicipalities, setShowMunicipalitiesSelection] = useState(false)

  useEffect(() => {
    const isCurrentPartnerMunicipality =
      currentPartner?.role === AccessControlRole.municipality

    if (user?.role === Role.municipality) {
      setShowCompaniesSelection(!isCurrentPartnerMunicipality)
      setShowMunicipalitiesSelection(false) // User with municipality role shall not be able to select other municipality
    } else if (
      currentPartner?.role === AccessControlRole.recyclingFund ||
      currentPartner?.role === AccessControlRole.developer
    ) {
      setShowCompaniesSelection(false)
      setShowMunicipalitiesSelection(false)
    } else {
      setShowCompaniesSelection(!isCurrentPartnerMunicipality)
      setShowMunicipalitiesSelection(isCurrentPartnerMunicipality)
    }
  }, [currentPartner, user])

  const handleRoleOnChange = (e: Option) => {
    // If the user selects municipality we don't need to select a recycling partner since muncipality can't be a recycling partner worker
    if (hasMunicipalityRole(user?.role)) {
      if (e && e.value === Role.municipality) {
        setShowCompaniesSelection(false)
      } else {
        setShowCompaniesSelection(true)
      }
      setShowMunicipalitiesSelection(false)
    } else if (
      hasRecyclingFundRole(user?.role) ||
      hasDeveloperRole(user?.role)
    ) {
      if (e && e.value === Role.municipality) {
        setShowCompaniesSelection(false)
        setShowMunicipalitiesSelection(true)
      } else if (
        e &&
        (e.value === Role.recyclingFund || e.value === Role.developer)
      ) {
        setShowMunicipalitiesSelection(false)
        setShowCompaniesSelection(false)
      } else {
        setShowMunicipalitiesSelection(false)
        setShowCompaniesSelection(true)
      }
    }
  }

  const getOptions = () => {
    if (hasMunicipalityRole(user?.role)) {
      return recyclingPartners
    } else {
      // Group recycling companies without a municipality
      const otherRecyclingCompanies = recyclingPartners
        .filter(
          (partner) =>
            !municipalities?.some(
              (municipality) => municipality.value === partner.municipalityId,
            ),
        )
        .map((partner) => ({
          label: partner.label,
          value: partner.value,
        }))

      // Build the select options
      return [
        // Map municipalities and their recycling companies
        ...(municipalities?.map((municipality) => {
          const relatedRecyclingCompanies = recyclingPartners
            .filter((partner) => partner.municipalityId === municipality.value)
            .map((partner) => ({
              label: partner.label,
              value: partner.value,
            }))

          return {
            label: municipality.label,
            value: municipality.value,
            options: [
              {
                label: municipality.label,
                value: municipality.value,
              },
              ...relatedRecyclingCompanies,
            ],
          }
        }) ?? []),
        {
          label: t.modal.inputs.recyclingCompanyOther,
          value: '-1',
          options: otherRecyclingCompanies,
        },
      ]
    }
  }

  return (
    <Modal
      title={title}
      text={text}
      show={show}
      onCancel={onCancel}
      onContinue={() => {
        // Intentionally left empty
      }}
      continueButtonText={t.modal.buttons.continue}
      cancelButtonText={t.modal.buttons.cancel}
    >
      <form onSubmit={onSubmit}>
        <Stack space={3}>
          <InputController
            id="nationalId"
            control={control}
            required
            label={t.modal.inputs.nationalId.label}
            placeholder={t.modal.inputs.nationalId.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.nationalId.rules?.required,
              },
              validate: {
                value: (value: number) => {
                  if (
                    value.toString().length === 10 &&
                    !kennitala.isPerson(value)
                  ) {
                    return t.modal.inputs.nationalId.rules?.validate
                  }
                },
              },
            }}
            type="tel"
            format="######-####"
            error={errors?.nationalId?.message}
            backgroundColor="blue"
            disabled={nationalIdDisabled}
          />
          <InputController
            id="name"
            control={control}
            required
            label={t.modal.inputs.name.label}
            placeholder={t.modal.inputs.name.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.name.rules?.required,
              },
            }}
            error={errors?.name?.message}
            backgroundColor="blue"
          />
          <InputController
            id="email"
            control={control}
            required
            label={t.modal.inputs.email.label}
            placeholder={t.modal.inputs.email.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.email.rules?.required,
              },
              pattern: {
                value:
                  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i,
                message: t.modal.inputs.email.rules?.validate,
              },
            }}
            error={errors?.email?.message}
            backgroundColor="blue"
          />
          <InputController
            id="phone"
            control={control}
            required
            label={t.modal.inputs.phone.label}
            placeholder={t.modal.inputs.phone.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.phone.rules?.required,
              },
            }}
            type="tel"
            error={errors?.phone?.message}
            backgroundColor="blue"
          />
          <Controller
            name="role"
            control={control}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.role.rules?.required,
              },
            }}
            render={({ field: { onChange, value, name } }) => {
              return (
                <Select
                  required
                  name={name}
                  label={t.modal.inputs.role.label}
                  placeholder={t.modal.inputs.role.placeholder}
                  size="md"
                  value={value}
                  hasError={!!errors?.role?.message}
                  errorMessage={errors?.role?.message}
                  backgroundColor="blue"
                  options={roles}
                  onChange={(e) => {
                    onChange(e)
                    handleRoleOnChange(e)
                  }}
                />
              )
            }}
          />
          {showCompanies && (
            <Controller
              name="partnerId"
              control={control}
              rules={
                partnerIdRequired
                  ? {
                      required: {
                        value: true,
                        message: t.modal.inputs.partner.rules?.required,
                      },
                    }
                  : {}
              }
              render={({ field: { onChange, value, name } }) => {
                return (
                  <Select
                    name={name}
                    label={t.modal.inputs.partner.label}
                    placeholder={t.modal.inputs.partner.placeholder}
                    size="md"
                    value={value}
                    hasError={!!errors?.partnerId?.message}
                    errorMessage={errors?.partnerId?.message}
                    backgroundColor="blue"
                    options={getOptions()}
                    onChange={onChange}
                    required={partnerIdRequired}
                    isCreatable
                  />
                )
              }}
            />
          )}
          {showMunicipalities && (
            <Controller
              name="municipalityId"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t.modal.inputs.municipality.rules?.required,
                },
              }}
              render={({ field: { onChange, value, name } }) => {
                return (
                  <Select
                    name={name}
                    label={t.modal.inputs.municipality.label}
                    placeholder={t.modal.inputs.municipality.placeholder}
                    size="md"
                    value={value}
                    hasError={!!errors?.municipality?.message}
                    errorMessage={errors?.municipality?.message}
                    backgroundColor="blue"
                    options={municipalities}
                    onChange={onChange}
                    required={true}
                    isCreatable
                  />
                )
              }}
            />
          )}
        </Stack>
        <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
          <Button variant="ghost" onClick={onCancel} fluid>
            {t.modal.buttons.cancel}
          </Button>
          <Box paddingX={[3, 3, 3, 15]}></Box>
          <Button type="submit" fluid>
            {t.modal.buttons.continue}
          </Button>
        </Box>
      </form>
    </Modal>
  )
}
