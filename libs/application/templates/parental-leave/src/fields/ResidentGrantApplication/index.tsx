import React, { FC, useCallback } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

const ResidentGrantApplication: FC<FieldBaseProps> = ({
  application,
  refetch,
  field,
}) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => e,
    },
  )
  const handleSubmitApplication = useCallback(async () => {
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
    }, [])
  
  return (
    <Box>
      <Text variant='h4'>{field.description}</Text>
      <Button onClick={handleSubmitApplication} >
        Go back
      </Button>
    </Box>
  )
}

export default ResidentGrantApplication
