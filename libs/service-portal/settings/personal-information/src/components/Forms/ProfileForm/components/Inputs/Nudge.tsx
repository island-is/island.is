import React, { FC } from 'react'
import { Checkbox } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller } from 'react-hook-form'
import { HookFormType } from '../../types/form'

interface Props {
  hookFormData: HookFormType
}

export const Nudge: FC<Props> = ({ hookFormData }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control } = hookFormData

  return (
    <Controller
      name="nudge"
      control={control}
      render={({ onChange, value }) => (
        <Checkbox
          name="nudge"
          onChange={(e) => onChange(e.target.checked)}
          label={formatMessage({
            id: 'sp.settings:nudge-checkbox-label',
            defaultMessage: 'Virkja hnipp',
          })}
          checked={value}
        />
      )}
    />
  )
}
