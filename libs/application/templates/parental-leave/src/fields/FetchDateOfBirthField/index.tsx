import React, { FC, useCallback, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  APPLICATION_APPLICATION,
  SUBMIT_APPLICATION,
} from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { disableResidenceGrantApplication } from '../../lib/answerValidationSections/utils'

type DOBType = {
  applicationApplication: {
    externalData: {
      dateOfBirth: {
        data: {
          dateOfBirth: string
        }
      }
    }
  }
}
const FetchDateOfBirthField: FC<FieldBaseProps> = ({
  application,
  refetch,
}) => {
  const [hasDateOfBirth, setHasDateOfBirth] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const { formatMessage } = useLocale()
  const [getApplicationInfo, { data }] = useLazyQuery(APPLICATION_APPLICATION)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => handleServerError(e, formatMessage),
  })
  const handleSubmit = useCallback(async (event: string) => {
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
      refetch?.()
    }
  }, [])
  useEffect(() => {
    if (!hasDateOfBirth) {
      getApplicationInfo({
        variables: {
          input: {
            id: application.id,
          },
          locale: 'is',
        },
      })
      const dobObj = data as DOBType
      const dob =
        dobObj?.applicationApplication?.externalData?.dateOfBirth?.data
          ?.dateOfBirth
      if (dob) {
        setHasDateOfBirth(true)
        setDateOfBirth(dob)
      }
    }
  }, [data])
  const isDisabled = !disableResidenceGrantApplication(dateOfBirth)
  return (
    <Box>
      <Box display={'flex'} justifyContent={'center'} marginTop={5}>
        <Box>
          <Button
            disabled={isDisabled}
            variant="ghost"
            size="small"
            icon="arrowForward"
            onClick={() => handleSubmit('APPROVE')}
          >
            {formatMessage(
              parentalLeaveFormMessages.residenceGrantMessage
                .residenceGrantApplyTitle,
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default FetchDateOfBirthField
