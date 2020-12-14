import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

export interface ResponsibleContactFormData {
  name: string
  email: string
  tel: string
}

interface Props {
  onSubmit: (data: ResponsibleContactFormData) => void
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
}

export const ResponsibleContactForm: FC<Props> = ({
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
              name={name}
              value={value}
              label={formatMessage(m.SettingsEditResponsibleContactName)}
              placeholder={formatMessage(m.SettingsEditResponsibleContactName)}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ onChange, name, value }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditResponsibleContactEmail)}
              value={value}
              placeholder={formatMessage(m.SettingsEditResponsibleContactEmail)}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="tel"
          defaultValue=""
          render={({ onChange, name, value }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditResponsibleContactTel)}
              value={value}
              placeholder={formatMessage(m.SettingsEditResponsibleContactTel)}
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
