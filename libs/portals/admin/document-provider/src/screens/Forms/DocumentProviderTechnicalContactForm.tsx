import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useForm } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DocumentProviderInput } from './DocumentProviderInput'
import { Contact } from '@island.is/api/schema'
import {
  ContactInput,
  useUpdateTechnicalContact,
} from '../../shared/useUpdateTechnicalContact'
import {
  useCreateTechnicalContact,
  CreateContactInput,
} from '../../shared/useCreateTechnicalContact'

interface Props {
  technicalContact?: Contact | null
  organisationId: string
  organisationNationalId: string
}

interface UseFormProps {
  technicalContact: Contact
  organisationId: string
  organisationNationalId: string
}

export const DocumentProviderTechnicalContactForm: FC<
  React.PropsWithChildren<Props>
> = ({ technicalContact, organisationId, organisationNationalId }) => {
  const { formatMessage } = useLocale()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UseFormProps>()

  const { updateTechnicalContact, loading: loadingUpdate } =
    useUpdateTechnicalContact(organisationId)
  const { createTechnicalContact, loading: loadingCreate } =
    useCreateTechnicalContact(organisationId, organisationNationalId)

  const onSubmit = (data: { technicalContact: Contact }) => {
    if (data?.technicalContact && technicalContact) {
      const input: ContactInput = {
        ...data.technicalContact,
        id: technicalContact.id,
      }
      updateTechnicalContact(input)
    } else {
      const input: CreateContactInput = data.technicalContact
      createTechnicalContact(input)
    }
  }
  return (
    <Box marginY={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom={4}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {formatMessage(m.SingleProviderTechnicalContactHeading)}
            </Text>
          </Box>
          <DocumentProviderInput
            control={control}
            name="technicalContact.name"
            defaultValue={technicalContact?.name ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderTechnicalContactNameError,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderTechnicalContactNameLabel)}
            placeholder={formatMessage(
              m.SingleProviderTechnicalContactNamePlaceholder,
            )}
            hasError={errors?.technicalContact?.name !== undefined}
            errorMessage={errors?.technicalContact?.name?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="technicalContact.email"
            defaultValue={technicalContact?.email ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderTechnicalContactEmailError,
                ),
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: formatMessage(
                  m.SingleProviderTechnicalContactEmailErrorFormat,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderTechnicalContactEmailLabel)}
            placeholder={formatMessage(
              m.SingleProviderTechnicalContactEmailPlaceholder,
            )}
            hasError={errors?.technicalContact?.email !== undefined}
            errorMessage={errors?.technicalContact?.email?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="technicalContact.phoneNumber"
            defaultValue={technicalContact?.phoneNumber ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderTechnicalContactPhonenumberError,
                ),
              },
              minLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderTechnicalContactPhonenumberErrorLength,
                ),
              },
              maxLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderTechnicalContactPhonenumberErrorLength,
                ),
              },
              pattern: {
                value: /^\d+$/,
                message: formatMessage(
                  m.SingleProviderTechnicalContactPhonenumberErrorOnlyNumbers,
                ),
              },
            }}
            label={formatMessage(
              m.SingleProviderTechnicalContactPhoneNumberLabel,
            )}
            placeholder={formatMessage(
              m.SingleProviderTechnicalContactPhoneNumberPlaceholder,
            )}
            hasError={errors?.technicalContact?.phoneNumber !== undefined}
            errorMessage={errors?.technicalContact?.phoneNumber?.message ?? ''}
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
              loading={loadingCreate || loadingUpdate}
            >
              {formatMessage(m.SingleProviderSaveButton)}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}
