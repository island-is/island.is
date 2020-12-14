import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Text, Stack, Input } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

export interface TechnicalContactFormData {
  name: string
  email: string
  tel: string
}

interface Props {
  onSubmit: (data: TechnicalContactFormData) => void
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
}
export const TechnicalContactForm: FC<Props> = ({
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
              label={formatMessage(m.SettingsEditTechnicalContactName)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactName)}
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
              label={formatMessage(m.SettingsEditTechnicalContactEmail)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactEmail)}
              name={name}
              value={value}
              onChange={onChange}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="tel"
          defaultValue=""
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditTechnicalContactTel)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactTel)}
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
