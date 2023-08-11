import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Helpdesk } from '@island.is/api/schema'
import { useUpdateHelpDesk, HelpDeskInput } from '../../shared'
interface Props {
  helpDesk: Helpdesk
  organisationId: string
}
export const UserHelpForm: FC<React.PropsWithChildren<Props>> = ({
  helpDesk,
  organisationId,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Helpdesk>()
  const { formatMessage } = useLocale()

  const { updateHelpDesk, loading } = useUpdateHelpDesk(organisationId)

  const onSubmit = (formData: Helpdesk) => {
    if (formData) {
      const input: HelpDeskInput = { ...formData, id: helpDesk?.id }
      updateHelpDesk(input)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="email"
          defaultValue={helpDesk?.email || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditUserHelpContactEmailRequiredMessage,
              ),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage(
                m.SettingsEditUserHelpContactEmailWrongFormatMessage,
              ),
            },
          }}
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              label={formatMessage(m.SettingsEditUserHelpContactEmail)}
              placeholder={formatMessage(m.SettingsEditUserHelpContactEmail)}
              name={name}
              value={value}
              onChange={onChange}
              hasError={!!errors.email}
              errorMessage={errors.email?.message}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          defaultValue={helpDesk?.phoneNumber || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditUserHelpContactTelRequiredMessage,
              ),
            },
            pattern: {
              value: /^\d{3}[\d- ]*$/,
              message: formatMessage(
                m.SettingsEditUserHelpContactTelWrongFormatMessage,
              ),
            },
          }}
          render={({ field: { onChange, name, value } }) => (
            <Input
              size="xs"
              label={formatMessage(m.SettingsEditUserHelpContactTel)}
              placeholder={formatMessage(m.SettingsEditUserHelpContactTel)}
              name={name}
              value={value}
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
              {formatMessage(m.SettingsEditHelpContactBackButton)}
            </Button>
          </Link> */}
        </Box>
        <Button
          type="submit"
          variant="primary"
          icon="arrowForward"
          loading={loading}
        >
          {formatMessage(m.SettingsEditHelpContactSaveButton)}
        </Button>
      </Box>
    </form>
  )
}
