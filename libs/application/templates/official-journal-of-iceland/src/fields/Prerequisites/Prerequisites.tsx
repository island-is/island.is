import { Text, Box, Button, Checkbox } from '@island.is/island-ui/core'

import React, { FC, useCallback, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { FormWrap } from '../../components/FormWrap/FormWrap'
import {
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'

export const Prerequisites: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  const { locale, formatMessage } = useLocale()
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
            {formatText(m.overview, application, formatMessage)}
          </Button>
        ),
        nextButton: (
          <Button
            loading={loading}
            disabled={!hasAgreed}
            onClick={onContinue}
            icon="arrowForward"
          >
            {formatText(m.continue, application, formatMessage)}
          </Button>
        ),
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="spaceBetween">
        <Box>
          <Text variant="h2" marginBottom={2}>
            {formatText(m.prerequisitesFormTitle, application, formatMessage)}
          </Text>
          <Text marginBottom={2}>
            {formatText(
              m.prerequisitesSectionDescriptionIntro,
              application,
              formatMessage,
            )}
          </Text>
          <Text marginBottom={2}>
            {formatText(
              m.prerequisitesSectionDescriptionMain,
              application,
              formatMessage,
            )}
          </Text>
          <Text marginBottom={4}>
            {formatText(
              m.prerequisitesSectionDescriptionFinal,
              application,
              formatMessage,
            )}
          </Text>
          <Box
            padding={3}
            background="blue100"
            borderRadius="large"
            border="standard"
          >
            <Checkbox
              // large
              label={formatText(
                m.prerequisitesCheckboxLabel,
                application,
                formatMessage,
              )}
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
