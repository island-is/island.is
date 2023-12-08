import { Text, Box, Button, Checkbox } from '@island.is/island-ui/core'

import React, { FC, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { m } from '../lib/messages'
import { FormWrap } from '../components/FormWrap'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'

export const Prerequisites: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  const { formatMessage } = useLocale()
  const [agreed, setAgreed] = useState(false)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const onGoBack = () => {
    window.open(`${window.location.origin}/minarsidur`, '_blank')
  }

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
          <Button disabled={!agreed} onClick={onContinue} icon="arrowForward">
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
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
          </Box>
        </Box>
      </Box>
    </FormWrap>
  )
}

export default Prerequisites
