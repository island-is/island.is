import React, { FC, useCallback, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  APPLICATION_APPLICATION,
  SUBMIT_APPLICATION,
} from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'

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
const RedirectField: FC<FieldBaseProps> = ({ application, refetch }) => {
  const [hasDateOfBirth, setHasDateOfBirth] = useState(false)
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
      const dateOfBirth =
        dobObj?.applicationApplication?.externalData?.dateOfBirth?.data
          ?.dateOfBirth
      if (dateOfBirth) {
        setHasDateOfBirth(true)
        setTimeout(() => {
          handleSubmit('RESIDENCEGRANTAPPLICATION')
        }, 5000)
      }
    }
  }, [data])
  return (
    <Box>
      {hasDateOfBirth ? (
        <Text>
          {formatMessage(
            parentalLeaveFormMessages.residenceGrantMessage
              .residenceGrantRedirectMessage,
          )}
        </Text>
      ) : (
        ''
      )}
    </Box>
  )
}

export default RedirectField
