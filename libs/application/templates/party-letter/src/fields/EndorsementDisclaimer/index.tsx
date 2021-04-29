import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text, Box, Button, Input } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { PartyLetter } from '../../lib/dataSchema'
import {
  CheckboxController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/client'
import EndorsementApproved from '../EndorsementApproved'

const GET_ENDORSEMENTS = gql`
  query endorsementSystemUserEndorsements {
    endorsementSystemUserEndorsements {
      id
      endorser
      endorsementListId
      meta {
        fullName
        address
      }
      created
      modified
    }
  }
`
const CREATE_ENDORSEMENT = gql`
  mutation endorsementSystemEndorseList($input: FindEndorsementListInput!) {
    endorsementSystemEndorseList(input: $input) {
      id
      endorser
      endorsementListId
      meta {
        fullName
      }
      created
      modified
    }
  }
`

const GET_FULLNAME = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      fullName
    }
  }
`

const EndorsementDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const [agreed, setAgreed] = useState(false)
  const [hasEndorsed, setHasEndorsed] = useState(false)
  const [createEndorsement, { loading: submitLoad }] = useMutation(
    CREATE_ENDORSEMENT,
  )

  const answers = (application as any).answers as PartyLetter
  const partyLetter = answers.party.letter
  const partyName = answers.party.name

  const { data: userData } = useQuery(GET_FULLNAME)

  const { loading, error } = useQuery(GET_ENDORSEMENTS, {
    onCompleted: async ({ endorsementSystemUserEndorsements }) => {
      if (!loading && endorsementSystemUserEndorsements) {
        const hasEndorsements =
          !error && !loading && endorsementSystemUserEndorsements?.length
            ? endorsementSystemUserEndorsements.length > 0
            : false
        setHasEndorsed(hasEndorsements)
      }
    },
  })

  const onEndorse = async () => {
    const success = await createEndorsement({
      variables: {
        input: {
          listId: '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
        },
      },
    })
    if (success) {
      setHasEndorsed(true)
    }
  }

  return (
    <>
      {hasEndorsed ? (
        <EndorsementApproved />
      ) : (
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(m.endorsementForm.title)}
              <strong>{` ${partyLetter}`}</strong>
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Text>
              {formatMessage(m.endorsementDisclaimer.part1)}
              <strong>{` ${partyName} `}</strong>
              {formatMessage(m.endorsementDisclaimer.part2)}
              <strong>{` ${partyLetter}`}</strong>.
            </Text>
          </Box>
          <Box width="half" marginBottom={4}>
            <Input
              disabled
              label={formatMessage(m.endorsementForm.nameInput)}
              name={formatMessage(m.endorsementForm.nameInput)}
              value={userData?.nationalRegistryUser?.fullName}
              backgroundColor="blue"
            />
          </Box>
          <Box marginBottom={4}>
            <FieldDescription
              description={formatMessage(m.endorsementForm.descriptionPt1)}
            />
          </Box>
          <Box marginBottom={5}>
            <FieldDescription
              description={formatMessage(m.endorsementForm.descriptionPt2)}
            />
          </Box>
          <CheckboxController
            id="terms"
            name="tere"
            large={true}
            backgroundColor="blue"
            defaultValue={[]}
            onSelect={() => setAgreed(!agreed)}
            options={[
              {
                value: 'agree',
                label: formatMessage(m.endorsementForm.agreeTermsLabel),
              },
            ]}
          />
          <Box
            marginTop={5}
            marginBottom={8}
            display="flex"
            justifyContent="flexEnd"
          >
            <Button
              loading={submitLoad}
              disabled={!agreed}
              icon="arrowForward"
              onClick={() => onEndorse()}
            >
              {formatMessage(m.endorsementForm.submitButton)}
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}

export default EndorsementDisclaimer
