import React, { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  Box,
  Checkbox,
  Column,
  Columns,
  Hidden,
  Icon,
  LoadingDots,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useUpdateOrCreateUserProfile } from '@island.is/service-portal/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'

import { FormButton } from '../FormButton'
import * as styles from './ProfileForms.css'
import { msg } from '@island.is/service-portal/information/messages'

interface Props {
  refuseMail: boolean
}

/**
 * This component will look a little strange.
 * The requirements for the user is to see in the UI a checkbox:
 * "Refuse nudge" while the value in the db is of "Accept nudge (canNudge)"
 * So we need to get the value and set it to the opposite of the db value.
 */
export const Nudge: FC<React.PropsWithChildren<Props>> = ({ refuseMail }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, handleSubmit, getValues, setValue } = useForm<Props>({
    defaultValues: {
      refuseMail,
    },
  })
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [submitError, setSubmitError] = useState<string>()

  useEffect(() => {
    setValue('refuseMail', refuseMail)
  }, [refuseMail])

  const { updateOrCreateUserProfile, loading } = useUpdateOrCreateUserProfile()

  const submitFormData = async (data: { refuseMail: boolean }) => {
    setSubmitError(undefined)

    try {
      await updateOrCreateUserProfile({
        canNudge: !data.refuseMail,
      })

      setAllowSubmit(false)
    } catch (err) {
      console.error(`updateOrCreateUserProfile error: ${err}`)
      setSubmitError(formatMessage(m.somethingWrong))
    }
  }

  return (
    <form onSubmit={handleSubmit(submitFormData)}>
      <Columns collapseBelow="sm" alignY="center">
        <Column width="content">
          <Box marginRight={3} display="flex" alignItems="center">
            <Controller
              name="refuseMail"
              control={control}
              defaultValue={refuseMail}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  name="refuseMail"
                  onChange={(e) => {
                    const value = e.target.checked
                    onChange(value)
                    setValue('refuseMail', value)
                    setAllowSubmit(!allowSubmit)
                  }}
                  label={formatMessage({
                    id: 'sp.settings:nudge-checkbox-label',
                    defaultMessage: 'Afþakka tölvupóst',
                  })}
                  hasError={!!submitError}
                  errorMessage={submitError}
                  checked={value}
                />
              )}
            />
          </Box>
        </Column>
        <Column width="10/12">
          <Box
            className={styles.nudgeSave}
            display="flex"
            alignItems="center"
            justifyContent="flexStart"
          >
            {!allowSubmit && (
              <Hidden below="sm">
                <Box display="flex" alignItems="center" marginRight={1}>
                  <Icon icon="checkmark" color="blue300" type="filled" />
                </Box>
              </Hidden>
            )}
            <Box display="flex" alignItems="flexStart" flexDirection="column">
              {!loading && (
                <FormButton disabled={!allowSubmit} submit>
                  {formatMessage(msg.saveSettings)}
                </FormButton>
              )}
              {loading && <LoadingDots />}
            </Box>
          </Box>
        </Column>
      </Columns>
    </form>
  )
}
