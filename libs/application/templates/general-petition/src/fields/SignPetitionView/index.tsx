import { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Text, Box, Button, Input, toast } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { CheckboxController } from '@island.is/shared/form-fields'
import { useMutation, useQuery } from '@apollo/client'
import { useHasEndorsed } from '../../hooks/useHasEndorsed'
import { useGetSinglePetitionList } from '../../hooks/useGetSinglePetitionList'
import { GetFullName } from '../../graphql/queries'
import { EndorseList } from '../../graphql/mutations'
import format from 'date-fns/format'
import { EndorsementList } from '../../types/schema'
import Skeleton from './Skeleton'
import ListCreated from '../ListCreated'

const SignPetitionView: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id

  const [agreed, setAgreed] = useState(false)
  const [allowName, setAllowName] = useState(true)
  const [hasEndorsed, setHasEndorsed] = useState(false)

  const { petitionData } = useGetSinglePetitionList(endorsementListId)
  const petition = petitionData as EndorsementList

  const endorsedBefore = useHasEndorsed(endorsementListId)
  const isClosed = new Date() >= new Date(petition.closedDate)
  const [createEndorsement, { loading: submitLoad }] = useMutation(EndorseList)
  const { data: userData } = useQuery(GetFullName)

  const onEndorse = async () => {
    const success = await createEndorsement({
      variables: {
        input: {
          listId: endorsementListId,
          endorsementDto: {
            showName: allowName,
          },
        },
      },
    }).catch(() => {
      toast.error(formatMessage(''))
    })

    if (success) {
      setHasEndorsed(true)
    }
  }

  return (
    <Box>
      {endorsedBefore || hasEndorsed ? (
        <ListCreated application={application} />
      ) : (
        <Box>
          {Object.entries(petition).length > 0 ? (
            <>
              <Box marginBottom={2}>
                <Text variant="h2" marginBottom={1}>
                  {petition?.title}
                </Text>
                <Text variant="default" marginBottom={3}>
                  {petition?.description}
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Text variant="h4">{formatMessage('')}</Text>
                {petition && petition.closedDate && (
                  <Text variant="default">
                    {format(new Date(petition.closedDate), 'dd.MM.yyyy')}
                  </Text>
                )}
              </Box>
              <Box marginBottom={3}>
                <Text variant="h4">{formatMessage('')}</Text>
                <Text variant="default">{petition.ownerName}</Text>
              </Box>
              <Box display="flex" marginBottom={10}>
                <Box width="half">
                  <Input
                    label={formatMessage('')}
                    name={formatMessage('')}
                    value={userData?.nationalRegistryUser?.fullName}
                    backgroundColor="blue"
                  />
                </Box>
                <Box marginTop={3} marginLeft={4}>
                  <CheckboxController
                    id="allowName"
                    name="allowName"
                    large={false}
                    defaultValue={[]}
                    onSelect={() => setAllowName(!allowName)}
                    options={[
                      {
                        value: 'allow',
                        label: formatMessage(''),
                      },
                    ]}
                  />
                </Box>
              </Box>
              <CheckboxController
                id="terms"
                name="terms"
                large={true}
                backgroundColor="blue"
                defaultValue={[]}
                disabled={isClosed}
                onSelect={() => setAgreed(!agreed)}
                options={[
                  {
                    value: 'agree',
                    label: formatMessage(''),
                  },
                ]}
              />
            </>
          ) : (
            <Skeleton />
          )}
          {isClosed && (
            <Text variant="eyebrow" color="red400">
              {formatMessage('')}
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
              {formatMessage('')}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SignPetitionView
