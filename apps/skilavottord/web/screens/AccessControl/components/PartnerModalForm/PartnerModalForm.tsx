import React, { FC } from 'react'
import { Controller, useForm, ValidationRules } from 'react-hook-form'
import * as kennitala from 'kennitala'

import { Box, Button, Select, Option, Stack } from '@island.is/island-ui/core'

import { InputController } from '@island.is/shared/form-fields'

import { Modal, ModalProps } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'

interface PartnerModalFormProps extends ModalProps {
  onSubmit: (partner: any, callback: any) => void
  recyclingPartners: Option[]
  roles: Option[]
  partner?: any
}

export const PartnerModalForm: FC<PartnerModalFormProps> = ({
  title,
  text,
  show,
  onCancel,
  onContinue,
  onSubmit,
  continueButtonText,
  cancelButtonText,
  recyclingPartners,
  roles,
  partner,
}) => {
  const { control, errors, setValue, handleSubmit } = useForm({
    mode: 'onChange',
  })

  const {
    t: { accessControl: t },
  } = useI18n()

  React.useEffect(() => {
    if (partner) {
      Object.entries(partner).forEach(([key, value]) => {
        if (key === 'partnerId') {
          return setValue(
            key,
            recyclingPartners.find(
              (option) => option.value === partner?.partnerId,
            ),
          )
        }
        if (key === 'role') {
          return setValue(
            key,
            roles.find((option) => option.value === partner?.role),
          )
        }
        setValue(key, value)
      })
    }
    return () => {}
  }, [partner])

  const handleOnSubmit = handleSubmit((partner) => {
    return onSubmit(partner, () => console.log('test callback'))
  })

  return (
    <Modal
      title={title}
      text={text}
      show={show}
      onCancel={onCancel}
      onContinue={onContinue}
      continueButtonText={continueButtonText}
      cancelButtonText={cancelButtonText}
    >
      <form onSubmit={handleOnSubmit}>
        <Stack space={3}>
          <InputController
            id="nationalId"
            control={control}
            required
            label={t.modal.inputs.nationalId.label}
            placeholder={t.modal.inputs.nationalId.placeholder}
            rules={
              {
                required: {
                  value: true,
                  message: 't.modal.inputs.nationalId.rules.required',
                },
                validate: {
                  value: (value: number) => {
                    console.log(value)
                    console.log(kennitala.isPerson(value))

                    if (
                      value.toString().length === 10 &&
                      !kennitala.isPerson(value)
                    ) {
                      return 't.modal.inputs.nationalId.rules.validate'
                    }
                  },
                },
              } as ValidationRules
            }
            type="tel"
            format="######-####"
            error={errors?.nationalId?.message}
            backgroundColor="blue"
          />
          <InputController
            id="name"
            control={control}
            required
            label={t.modal.inputs.name.label}
            placeholder={t.modal.inputs.name.placeholder}
            rules={
              {
                required: {
                  value: true,
                  message: 'Skylda er að fylla út kennitölu', // put into translations, make them for english
                },
              } as ValidationRules
            }
            error={errors?.name?.message}
            backgroundColor="blue"
          />
          <Controller
            name="role"
            control={control}
            render={({ onChange, value, name }) => {
              return (
                <Select
                  required
                  name={name}
                  label={t.modal.inputs.role.label}
                  placeholder={t.modal.inputs.role.placeholder}
                  size="md"
                  value={value ?? ''}
                  errorMessage={errors?.role?.message}
                  backgroundColor="blue"
                  options={roles}
                  onChange={onChange}
                  disabled={false}
                />
              )
            }}
          />
          <Controller
            name="partnerId"
            control={control}
            render={({ onChange, value, name }) => {
              return (
                <Select
                  required
                  name={name}
                  label={t.modal.inputs.partnerId.label}
                  placeholder={t.modal.inputs.partnerId.placeholder}
                  size="md"
                  value={value ?? ''}
                  errorMessage={errors?.partnerId?.message}
                  backgroundColor="blue"
                  options={recyclingPartners}
                  onChange={onChange}
                  disabled={false}
                />
              )
            }}
          />
        </Stack>
        <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
          <Button variant="ghost" onClick={onCancel} fluid>
            {cancelButtonText}
          </Button>
          <Box paddingX={[3, 3, 3, 15]}></Box>
          <Button type="submit" fluid>
            {continueButtonText}
          </Button>
        </Box>
      </form>
    </Modal>
  )
}
