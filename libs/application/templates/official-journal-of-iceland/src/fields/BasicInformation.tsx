import { Text, Box, Button } from '@island.is/island-ui/core'

import React, { FC, useReducer, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { m } from '../lib/messages'
import { FormWrap } from '../components/FormWrap'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'

export const BasicInformation: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  const { formatMessage } = useLocale()
  const [hasFilledForm, setHasFilledForm] = useState(false)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

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
      header={{
        children: (
          <Text variant="h2" as="h1">
            {formatText(
              m.basicInformationFormTitle,
              application,
              formatMessage,
            )}
          </Text>
        ),
        button: (
          <Button variant="utility" iconType="outline" icon="copy">
            {formatText(
              m.copyOlderApplicationTemplate,
              application,
              formatMessage,
            )}
          </Button>
        ),
      }}
    >
      <Text>
        {formatText(m.basicInformationIntro, application, formatMessage)}
      </Text>
    </FormWrap>
  )
}

export default BasicInformation
