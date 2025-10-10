import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useForm } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DocumentProviderInput } from './DocumentProviderInput'
import { Helpdesk } from '@island.is/api/schema'
import { Link } from 'react-router-dom'
import { useUpdateHelpDesk, HelpDeskInput } from '../../shared'
import {
  useCreateHelpDesk,
  CreateHelpDeskInput,
} from '../../shared/useCreateHelpDesk'
import { DocumentProviderPaths } from '../../lib/paths'

interface Props {
  helpDesk?: Helpdesk | null
  organisationId: string
  organisationNationalId: string
}

interface UseFormProps {
  helpDesk: Helpdesk
  organisationId: string
  organisationNationalId: string
}

export const DocumentProviderHelpDeskForm: FC<
  React.PropsWithChildren<Props>
> = ({ helpDesk, organisationId, organisationNationalId }) => {
  const { formatMessage } = useLocale()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UseFormProps>()
  const { updateHelpDesk, loading: loadingUpdate } =
    useUpdateHelpDesk(organisationId)
  const { createHelpDesk, loading: loadingCreate } = useCreateHelpDesk(
    organisationId,
    organisationNationalId,
  )

  const onSubmit = (data: { helpDesk: Helpdesk }) => {
    if (data?.helpDesk && helpDesk) {
      const input: HelpDeskInput = { ...data.helpDesk, id: helpDesk.id }
      updateHelpDesk(input)
    } else {
      const input: CreateHelpDeskInput = data.helpDesk
      createHelpDesk(input)
    }
  }

  return (
    <Box marginY={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom={4}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {formatMessage(m.SingleProviderUserHelpContactHeading)}
            </Text>
          </Box>
          <DocumentProviderInput
            control={control}
            name="helpDesk.email"
            defaultValue={helpDesk?.email ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(m.SingleProviderUserHelpEmailError),
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: formatMessage(
                  m.SingleProviderUserHelpEmailErrorFormat,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderUserHelpContactEmailLabel)}
            placeholder={formatMessage(
              m.SingleProviderUserHelpContactEmailPlaceholder,
            )}
            hasError={errors?.helpDesk?.email !== undefined}
            errorMessage={errors?.helpDesk?.email?.message ?? ''}
          />
          <DocumentProviderInput
            control={control}
            name="helpDesk.phoneNumber"
            defaultValue={helpDesk?.phoneNumber ?? ''}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderUserHelpPhonenumberError,
                ),
              },
              minLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderUserHelpPhonenumberErrorLength,
                ),
              },
              maxLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderUserHelpPhonenumberErrorLength,
                ),
              },
              pattern: {
                value: /^\d+$/,
                message: formatMessage(
                  m.SingleProviderUserHelpPhonenumberErrorOnlyNumbers,
                ),
              },
            }}
            label={formatMessage(
              m.SingleProviderUserHelpContactPhoneNumberLabel,
            )}
            placeholder={formatMessage(
              m.SingleProviderUserHelpContactPhoneNumberPlaceholder,
            )}
            hasError={errors?.helpDesk?.phoneNumber !== undefined}
            errorMessage={errors?.helpDesk?.phoneNumber?.message ?? ''}
          />
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            flexDirection={['columnReverse', 'row']}
            marginTop={2}
          >
            <Box marginTop={[1, 0]}>
              <Link to={DocumentProviderPaths.DocumentProviderRoot}>
                <Button variant="ghost">
                  {formatMessage(m.SingleProviderBackButton)}
                </Button>
              </Link>
            </Box>
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
