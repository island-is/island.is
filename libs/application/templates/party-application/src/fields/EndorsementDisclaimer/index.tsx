import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Text,
  Box,
  Button,
  Input,
  AlertBanner,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useMutation, useQuery } from '@apollo/client'
import EndorsementApproved from '../EndorsementApproved'
import { GetFullName } from '../../graphql/queries'
import { EndorseList } from '../../graphql/mutations'
import { useIsClosed } from '../../hooks/useIsEndorsementClosed'
import { useVoterRegion } from '../../hooks/temporaryVoterRegistry'
import { useHasEndorsed } from '../../hooks/useHasEndorsed'
import { constituencyMapper, EndorsementListTags } from '../../constants'

const EndorsementDisclaimer: FC<FieldBaseProps> = ({ application }) => {
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const { partyLetter, partyName } = application.externalData
    .partyLetterRegistry?.data as any

  const { formatMessage } = useLocale()
  const [agreed, setAgreed] = useState(false)
  const [endorsedNow, setEndorsedNow] = useState(false)
  const [createEndorsement, { loading: submitLoad }] = useMutation(EndorseList)
  const { hasEndorsed, loading, refetch } = useHasEndorsed()
  const constituency =
    constituencyMapper[application.answers.constituency as EndorsementListTags]
      .region_name
  const { data: userData } = useQuery(GetFullName)
  const isClosed = useIsClosed(endorsementListId)
  const { isInVoterRegistry, isInConstituency } = useVoterRegion(
    application.answers.constituency as EndorsementListTags,
  )

  const onEndorse = async () => {
    const success = await createEndorsement({
      variables: {
        input: {
          listId: (application.externalData?.createEndorsementList.data as any)
            .id,
        },
      },
    }).catch((e) => {
      toast.error(formatMessage(m.endorsementDisclaimer.toastMessage))
    })
    if (success) {
      setEndorsedNow(true)
      refetch()
    }
  }

  const alertBannerDescription = !isInVoterRegistry
    ? formatMessage(
        m.endorsementDisclaimer.alertDescriptionVoterRegistryNotFound,
      )
    : !isInConstituency
    ? formatMessage(m.endorsementDisclaimer.alertDescriptionWrongConstituency)
    : undefined

  return (
    <Box>
      {!loading && (hasEndorsed || endorsedNow) ? (
        <EndorsementApproved showAsWarning={hasEndorsed && !endorsedNow} />
      ) : (
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2" marginBottom={3}>
              {`${formatMessage(m.endorsementDisclaimer.title)} ${partyLetter}`}
            </Text>
            <Text marginBottom={2}>
              {`${formatMessage(
                m.endorsementDisclaimer.messagePt1,
              )} ${constituency} ${formatMessage(
                m.endorsementDisclaimer.messagePt2,
              )} `}
            </Text>
          </Box>
          {alertBannerDescription && (
            <Box marginY={5}>
              <AlertBanner
                description={alertBannerDescription}
                variant="warning"
              />
            </Box>
          )}

          <Box width="half" marginBottom={4}>
            <Input
              disabled
              label={formatMessage(m.collectEndorsements.nameInput)}
              name={formatMessage(m.collectEndorsements.nameInput)}
              value={userData?.nationalRegistryUser?.fullName}
              defaultValue={userData?.nationalRegistryUser?.fullName}
              backgroundColor="blue"
            />
          </Box>
          <Box display={['block', 'block', 'flex']} marginBottom={5}>
            <Box>
              <Text variant="h4">
                {formatMessage(m.endorsementDisclaimer.partyLetter)}
              </Text>
              <Text>{`${partyLetter} `}</Text>
            </Box>
            <Box marginLeft={[0, 0, 12]}>
              <Text variant="h4">
                {formatMessage(m.endorsementDisclaimer.partyName)}
              </Text>
              <Text>{partyName}</Text>
            </Box>
          </Box>
          <Box marginBottom={4}>
            <FieldDescription
              description={formatMessage(
                m.endorsementDisclaimer.descriptionPt1,
              )}
            />
          </Box>
          <Box marginBottom={4}>
            <FieldDescription
              description={formatMessage(
                m.endorsementDisclaimer.descriptionPt2,
              )}
            />
          </Box>
          <Box marginBottom={5}>
            <FieldDescription
              description={formatMessage(
                m.endorsementDisclaimer.descriptionPt3,
              )}
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
                label: formatMessage(m.collectEndorsements.agreeTermsLabel),
              },
            ]}
          />
          {isClosed && (
            <Text variant="eyebrow" color="red400">
              {formatMessage(m.endorsementList.isClosedMessage)}
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
              {formatMessage(m.collectEndorsements.submitButton)}
            </Button>
          </Box>
          <ToastContainer closeButton={true} useKeyframeStyles={false} />
        </Box>
      )}
    </Box>
  )
}

export default EndorsementDisclaimer
