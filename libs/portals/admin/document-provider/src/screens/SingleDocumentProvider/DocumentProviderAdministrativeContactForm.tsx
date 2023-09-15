import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useForm } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DocumentProviderInput } from './DocumentProviderInput'
import { Contact } from '@island.is/api/schema'
import { useUpdateAdministrativeContact } from '../../shared/useUpdateAdministrativeContact'
import { useCreateAdministrativeContact } from '../../shared/useCreateAdministrativeContact'
import { ContactInput } from '../../shared/useUpdateTechnicalContact'
import { CreateContactInput } from '../../shared/useCreateTechnicalContact'

interface Props {
  administrativeContact?: Contact | null
  organisationId: string
  organisationNationalId: string
}

interface UseFormProps {
  administrativeContact: Contact
  organisationId: string
  organisationNationalId: string
}

export const DocumentProviderAdministrativeContactForm: FC<
  React.PropsWithChildren<Props>
> = ({ administrativeContact, organisationId, organisationNationalId }) => {
  const { formatMessage } = useLocale()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UseFormProps>()
  const { updateAdministrativeContact, loading: loadingUpdate } =
    useUpdateAdministrativeContact(organisationId)

  const { createAdministrativeContact, loading: loadingCreate } =
    useCreateAdministrativeContact(organisationId, organisationNationalId)

  const onSubmit = (data: { administrativeContact: Contact }) => {
    if (data?.administrativeContact && administrativeContact) {
      const input: ContactInput = {
        ...data.administrativeContact,
        id: administrativeContact.id,
      }
      updateAdministrativeContact(input)
    } else {
      const input: CreateContactInput = data.administrativeContact
      createAdministrativeContact(input)
    }
  }
  return (
    <Box marginY={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom={4}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {formatMessage(m.SingleProviderResponsibleContactHeading)}
            </Text>
          </Box>
          <DocumentProviderInput
            control={control}
            name="administrativeContact.name"
            defaultValue={administrativeContact?.name ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderResponsibleContactNameError,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderResponsibleContactNameLabel)}
            placeholder={formatMessage(
              m.SingleProviderResponsibleContactNamePlaceholder,
            )}
            hasError={errors?.administrativeContact !== undefined}
            errorMessage={errors?.administrativeContact?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="administrativeContact.email"
            defaultValue={administrativeContact?.email ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(m.SingleProviderInstitutionEmailError),
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: formatMessage(
                  m.SingleProviderInstitutionEmailFormatError,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderResponsibleContactEmailLabel)}
            placeholder={formatMessage(
              m.SingleProviderResponsibleContactEmailPlaceholder,
            )}
            hasError={!!errors?.administrativeContact?.email?.message}
            errorMessage={errors?.administrativeContact?.email?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="administrativeContact.phoneNumber"
            defaultValue={administrativeContact?.phoneNumber ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberError,
                ),
              },
              minLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberErrorLength,
                ),
              },
              maxLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberErrorLength,
                ),
              },
              pattern: {
                value: /^\d+$/,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberErrorOnlyNumbers,
                ),
              },
            }}
            label={formatMessage(
              m.SingleProviderResponsibleContactPhoneNumberLabel,
            )}
            placeholder={formatMessage(
              m.SingleProviderResponsibleContactPhoneNumberPlaceholder,
            )}
            hasError={errors?.administrativeContact?.phoneNumber !== undefined}
            errorMessage={
              errors?.administrativeContact?.phoneNumber?.message ?? ''
            }
          />
          <Box
            display="flex"
            justifyContent="flexEnd"
            alignItems="center"
            flexDirection="row"
            marginTop={2}
          >
            <Button
              type="submit"
              variant="primary"
              icon="arrowForward"
              loading={loadingUpdate || loadingCreate}
            >
              {formatMessage(m.SingleProviderSaveButton)}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}
