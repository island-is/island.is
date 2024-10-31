import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import {
  Application,
  DefaultEvents,
  Field,
  RecordObject,
} from '@island.is/application/types'
import { handleServerError } from '@island.is/application/ui-components'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import get from 'lodash/get'
import has from 'lodash/has'
import { FC } from 'react'
import { ReasonForApplicationOptions, States } from '../../lib/constants'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/newPrimarySchoolUtils'

import { Child } from './review-groups/Child'
import { Languages } from './review-groups/Languages'
import { Parents } from './review-groups/Parents'
import { ReasonForApplication } from './review-groups/ReasonForApplication'
import { Relatives } from './review-groups/Relatives'
import { Siblings } from './review-groups/Siblings'
import { Support } from './review-groups/Support'
import { School } from './review-groups/School'

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

  const { reasonForApplication } = getApplicationAnswers(application.answers)

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

  return (
    <>
      {state === `${States.DRAFT}` && (
        <Box display="flex" justifyContent="spaceBetween">
          <Box>
            <Box marginBottom={2}>
              <Text variant="h2">
                {formatMessage(newPrimarySchoolMessages.overview.sectionTitle)}
              </Text>
            </Box>
            <Box marginBottom={10}>
              <Text variant="default">
                {formatMessage(
                  newPrimarySchoolMessages.overview.overviewDescription,
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
              {formatMessage(newPrimarySchoolMessages.overview.sectionTitle)}
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
                onClick={() => handleSubmit(DefaultEvents.EDIT)}
              >
                {formatMessage(newPrimarySchoolMessages.overview.editButton)}
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
      <ReasonForApplication {...childProps} />
      {reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD && (
        <>
          {reasonForApplication ===
            ReasonForApplicationOptions.SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL && (
            <Siblings {...childProps} />
          )}
          <School {...childProps} />
          <Languages {...childProps} />
          <Support {...childProps} />
        </>
      )}
    </>
  )
}
