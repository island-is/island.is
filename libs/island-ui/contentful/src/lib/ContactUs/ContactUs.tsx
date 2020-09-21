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

export interface ContactUsTranslations {
  title: string
  required: string
  invalidPhone: string
  invalidEmail: string
  labelName: string
  labelPhone: string
  labelEmail: string
  labelSubject: string
  labelMessage: string
  submitButtonText: string
  successText: string
  errorText: string
}

const defaultTranslations: ContactUsTranslations = {
  title: 'Sendu okkur línu',
  required: 'Þennan reit þarf að fylla út',
  invalidPhone: 'Sláðu inn gilt símanúmer',
  invalidEmail: 'Sláðu inn gilt tölvupóstfang',
  labelName: 'Nafn',
  labelPhone: 'Símanúmer',
  labelEmail: 'Tölvupóstfang',
  labelSubject: 'Viðfangsefni',
  labelMessage: 'Skilaboð',
  submitButtonText: 'Senda skilaboð',
  successText: 'Takk fyrir að hafa samband ...',
  errorText: 'Eitthvað fór úrskeiðis',
}

export interface ContactUsProps extends Partial<ContactUsTranslations> {
  onSubmit: (formState: ContactUsFormState) => Promise<void>
  hasError: boolean
}

export const ContactUs: FC<ContactUsProps> = ({
  onSubmit,
  hasError,
  ...translations
}) => {
  const t = { ...defaultTranslations, ...translations }
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
                  {Boolean(t.title) && (
                    <Typography variant="h2" as="h2">
                      {t.title}
                    </Typography>
                  )}
                  <Stack space={3}>
                    <GridRow>
                      <GridColumn span={['10/10', '10/10', '10/10', '7/10']}>
                        <Input
                          name="name"
                          label={t.labelName}
                          required
                          errorMessage={errors.name?.message}
                          ref={register({
                            required: t.required,
                          })}
                        />
                      </GridColumn>
                      <GridColumn
                        span={['10/10', '10/10', '10/10', '3/10']}
                        paddingTop={[3, 3, 3, 0]}
                      >
                        <Input
                          name="phone"
                          label={t.labelPhone}
                          placeholder="000 0000"
                          required
                          errorMessage={errors.phone?.message}
                          ref={register({
                            required: t.required,
                            pattern: {
                              value: /^\d{3}[\d- ]*$/,
                              message: t.invalidPhone,
                            },
                          })}
                        />
                      </GridColumn>
                    </GridRow>
                    <Input
                      name="email"
                      label={t.labelEmail}
                      required
                      errorMessage={errors.email?.message}
                      ref={register({
                        required: t.required,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t.invalidEmail,
                        },
                      })}
                    />
                    <Input
                      name="subject"
                      label={t.labelSubject}
                      required
                      errorMessage={errors.subject?.message}
                      ref={register({
                        required: t.required,
                      })}
                    />
                    <Input
                      name="message"
                      label={t.labelMessage}
                      required
                      errorMessage={errors.message?.message}
                      textarea
                      rows={6}
                      ref={register({
                        required: t.required,
                      })}
                    />
                  </Stack>
                  <Box textAlign="right">
                    <Button htmlType="submit">{t.submitButtonText}</Button>
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
