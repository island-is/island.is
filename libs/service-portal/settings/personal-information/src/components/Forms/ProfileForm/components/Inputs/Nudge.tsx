import React, { FC } from 'react'
import {
  Box,
  Button,
  Columns,
  Column,
  Input,
  Icon,
  Text,
  LoadingDots,
  Checkbox,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller } from 'react-hook-form'
import { HookFormType } from '../../types/form'

interface Props {
  hookFormData: HookFormType
  onSave: (val: boolean) => void
}

export const Nudge: FC<Props> = ({ hookFormData, onSave }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, getValues } = hookFormData

  return (
    <Columns alignY="center">
      <Column width="8/12">
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
      </Column>
      <Column width="4/12">
        <Box
          display="flex"
          alignItems="flexEnd"
          flexDirection="column"
          paddingTop={2}
        >
          <Button
            variant="text"
            size="small"
            onClick={() => onSave(!!getValues()?.nudge)}
          >
            Vista stillingar
          </Button>
          {/* {createLoading && <LoadingDots />} */}
        </Box>
      </Column>
    </Columns>
  )
}
