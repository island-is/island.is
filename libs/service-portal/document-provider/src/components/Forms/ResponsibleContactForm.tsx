import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

export interface ResponsibleContactFormData {
  name: string
  email: string
  tel: string
}

interface Props {
  onSubmit: (data: ResponsibleContactFormData) => void
}

export const ResponsibleContactForm: FC<Props> = ({ onSubmit }) => {
  const { handleSubmit, control, errors } = useForm()
  const { formatMessage } = useLocale()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="name"
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditResponsibleContactNameRequiredMessage,
              ),
            },
          }}
          render={({ onChange, name, value }) => (
            <Input
              name={name}
              value={value}
              label={formatMessage(m.SettingsEditResponsibleContactName)}
              placeholder={formatMessage(m.SettingsEditResponsibleContactName)}
              onChange={onChange}
              hasError={errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditResponsibleContactEmailRequiredMessage,
              ),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage(
                m.SettingsEditResponsibleContactEmailWrongFormatMessage,
              ),
            },
          }}
          render={({ onChange, name, value }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditResponsibleContactEmail)}
              value={value}
              placeholder={formatMessage(m.SettingsEditResponsibleContactEmail)}
              onChange={onChange}
              hasError={errors.email}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="tel"
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditResponsibleContactTelRequiredMessage,
              ),
            },
            pattern: {
              value: /^\d{3}[\d- ]*$/,
              message: formatMessage(
                m.SettingsEditResponsibleContactTelWrongFormatMessage,
              ),
            },
          }}
          render={({ onChange, name, value }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditResponsibleContactTel)}
              value={value}
              placeholder={formatMessage(m.SettingsEditResponsibleContactTel)}
              onChange={onChange}
              hasError={errors.tel}
              errorMessage={errors.tel?.message}
            ></Input>
          )}
        />
      </Stack>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        flexDirection={['columnReverse', 'row']}
        marginTop={4}
      >
        <Box marginTop={[1, 0]}>
          <Link to={ServicePortalPath.DocumentProviderSettingsRoot}>
            <Button variant="ghost">Til baka</Button>
          </Link>
        </Box>
        <Button type="submit" variant="primary" icon="arrowForward">
          Vista breytingar
        </Button>
      </Box>
      )
    </form>
  )
}
