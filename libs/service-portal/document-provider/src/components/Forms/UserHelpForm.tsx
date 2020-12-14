import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, Stack, Input, Button } from '@island.is/island-ui/core'
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
          name="name"
          defaultValue=""
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditUserHelpContactName)}
              placeholder={formatMessage(m.SettingsEditUserHelpContactName)}
              name={name}
              value={value}
              onChange={onChange}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditUserHelpContactEmail)}
              placeholder={formatMessage(m.SettingsEditUserHelpContactEmail)}
              name={name}
              value={value}
              onChange={onChange}
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
