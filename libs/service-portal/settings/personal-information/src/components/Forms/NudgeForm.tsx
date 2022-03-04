import React, { FC } from 'react'
import { Box, Checkbox } from '@island.is/island-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'

export interface NudgeFormData {
  nudge: boolean
}

interface Props {
  nudge: boolean
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: NudgeFormData) => void
}

export const NudgeForm: FC<Props> = ({
  nudge,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  const { handleSubmit, control } = useForm()
  const { formatMessage } = useLocale()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Controller
          control={control}
          name="nudge"
          defaultValue={nudge}
          render={({ onChange, value, name }) => (
            <Checkbox
              label={formatMessage({
                id: 'sp.settings:nudge-checkbox-label',
                defaultMessage: 'Virkja hnipp',
              })}
              onChange={(e) => onChange(e.target.checked)}
              name={name}
              checked={value}
            />
          )}
        />
      </Box>
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
