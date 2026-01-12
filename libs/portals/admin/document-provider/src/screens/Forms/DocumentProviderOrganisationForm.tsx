import React, { FC } from 'react'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useForm } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DocumentProviderInput } from './DocumentProviderInput'
import { Organisation } from '@island.is/api/schema'
import {
  OrganisationInput,
  useUpdateOrganisation,
  OnCompletedArgumentsType,
} from '../../shared/useUpdateOrganisation'

interface Props {
  organisation: Organisation
  setOrganisationName: (name: string) => void
}

export const DocumentProviderOrganisationForm: FC<
  React.PropsWithChildren<Props>
> = ({ organisation, setOrganisationName }) => {
  const { formatMessage } = useLocale()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Organisation>()

  const { updateOrganisation, loading } = useUpdateOrganisation(
    (data: OnCompletedArgumentsType) => {
      const name = data?.updateOrganisation?.name
      if (name) setOrganisationName(name)
    },
  )

  const onSubmit = (formData: OrganisationInput) => {
    if (formData) {
      const input: OrganisationInput = {
        ...formData,
        id: organisation?.id || '',
      }
      updateOrganisation(input)
    }
  }

  return (
    <Box marginY={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom={4}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {formatMessage(m.SingleProviderInstitutionHeading)}
            </Text>
          </Box>
          <DocumentProviderInput
            control={control}
            name="name"
            defaultValue={organisation?.name}
            rules={{
              required: {
                value: true,
                message: formatMessage(m.SingleProviderInstitutionNameError),
              },
            }}
            label={formatMessage(m.SingleProviderInstitutionNameLabel)}
            placeholder={formatMessage(
              m.SingleProviderInstitutionNamePlaceholder,
            )}
            hasError={errors?.name !== undefined}
            errorMessage={errors?.name?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="nationalId"
            defaultValue={organisation?.nationalId}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderInstitutionNationalIdError,
                ),
              },
              pattern: {
                value: /([0-9]){6}-?([0-9]){4}/,
                message: formatMessage(
                  m.SingleProviderInstitutionNationalIdFormatError,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderInstitutionNationalIdLabel)}
            placeholder={formatMessage(
              m.SingleProviderInstitutionNationalIdPlaceholder,
            )}
            hasError={errors.nationalId !== undefined}
            errorMessage={errors.nationalId?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="address"
            defaultValue={organisation?.address || ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(m.SingleProviderInstitutionAddressError),
              },
            }}
            label={formatMessage(m.SingleProviderInstitutionAddressLabel)}
            placeholder={formatMessage(
              m.SingleProviderInstitutionAddressPlaceholder,
            )}
            hasError={errors.address !== undefined}
            errorMessage={errors.address?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="email"
            defaultValue={organisation?.email || ''}
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
            label={formatMessage(m.SingleProviderInstitutionEmailLabel)}
            placeholder={formatMessage(
              m.SingleProviderInstitutionEmailPlaceholder,
            )}
            hasError={errors?.email !== undefined}
            errorMessage={errors?.email?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="phoneNumber"
            defaultValue={organisation?.phoneNumber || ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderInstitutionPhonenumberError,
                ),
              },
              minLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderInstitutionPhonenumberErrorLength,
                ),
              },
              maxLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderInstitutionPhonenumberErrorLength,
                ),
              },
              pattern: {
                value: /^\d+$/,
                message: formatMessage(
                  m.SingleProviderInstitutionPhonenumberErrorOnlyNumbers,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderInstitutionPhonenumberLabel)}
            placeholder={formatMessage(
              m.SingleProviderInstitutionPhonenumberPlaceholder,
            )}
            hasError={errors?.phoneNumber !== undefined}
            errorMessage={errors?.phoneNumber?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="zendeskId"
            defaultValue={organisation?.zendeskId || ''}
            label={formatMessage(m.SingleProviderInstitutionZendeskIdLabel)}
            placeholder={formatMessage(
              m.SingleProviderInstitutionZendeskIdPlaceholder,
            )}
            hasError={errors?.zendeskId !== undefined}
            errorMessage={errors?.zendeskId?.message ?? ''}
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
              loading={loading}
            >
              {formatMessage(m.SingleProviderSaveButton)}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}
