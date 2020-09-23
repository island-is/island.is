import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import {
  Typography,
  Stack,
  Input,
  GridRow,
  GridColumn,
  Box,
  Button,
} from '@island.is/island-ui/core'
import Background from '../Background/Background'
import * as styles from './ContactUs.treat'

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

export const ContactUs: FC<ContactUsProps> = ({
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
  const { handleSubmit, register, errors } = useForm<ContactUsFormState>()

  return (
    <Box position="relative" paddingBottom={15}>
      <Background className={styles.background} background="dotted" />
      <Box position="relative">
        <Box background="blue100" borderRadius="large" paddingY={6}>
          <GridRow>
            <GridColumn span="7/9" offset="1/9">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack space={6}>
                  {Boolean(title) && (
                    <Typography variant="h2" as="h2">
                      {title}
                    </Typography>
                  )}
                  <Stack space={3}>
                    <GridRow>
                      <GridColumn span={['10/10', '10/10', '10/10', '7/10']}>
                        <Input
                          name="name"
                          label={labelName}
                          required
                          errorMessage={errors.name?.message}
                          ref={register({
                            required: required,
                          })}
                        />
                      </GridColumn>
                      <GridColumn
                        span={['10/10', '10/10', '10/10', '3/10']}
                        paddingTop={[3, 3, 3, 0]}
                      >
                        <Input
                          name="phone"
                          label={labelPhone}
                          placeholder="000 0000"
                          errorMessage={errors.phone?.message}
                          ref={register({
                            pattern: {
                              value: /^\d{3}[\d- ]*$/,
                              message: invalidPhone,
                            },
                          })}
                        />
                      </GridColumn>
                    </GridRow>
                    <Input
                      name="email"
                      label={labelEmail}
                      required
                      errorMessage={errors.email?.message}
                      ref={register({
                        required: required,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: invalidEmail,
                        },
                      })}
                    />
                    <Input
                      name="subject"
                      label={labelSubject}
                      errorMessage={errors.subject?.message}
                      ref={register({})}
                    />
                    <Input
                      name="message"
                      label={labelMessage}
                      required
                      errorMessage={errors.message?.message}
                      textarea
                      rows={6}
                      ref={register({
                        required: required,
                      })}
                    />
                  </Stack>
                  <Box textAlign="right">
                    <Stack space={3}>
                      {state === 'success' ? (
                        <Typography variant="p" color="blue400">
                          {successMessage}
                        </Typography>
                      ) : (
                        <Button
                          htmlType="submit"
                          loading={state === 'submitting'}
                        >
                          {submitButtonText}
                        </Button>
                      )}
                      {state === 'error' && (
                        <Typography variant="p" color="red400">
                          {errorMessage}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </form>
            </GridColumn>
          </GridRow>
        </Box>
      </Box>
    </Box>
  )
}
