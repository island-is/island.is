import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { Application, Field, RecordObject } from '@island.is/application/types'
import { handleServerError } from '@island.is/application/ui-components'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import get from 'lodash/get'
import has from 'lodash/has'
import { FC } from 'react'
import { States } from '../../lib/constants'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/newPrimarySchoolUtils'

import { Child } from './review-groups/Child'
import { Parents } from './review-groups/Parents'
import { Relatives } from './review-groups/Relatives'
import { Photography } from './review-groups/Photography'

interface ReviewScreenProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
  editable?: boolean
}

export const Review: FC<ReviewScreenProps> = ({
  application,
  field,
  goToScreen,
  refetch,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const editable = field.props?.editable ?? false
  const hasError = (id: string) => get(errors, id) as string

  const groupHasNoErrors = (ids: string[]) =>
    ids.every((id) => !has(errors, id))

  const childProps = {
    application,
    editable,
    groupHasNoErrors,
    hasError,
    goToScreen,
  }

  const { state } = application

  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const handleSubmit = async (event: string) => {
    const TBD = getApplicationAnswers(application.answers)

    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event,
          answers: {},
        },
      },
    })

    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }

  return (
    <>
      {state === `${States.DRAFT}` && (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(newPrimarySchoolMessages.confirm.sectionTitle)}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {formatMessage(
                  newPrimarySchoolMessages.confirm.overviewDescription,
                )}
              </Text>
            </Box>
          </Box>
          <Box>
            <Button
              variant="utility"
              icon="print"
              onClick={(e) => {
                e.preventDefault()
                window.print()
              }}
            />
          </Box>
        </Box>
      )}
      {state !== `${States.DRAFT}` && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginTop={5}
          marginBottom={10}
        >
          <Box>
            <Text variant="h2">
              {formatMessage(newPrimarySchoolMessages.confirm.overviewTitle)}
            </Text>
          </Box>
          <Box display="flex" columnGap={2} alignItems="center">
            {state !== `${States.DRAFT}` && (
              <Button
                colorScheme="default"
                iconType="filled"
                size="small"
                type="button"
                variant="text"
                icon="pencil"
                loading={loadingSubmit}
                disabled={loadingSubmit}
                onClick={() => handleSubmit('EDIT')}
              >
                {formatMessage(newPrimarySchoolMessages.confirm.editButton)}
              </Button>
            )}
            <Button
              variant="utility"
              icon="print"
              onClick={(e) => {
                e.preventDefault()
                window.print()
              }}
            />
          </Box>
        </Box>
      )}
      <Child {...childProps} />
      <Parents {...childProps} />
      <Relatives {...childProps} />
      <Photography {...childProps} />
    </>
  )
}
