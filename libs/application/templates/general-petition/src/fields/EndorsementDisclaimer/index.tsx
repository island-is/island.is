import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Text, Box, Button, Input } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { GeneralPetition } from '../../lib/dataSchema'
import {
  CheckboxController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useMutation, useQuery } from '@apollo/client'
import EndorsementApproved from '../EndorsementApproved'
import { useHasEndorsed } from '../../hooks/useHasEndorsed'
import { GetFullName } from '../../graphql/queries'
import { EndorseList } from '../../graphql/mutations'
import { useIsClosed } from '../../hooks/useIsEndorsementClosed'

const EndorsementDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const { formatMessage } = useLocale()
  const [agreed, setAgreed] = useState(false)
  const [hasEndorsed, setHasEndorsed] = useState(false)
  const isClosed = useIsClosed(endorsementListId)

  const answers = application.answers as GeneralPetition
  const endorsedBefore = useHasEndorsed(endorsementListId)

  const [createEndorsement, { loading: submitLoad }] = useMutation(EndorseList)
  const { data: userData } = useQuery(GetFullName)

  const onEndorse = async () => {
    const success = await createEndorsement({
      variables: {
        input: {
          listId: endorsementListId,
        },
      },
    })
    if (success) {
      setHasEndorsed(true)
    }
  }

  return (
    <Box>
      {endorsedBefore || hasEndorsed ? (
        <EndorsementApproved />
      ) : (
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(m.endorsementForm.title)}
              <strong>{` ${answers.partyLetter}`}</strong>
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Text>
              {formatMessage(m.endorsementDisclaimer.part1)}
              <strong>{` ${answers.partyName} `}</strong>
              {formatMessage(m.endorsementDisclaimer.part2)}
              <strong>{` ${answers.partyLetter}`}</strong>.
            </Text>
          </Box>
          <Box width="half" marginBottom={4}>
            <Input
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
            disabled={isClosed}
            onSelect={() => setAgreed(!agreed)}
            options={[
              {
                value: 'agree',
                label: formatMessage(m.endorsementForm.agreeTermsLabel),
              },
            ]}
          />
          {isClosed && (
            <Text variant="eyebrow" color="red400">
              {formatMessage(m.endorsementForm.isClosedMessage)}
            </Text>
          )}
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
    </Box>
  )
}

export default EndorsementDisclaimer
