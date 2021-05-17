import React, { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const ReviewConstituency: FC<FieldBaseProps> = ({ application }) => {
  const { lang: locale, formatMessage } = useLocale()
  const { answers, externalData } = application
  const [partyLetter, setPartyLetter] = useState('')
  const [partyName, setPartyName] = useState('')
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)

  useEffect(() => {
    updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            partyLetter: 'K',
            partyName: 'Kosmos',
            ...application.answers,
          },
        },
        locale,
      },
    }).then((response) => {
      //temporary
      setPartyLetter(response.data?.updateApplication?.answers.partyLetter)
      setPartyName(response.data?.updateApplication?.answers.partyName)
      application.answers = response.data?.updateApplication?.answers
    })
  }, [])

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.partyletter)}</Text>
        <Text>{partyLetter}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">{formatMessage(m.overviewSection.party)}</Text>
        <Text>{partyName}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.responsiblePerson)}
        </Text>
        <Text>
          {
            (externalData.nationalRegistry?.data as {
              fullName?: string
            })?.fullName
          }
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">
          {formatMessage(m.overviewSection.constituency)}
        </Text>
        <Text>{answers.constituency}</Text>
      </Box>
    </>
  )
}

export default ReviewConstituency
