import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Input, Stack } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

export interface InstitutionFormData {
  name: string
  nationalId: string
  address: string
  email: string
  tel: string
}

interface Props {
  onSubmit: (data: InstitutionFormData) => void
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  InstitutionFormData?: InstitutionFormData
}

export const InstitutionForm: FC<Props> = ({
  InstitutionFormData,
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
          rules={{
            required: {
              value: true,
              message: 'Skylda að fylla út nafn stofnunar',
            },
          }}
          defaultValue=""
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionName)}
              placeholder={formatMessage(m.SettingsEditInstitutionName)}
              value={value}
              onChange={onChange}
              hasError={errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="nationalId"
          defaultValue=""
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionNationalId)}
              value={value}
              placeholder={formatMessage(m.SettingsEditInstitutionNationalId)}
              onChange={onChange}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="address"
          defaultValue=""
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionAddress)}
              value={value}
              placeholder={formatMessage(m.SettingsEditInstitutionAddress)}
              onChange={onChange}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionEmail)}
              placeholder={formatMessage(m.SettingsEditInstitutionEmail)}
              value={value}
              onChange={onChange}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="tel"
          defaultValue=""
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionTel)}
              placeholder={formatMessage(m.SettingsEditInstitutionTel)}
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
