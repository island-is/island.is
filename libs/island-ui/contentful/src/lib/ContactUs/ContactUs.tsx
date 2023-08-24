import React, { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Text,
  Stack,
  Input,
  GridRow,
  GridColumn,
  Box,
  Button,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'

export interface ContactUsFormState {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

type FormState = 'edit' | 'submitting' | 'error' | 'success'

export interface ContactUsProps {
  title: string
  state: FormState
  required: string
  invalidPhone: string
  invalidEmail: string
  labelName: string
  labelPhone: string
  labelEmail: string
  labelSubject: string
  labelMessage: string
  submitButtonText: string
  successMessage: string
  errorMessage: string
  onSubmit: (formState: ContactUsFormState) => Promise<void>
}

export const ContactUs: FC<React.PropsWithChildren<ContactUsProps>> = ({
  onSubmit,
  state = 'edit',
  title = 'Sendu okkur línu',
  required = 'Þennan reit þarf að fylla út',
  invalidPhone = 'Sláðu inn gilt símanúmer',
  invalidEmail = 'Sláðu inn gilt tölvupóstfang',
  labelName = 'Nafn',
  labelPhone = 'Símanúmer',
  labelEmail = 'Tölvupóstfang',
  labelSubject = 'Viðfangsefni',
  labelMessage = 'Skilaboð',
  submitButtonText = 'Senda skilaboð',
  successMessage = 'Takk fyrir að hafa samband ...',
  errorMessage = 'Eitthvað fór úrskeiðis',
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ContactUsFormState>()

  useEffect(() => {
    if (state === 'error') {
      toast.error(errorMessage)
    }
  }, [state, errorMessage])

  const isNotSent = state !== 'success'

  return (
    <Box position="relative">
      <Box background="blue100" borderRadius="large" paddingY={6}>
        <GridRow>
          <GridColumn span="7/9" offset="1/9">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack space={6}>
                {isNotSent && Boolean(title) && (
                  <Text variant="h2" as="h2">
                    {title}
                  </Text>
                )}
                {isNotSent && (
                  <Stack space={3}>
                    <Input
                      {...register('name', {
                        required: required,
                      })}
                      label={labelName}
                      placeholder={labelName}
                      required
                      errorMessage={errors.name?.message}
                    />
                    <Input
                      {...register('phone', {
                        pattern: {
                          value: /^\d{3}[\d- ]*$/,
                          message: invalidPhone,
                        },
                      })}
                      label={labelPhone}
                      placeholder="000 0000"
                      errorMessage={errors.phone?.message}
                    />
                    <Input
                      {...register('email', {
                        required: required,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: invalidEmail,
                        },
                      })}
                      label={labelEmail}
                      placeholder={labelEmail}
                      required
                      errorMessage={errors.email?.message}
                    />
                    <Input
                      {...register('subject', {})}
                      label={labelSubject}
                      placeholder={labelSubject}
                      errorMessage={errors.subject?.message}
                    />
                    <Input
                      {...register('message', {
                        required: required,
                      })}
                      label={labelMessage}
                      placeholder={labelMessage}
                      required
                      errorMessage={errors.message?.message}
                      textarea
                      rows={6}
                    />
                  </Stack>
                )}
                {state === 'success' ? (
                  <Text color="blue400">{successMessage}</Text>
                ) : (
                  <Box display="flex" width="full" justifyContent="flexEnd">
                    <Button
                      type="submit"
                      loading={state === 'submitting'}
                      disabled={state === 'submitting'}
                    >
                      {submitButtonText}
                    </Button>
                  </Box>
                )}
              </Stack>
            </form>
          </GridColumn>
        </GridRow>
      </Box>
      <ToastContainer
        hideProgressBar={true}
        closeButton={true}
        useKeyframeStyles={false}
      />
    </Box>
  )
}
