import React, { FC, useState, useEffect } from 'react'
import {
  Box,
  Columns,
  Column,
  Icon,
  Checkbox,
  Hidden,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useUpdateOrCreateUserProfile } from '@island.is/service-portal/graphql'
import { msg } from '../../../../../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller, useForm } from 'react-hook-form'
import { FormButton } from '../FormButton'
import * as styles from './ProfileForms.css'

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
  const { control, handleSubmit, getValues } = useForm<Props>()
  const [inputPristine, setInputPristine] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>()

  useEffect(() => {
    checkSetPristineInput()
  }, [refuseMail])

  const { updateOrCreateUserProfile, loading } = useUpdateOrCreateUserProfile()

  const checkSetPristineInput = () => {
    const localForm = getValues().refuseMail

    if (localForm === refuseMail) {
      setInputPristine(true)
    } else {
      setInputPristine(false)
    }
  }

  const submitFormData = async (data: { refuseMail: boolean }) => {
    try {
      setSubmitError(undefined)
      await updateOrCreateUserProfile({
        canNudge: !data.refuseMail,
      }).then(() => setInputPristine(true))
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
                    onChange(e.target.checked)
                    checkSetPristineInput()
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
            <Hidden below="sm">
              <Box display="flex" alignItems="center" marginRight={1}>
                {inputPristine && (
                  <Icon icon="checkmark" color="blue300" type="filled" />
                )}
              </Box>
            </Hidden>
            <Box display="flex" alignItems="flexStart" flexDirection="column">
              {!loading && (
                <FormButton disabled={inputPristine} submit>
                  {formatMessage(msg.saveSettings)}
                </FormButton>
              )}
              {loading && <SkeletonLoader />}
            </Box>
          </Box>
        </Column>
      </Columns>
    </form>
  )
}
