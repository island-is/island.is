import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box,Stack, Input} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

export interface UserHelpFormData {
  name: string
  email: string
}
interface Props {
  onSubmit: (data: UserHelpFormData) => void
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
}
export const UserHelpForm: FC<Props> = ({
  onSubmit,
  renderBackButton,
  renderSubmitButton,
}) => {
  const { handleSubmit, control, errors } = useForm()
  const { formatMessage } = useLocale()
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>

        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules = {{required: {
            value: true,
            message: formatMessage(m.SettingsEditUserHelpContactEmailRequiredMessage),
          },
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: formatMessage(m.SettingsEditUserHelpContactEmailWrongFormatMessage)
          }}}
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditUserHelpContactEmail)}
              placeholder={formatMessage(m.SettingsEditUserHelpContactEmail)}
              name={name}
              value={value}
              onChange={onChange}
              hasError={errors.email}
              errorMessage={errors.email?.message}
            ></Input>
          )}
        />
                <Controller
          control={control}
          name="tel"
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: formatMessage(m.SettingsEditUserHelpContactTelRequiredMessage),
            },
            pattern: {
              value: /^\d{3}[\d- ]*$/,
              message: formatMessage(m.SettingsEditUserHelpContactTelWrongFormatMessage)
            }
          }}
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditUserHelpContactTel)}
              placeholder={formatMessage(m.SettingsEditUserHelpContactTel)}
              name={name}
              value={value}
              onChange={onChange}
              hasError={errors.tel}
              errorMessage={errors.tel?.message}
            ></Input>
          )}
        />
      </Stack>
      {(renderBackButton || renderSubmitButton) && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexDirection={['columnReverse', 'row']}
          marginTop={4}
        >
          {renderBackButton && (
            <Box marginTop={[1, 0]}>{renderBackButton()}</Box>
          )}
          {renderSubmitButton && renderSubmitButton()}
        </Box>
      )}
    </form>
  )
}
