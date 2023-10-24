import { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
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
import { msg } from '../../../../../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller, useForm } from 'react-hook-form'
import { FormButton } from '../FormButton'
import * as styles from './ProfileForms.css'

const GET_PAPER_MAIL = gql`
  query documentSenders {
    getPaperMailInfo {
      wantsPaper
      nationalId
    }
  }
`

const POST_PAPER_MAIL = gql`
  mutation PostRequestPaperMutation($input: PostRequestPaperInput!) {
    postPaperMailInfo(input: $input) {
      wantsPaper
      nationalId
    }
  }
`
interface Props {
  wantsPaper: boolean
}

export const PaperMail = () => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, handleSubmit } = useForm<Props>()
  const [localValue, setLocalValue] = useState<boolean | undefined>(undefined)
  const [submitError, setSubmitError] = useState<string>()

  const { data, loading } = useQuery<Query>(GET_PAPER_MAIL)
  const [postPaperMailMutation, { data: mutationData, loading: postLoading }] =
    useMutation(POST_PAPER_MAIL)

  const submitFormData = async (data: { wantsPaper: boolean }) => {
    try {
      setSubmitError(undefined)
      await postPaperMailMutation({
        variables: {
          input: {
            wantsPaper: data.wantsPaper,
          },
        },
      })
    } catch (err) {
      console.error(`updateOrCreateUserProfile error: ${err}`)
      setSubmitError(formatMessage(m.somethingWrong))
    }
  }

  if (loading) {
    return <SkeletonLoader />
  }
  if (typeof data?.getPaperMailInfo?.wantsPaper !== 'boolean') {
    return null
  }

  const initWantsPaper = data?.getPaperMailInfo?.wantsPaper
  const mutationWantsPaper = mutationData?.postPaperMailInfo?.wantsPaper
  const isPristine =
    (initWantsPaper === localValue && mutationWantsPaper === undefined) ||
    mutationWantsPaper === localValue
  const isLoading = loading || postLoading

  return (
    <form onSubmit={handleSubmit(submitFormData)}>
      <Columns collapseBelow="sm" alignY="center">
        <Column width="content">
          <Box marginRight={3} display="flex" alignItems="center">
            <Controller
              name="wantsPaper"
              control={control}
              defaultValue={initWantsPaper}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  name="wantsPaper"
                  onChange={(e) => {
                    onChange(e.target.checked)
                    setLocalValue(e.target.checked)
                  }}
                  label={formatMessage({
                    id: 'sp.settings:request-paper-mail',
                    defaultMessage:
                      'Óska eftir því að fá erindi jafnframt í bréfpósti',
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
                {isPristine && (
                  <Icon icon="checkmark" color="blue300" type="filled" />
                )}
              </Box>
            </Hidden>
            <Box display="flex" alignItems="flexStart" flexDirection="column">
              {!isLoading && (
                <FormButton disabled={isPristine} submit>
                  {formatMessage(msg.saveSettings)}
                </FormButton>
              )}
              {isLoading && <SkeletonLoader />}
            </Box>
          </Box>
        </Column>
      </Columns>
    </form>
  )
}
