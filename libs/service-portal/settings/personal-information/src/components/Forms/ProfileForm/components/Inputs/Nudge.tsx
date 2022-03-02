import React, { FC, useState, useEffect } from 'react'
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
  const { control, handleSubmit, getValues } = useForm()
  const [inputPristine, setInputPristine] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>()

  useEffect(() => {
    checkSetPristineInput()
  }, [canNudge])

  const { updateOrCreateUserProfile, loading } = useUpdateOrCreateUserProfile()

  const checkSetPristineInput = () => {
    const localForm = getValues().canNudge

    if (localForm && localForm === canNudge) {
      setInputPristine(true)
    } else {
      setInputPristine(false)
    }
  }

  const submitFormData = async (data: { canNudge: boolean }) => {
    try {
      setSubmitError(undefined)
      await updateOrCreateUserProfile({
        canNudge: data.canNudge,
      }).then(() => setInputPristine(true))
    } catch (err) {
      console.error(`updateOrCreateUserProfile error: ${err}`)
      setSubmitError(formatMessage(m.somethingWrong))
    }
  }

  return (
    <form onSubmit={handleSubmit(submitFormData)}>
      <Columns alignY="center">
        <Column width="content">
          <Box display="flex" alignItems="center">
            <Controller
              name="canNudge"
              control={control}
              defaultValue={canNudge}
              render={({ onChange, value }) => (
                <Checkbox
                  name="canNudge"
                  onChange={(e) => {
                    onChange(e.target.checked)
                    checkSetPristineInput()
                  }}
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
            <Box marginLeft={3}>
              {inputPristine && (
                <Icon icon="checkmark" color="blue300" type="filled" />
              )}
            </Box>
          </Box>
        </Column>
        <Column width="10/12">
          <Box
            display="flex"
            alignItems="flexStart"
            flexDirection="column"
            marginLeft={3}
          >
            {!loading && (
              <button disabled={inputPristine} type="submit">
                <Button disabled={inputPristine} variant="text" size="small">
                  {formatMessage(msg.saveSettings)}
                </Button>
              </button>
            )}
            {loading && <LoadingDots />}
          </Box>
        </Column>
      </Columns>
    </form>
  )
}
