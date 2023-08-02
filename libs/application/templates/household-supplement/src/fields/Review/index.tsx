import { Application, Field, RecordObject } from '@island.is/application/types'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useMutation } from '@apollo/client'
import get from 'lodash/get'
import has from 'lodash/has'

import { BaseInformation } from './review-groups/BaseInformation'
import { Payment } from './review-groups/Payment'
import { HouseholdSupplement } from './review-groups/HouseholdSupplement'
import { Comment } from './review-groups/Comment'
import { Attachments } from './review-groups/Attachments'
import { householdSupplementFormMessage } from '../../lib/messages'
import { States } from '../../lib/constants'
import { handleServerError } from '@island.is/application/ui-components'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { Period } from './review-groups/Period'

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
  const editable = field.props?.editable ?? false
  const { formatMessage } = useLocale()
  const { state } = application

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

  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const handleSubmit = async (event: string) => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event,
          answers: application.answers,
        },
      },
    })

    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }

  // TODO: Hvaða states eiga sjá þetta? Mega öll state sjá nema DRAFT og PREREQUISITES??
  const canView =
    state === States.TRYGGINGASTOFNUN_SUBMITTED ||
    state === States.TRYGGINGASTOFNUN_IN_REVIEW ||
    state === States.APPROVED ||
    state === States.REJECTED

  return (
    <>
      {state === `${States.DRAFT}` && (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(householdSupplementFormMessage.confirm.title)}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {formatMessage(
                  householdSupplementFormMessage.confirm.description,
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

      {canView && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginTop={5}
          marginBottom={10}
        >
          <Box>
            <Text variant="h2">
              {formatMessage(
                householdSupplementFormMessage.confirm.overviewTitle,
              )}
            </Text>
          </Box>

          <Box display="flex" columnGap={2} alignItems="center">
            {state === `${States.TRYGGINGASTOFNUN_SUBMITTED}` && (
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
                {formatMessage(
                  householdSupplementFormMessage.confirm.buttonsEdit,
                )}
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
      <BaseInformation {...childProps} />
      <Payment {...childProps} />
      <HouseholdSupplement {...childProps} />
      <Period {...childProps} />
      <Comment {...childProps} />
      <Attachments {...childProps} />
    </>
  )
}
