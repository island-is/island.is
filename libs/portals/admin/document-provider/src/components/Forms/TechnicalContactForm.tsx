import React, { FC } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Contact } from '@island.is/api/schema'
import {
  ContactInput,
  useUpdateTechnicalContact,
} from '../../shared/useUpdateTechnicalContact'

export interface TechnicalContactFormData {
  name: string
  email: string
  tel: string
}

interface Props {
  organisationId: string
  technicalContact: Contact
}
export const TechnicalContactForm: FC<React.PropsWithChildren<Props>> = ({
  organisationId,
  technicalContact,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TechnicalContactFormData>()
  const { formatMessage } = useLocale()
  const { updateTechnicalContact, loading } =
    useUpdateTechnicalContact(organisationId)

  const onSubmit: SubmitHandler<TechnicalContactFormData> = (data) => {
    if (data) {
      const input: ContactInput = {
        id: technicalContact?.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.tel,
      }
      updateTechnicalContact(input)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="name"
          defaultValue={technicalContact?.name || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditTechnicalContactNameRequiredMessage,
              ),
            },
          }}
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              label={formatMessage(m.SettingsEditTechnicalContactName)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactName)}
              name={name}
              value={value}
              onChange={onChange}
              hasError={!!errors.name}
              errorMessage={errors.name?.message as string}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue={technicalContact?.email || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditTechnicalContactEmailRequiredMessage,
              ),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage(
                m.SettingsEditTechnicalContactEmailWrongFormatMessage,
              ),
            },
          }}
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              label={formatMessage(m.SettingsEditTechnicalContactEmail)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactEmail)}
              name={name}
              value={value}
              onChange={onChange}
              hasError={!!errors.email}
              errorMessage={errors.email?.message as string}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="tel"
          defaultValue={technicalContact?.phoneNumber || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditTechnicalContactTelRequiredMessage,
              ),
            },
            pattern: {
              value: /^\d{3}[\d- ]*$/,
              message: formatMessage(
                m.SettingsEditTechnicalContactTelWrongFormatMessage,
              ),
            },
          }}
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              label={formatMessage(m.SettingsEditTechnicalContactTel)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactTel)}
              name={name}
              value={value}
              onChange={onChange}
              hasError={!!errors.tel}
              errorMessage={errors.tel?.message as string}
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
          {/* <Link to={ServicePortalPath.DocumentProviderSettingsRoot}>
            <Button variant="ghost">
              {formatMessage(m.SettingsEditTechnicalContactBackButton)}
            </Button>
          </Link> */}
        </Box>
        <Button
          type="submit"
          variant="primary"
          icon="arrowForward"
          loading={loading}
        >
          {formatMessage(m.SettingsEditTechnicalContactSaveButton)}
        </Button>
      </Box>
    </form>
  )
}
