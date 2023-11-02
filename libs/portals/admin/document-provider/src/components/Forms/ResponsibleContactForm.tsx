import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Contact } from '@island.is/api/schema'
import { useUpdateAdministrativeContact } from '../../shared/useUpdateAdministrativeContact'
import { ContactInput } from '../../shared/useUpdateTechnicalContact'

interface Props {
  organisationId: string
  administrativeContact: Contact
}

export const ResponsibleContactForm: FC<React.PropsWithChildren<Props>> = ({
  organisationId,
  administrativeContact,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Contact>()
  const { formatMessage } = useLocale()
  const { updateAdministrativeContact, loading } =
    useUpdateAdministrativeContact(organisationId)

  const onSubmit = (contact: Contact) => {
    if (contact) {
      const input: ContactInput = {
        ...contact,
        id: administrativeContact?.id,
      }
      updateAdministrativeContact(input)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="name"
          defaultValue={administrativeContact?.name || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditResponsibleContactNameRequiredMessage,
              ),
            },
          }}
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              name={name}
              value={value}
              label={formatMessage(m.SettingsEditResponsibleContactName)}
              placeholder={formatMessage(m.SettingsEditResponsibleContactName)}
              onChange={onChange}
              hasError={!!errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue={administrativeContact?.email || ''}
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
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              name={name}
              label={formatMessage(m.SettingsEditResponsibleContactEmail)}
              value={value}
              placeholder={formatMessage(m.SettingsEditResponsibleContactEmail)}
              onChange={onChange}
              hasError={!!errors.email}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          defaultValue={administrativeContact?.phoneNumber || ''}
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
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              name={name}
              label={formatMessage(m.SettingsEditResponsibleContactTel)}
              value={value}
              placeholder={formatMessage(m.SettingsEditResponsibleContactTel)}
              onChange={onChange}
              hasError={!!errors.phoneNumber}
              errorMessage={errors.phoneNumber?.message}
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
              {formatMessage(m.SettingsEditResponsibleContactBackButton)}
            </Button>
          </Link> */}
        </Box>
        <Button
          type="submit"
          variant="primary"
          icon="arrowForward"
          loading={loading}
        >
          {formatMessage(m.SettingsEditResponsibleContactSaveButton)}
        </Button>
      </Box>
    </form>
  )
}
