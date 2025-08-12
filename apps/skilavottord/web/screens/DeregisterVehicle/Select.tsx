import {
  Box,
  Button,
  Hidden,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import AuthGuard from '@island.is/skilavottord-web/components/AuthGuard/AuthGuard'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormData = {
  registrationNumber: string
}

const Select: FC<React.PropsWithChildren<unknown>> = () => {
  const {
    t: {
      deregisterVehicle: { select: t },
      routes: { deregisterVehicle: routes },
    },
  } = useI18n()
  const router = useRouter()
  const { handleSubmit, control, formState } = useForm({
    mode: 'onChange',
  })
  const { errors } = formState

  const handleContinue = (formData: FormData) => {
    const registrationNumber = formData.registrationNumber
      .replace(' ', '')
      .replace('-', '')
    router.push(
      `${routes.deregister}`,
      `${routes.baseRoute}/${registrationNumber}`,
    )
  }

  const handleCancel = () => {
    router.push(`${routes.baseRoute}`)
  }

  const validateRegNumber = (value: string) => {
    const antique = new RegExp(/^[A-Z]{1}\s{0,1}\d{5}$/gi)
    const regular = new RegExp(
      /^[A-ZÞÖ]{1,2}(\s|-){0,1}([A-ZÞÖ]|\d){1}\d{2}$/gi,
    )
    return regular.test(value) || antique.test(value)
  }

  return (
    <AuthGuard permission="deregisterVehicle">
      <ProcessPageLayout processType={'company'} activeSection={0}>
        <Stack space={4}>
          <Text variant="h1">{t.title}</Text>
          <Text variant="intro">{t.info}</Text>
          <Controller
            control={control}
            name="registrationNumber"
            rules={{
              required: {
                value: true,
                message: t.input!.errors.empty,
              },
              minLength: { value: 5, message: t.input!.errors.length },
              maxLength: { value: 7, message: t.input!.errors.length },
              validate: {
                isValidRegNumber: (value) =>
                  validateRegNumber(value) || t.input!.errors.invalidRegNumber,
              },
            }}
            defaultValue=""
            render={({ field: { onChange, value, name } }) => (
              <Input
                label={t.input!.label}
                placeholder={t.input!.placeholder}
                name={name}
                value={value?.toUpperCase()}
                onChange={({ target }) => onChange(target.value)}
                hasError={errors.registrationNumber}
                errorMessage={errors.registrationNumber?.message}
              />
            )}
          />
          <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
            <Hidden above="sm">
              <Button
                variant="ghost"
                circle
                size="large"
                icon="arrowBack"
                onClick={handleCancel}
              />
            </Hidden>
            <Hidden below="md">
              <Button variant="ghost" onClick={handleCancel}>
                {t.buttons.cancel}
              </Button>
            </Hidden>
            <Button
              icon="arrowForward"
              disabled={!formState.isValid}
              onClick={handleSubmit(handleContinue)}
            >
              {t.buttons.continue}
            </Button>
          </Box>
        </Stack>
      </ProcessPageLayout>
    </AuthGuard>
  )
}

export default Select
