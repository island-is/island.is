import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'

import { useMutation } from '@apollo/client'
import {
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import { DefaultEvents } from '@island.is/application/types'
import { useCallback } from 'react'
import { FormWrap } from '../../components/FormWrap/FormWrap'
import { useFormatMessage } from '../../hooks'
import { general, prerequisites } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'

export const Prerequisites = ({ application, refetch }: OJOIFieldBaseProps) => {
  const { f, locale } = useFormatMessage(application)
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const hasAgreed = application.answers?.approveExternalData
    ? (application.answers.approveExternalData as boolean)
    : false

  const onGoBack = () => {
    window.open(`${window.location.origin}/minarsidur`, '_blank')
  }
  const updateAnswers = useCallback(async (checked: boolean) => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            approveExternalData: checked,
          },
        },
        locale,
      },
    }).then(({ data, errors } = {}) => {
      if (data && !errors?.length) {
        // Takes them to the next state (which loads the relevant form)
        refetch?.()
      } else {
        return Promise.reject()
      }
    })
  }, [])

  const onContinue = () => {
    submitApplication({
      variables: {
        input: {
          id: application.id,
          event: DefaultEvents.SUBMIT,
          answers: application.answers,
        },
      },
    }).then(({ data, errors } = {}) => {
      if (data && !errors?.length) {
        // Takes them to the next state (which loads the relevant form)
        refetch?.()
      } else {
        return Promise.reject()
      }
    })
  }

  return (
    <FormWrap
      footer={{
        prevButton: (
          <Button variant="ghost" onClick={onGoBack} preTextIcon="arrowBack">
            {f(prerequisites.button.label)}
          </Button>
        ),
        nextButton: (
          <Button
            loading={loading}
            disabled={!hasAgreed}
            onClick={onContinue}
            icon="arrowForward"
          >
            {f(general.continue)}
          </Button>
        ),
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="spaceBetween">
        <Box>
          <Text variant="h2" marginBottom={2}>
            {f(prerequisites.general.formTitle)}
          </Text>
          <Text marginBottom={2}>
            {f(prerequisites.general.formIntro, {
              br: (
                <>
                  <br />
                  <br />
                </>
              ),
            })}
          </Text>
          <Box
            padding={3}
            background="blue100"
            borderRadius="large"
            border="standard"
          >
            <Checkbox
              // large
              label={f(prerequisites.checkbox.label)}
              checked={application.answers?.approveExternalData ? true : false}
              onChange={(e) => updateAnswers(e.target.checked)}
            />
          </Box>
        </Box>
      </Box>
    </FormWrap>
  )
}

export default Prerequisites
