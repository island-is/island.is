import React, { FC, useState } from 'react'
import {
  Box,
  Button,
  Columns,
  Column,
  Icon,
  LoadingDots,
  Checkbox,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useUpdateOrCreateUserProfile } from '@island.is/service-portal/graphql'
import { msg } from '../../../../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller, useForm } from 'react-hook-form'

interface Props {
  canNudge: boolean
}

export const Nudge: FC<Props> = ({ canNudge }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, handleSubmit } = useForm()
  const [inputSuccess, setInputSuccess] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>()

  const { updateOrCreateUserProfile, loading } = useUpdateOrCreateUserProfile()

  const submitFormData = async (data: { canNudge: boolean }) => {
    try {
      setSubmitError(undefined)
      await updateOrCreateUserProfile({
        canNudge: data.canNudge,
      }).then(() => setInputSuccess(true))
    } catch (err) {
      setSubmitError(formatMessage(m.somethingWrong))
    }
  }

  return (
    <form onSubmit={handleSubmit(submitFormData)}>
      <Columns alignY="center">
        <Column width="8/12">
          <Controller
            name="canNudge"
            control={control}
            defaultValue={canNudge}
            render={({ onChange, value }) => (
              <Checkbox
                name="canNudge"
                onChange={(e) => onChange(e.target.checked)}
                disabled={inputSuccess}
                label={formatMessage({
                  id: 'sp.settings:nudge-checkbox-label',
                  defaultMessage: 'Virkja hnipp',
                })}
                hasError={!!submitError}
                errorMessage={submitError}
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
            {!loading && !inputSuccess && (
              <button type="submit">
                <Button variant="text" size="small">
                  {formatMessage(msg.saveSettings)}
                </Button>
              </button>
            )}
            {loading && <LoadingDots />}
            {inputSuccess && (
              <Icon icon="checkmarkCircle" color="mint600" type="filled" />
            )}
          </Box>
        </Column>
      </Columns>
      {inputSuccess && (
        <Columns alignY="center">
          <Column>
            <Box paddingTop={1}>
              <Button
                onClick={() => setInputSuccess(false)}
                variant="text"
                size="small"
              >
                {formatMessage(msg.buttonChange)}
              </Button>
            </Box>
          </Column>
        </Columns>
      )}
    </form>
  )
}
