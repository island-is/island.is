import React, { FC, useCallback } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { formatMessage } from '@formatjs/intl'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'
import { States } from '../../constants'

const ResidentGrantApplication: FC<FieldBaseProps> = ({
  application,
  refetch
}) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => e,
    },
  )
  const submitApplicationOnClick = async () => {
      const res = await submitApplication({
        variables: {
          input: {
            id: application.id,
            event: 'ADDITIONALDOCUMENTREQUIRED',
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
    <Box>
      <Text>ResidentGrantApplication</Text>
      <Button onClick={() => submitApplicationOnClick()}>
        Go back
      </Button>
    </Box>
  )
}

export default ResidentGrantApplication
