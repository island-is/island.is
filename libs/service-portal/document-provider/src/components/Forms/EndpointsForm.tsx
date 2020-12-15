import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

export interface EndpointsFormData {
  endpoint: string
}

interface Props {
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: EndpointsFormData) => void
}

export const EndpointsForm: FC<Props> = ({
  onSubmit,
  renderBackButton,
  renderSubmitButton,
}) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="endpoint"
          rules={{
            required: {
              value: true,
              message: formatMessage({
                id: 'test',
                defaultMessage: 'Skylda er að fylla út endapunkt',
              }),
            },
            //TODO get right url pattern
            pattern: {
              value: /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/,
              message: 'endapunktur er ekki á réttu formi'
            }
          }}
          defaultValue=""
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditEndPointsUrl)}
              placeholder={formatMessage(m.SettingsEditEndPointsUrl)}
              value={value}
              hasError={errors.endpoint}
              errorMessage={errors.endpoint?.message}
              onChange={onChange}
            />
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
