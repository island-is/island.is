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

  type EventType = {
    [key: string]: any
  }

  const eventsMap: EventType = {
    "closed": "CLOSED",
    "approved": "APPROVED",
    "employerApproval": "EMPLOYERAPPROVAL",
    "employerWaitingToAssign": "EMPLOYERWAITINGTOASSIGN",
    "vinnumalastofnunApproval": "VINNUMALASTOFNUNAPPROVAL",
    "additionalDocumentRequired": "ADDITIONALDOCUMENTREQUIRED",
  }

  const { previousState, ...rest } = application.answers
  console.log(previousState)
  const handleSubmitApplication = useCallback(async () => {
      const res = await submitApplication({
        variables: {
          input: {
            id: application.id,
            event: eventsMap[`${previousState}`],
            answers: rest,
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
      <Text >{field.description}</Text>
      {field.defaultValue === 'visible' &&
        <Box marginTop={5}>
          <Button 
            variant="ghost"
            onClick={handleSubmitApplication}
          >
            Farðu í umsókn.
          </Button>
        </Box>
      }
    </Box>
  )
}

export default ResidentGrantApplication
