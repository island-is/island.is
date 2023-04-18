import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
  Box,
  Button,
  Column,
  Columns,
  DialogPrompt,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { m } from '../../lib/messages'
import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '../../types/schema'
import PetitionsTable from '../PetitionsTable'
import { UnendorseList } from '../queries'

import Skeleton from '../Skeletons/Skeleton'
import {
  useGetSingleEndorsement,
  useGetSinglePetition,
  useGetSinglePetitionEndorsements,
} from '../hooks'

const ViewSignedList = () => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  const location: any = useLocation()
  const listId = location.pathname.replace('/min-gogn/listar/', '')

  const { petitionData } = useGetSinglePetition(listId)
  const petition = petitionData as EndorsementList

  const userHasSigned = useGetSingleEndorsement(listId)
  const [unSignList, { loading: isLoading }] = useMutation(UnendorseList, {
    onCompleted: () => {
      refetchSinglePetitionEndorsements()
    },
  })

  const [isListOpen, setIsListOpen] = useState(
    new Date() <= new Date(petition?.closedDate),
  )

  const [hasSigned, setHasSigned] = useState(userHasSigned ? true : false)

  const {
    petitionEndorsements,
    refetchSinglePetitionEndorsements,
  } = useGetSinglePetitionEndorsements(listId)

  useEffect(() => {
    setHasSigned(userHasSigned ? true : false)
    setIsListOpen(new Date() <= new Date(petition?.closedDate))
  }, [userHasSigned, petition, isListOpen])

  const onUnsign = async () => {
    const success = await unSignList({
      variables: {
        input: {
          listId: listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastErrorOnCloseList))
    })

    if (success) {
      toast.success(formatMessage(m.toastSuccess))
      setHasSigned(false)
    }
  }

  return (
    <Box>
      {Object.entries(petition).length !== 0 ? (
        <>
          <Columns>
            <Column width="11/12">
              <Stack space={2}>
                <Text variant="h3">{petition?.title}</Text>
                <Text>{petition?.description as string}</Text>
                <Box
                  display={['block', 'flex']}
                  justifyContent="spaceBetween"
                  width={'full'}
                >
                  <Box>
                    <Text variant="h4">{formatMessage(m.listOpenTil)}</Text>
                    <Text variant="default">
                      {format(new Date(petition?.closedDate), 'dd.MM.yyyy')}
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="h4">{formatMessage(m.listOwner)}</Text>
                    <Text variant="default">{petition?.ownerName}</Text>
                  </Box>
                  <Box>
                    <Text variant="h4">
                      {formatMessage(m.listHowManySigned)}
                    </Text>
                    <Text variant="default">
                      {
                        (petitionEndorsements as PaginatedEndorsementResponse)
                          .totalCount
                      }
                    </Text>
                  </Box>
                </Box>
              </Stack>
            </Column>
          </Columns>

          <Box marginTop={5} marginBottom={10}>
            {hasSigned && isListOpen && (
              <Box width="half">
                <DialogPrompt
                  baseId="dialog"
                  title={formatMessage(m.modalUnsign)}
                  ariaLabel={''}
                  disclosureElement={
                    <Button loading={isLoading} variant="ghost">
                      {formatMessage(m.unsignList)}
                    </Button>
                  }
                  onConfirm={() => onUnsign()}
                  buttonTextConfirm={formatMessage(m.modalButtonCloseListYes)}
                  buttonTextCancel={formatMessage(m.modalButtonNo)}
                />
              </Box>
            )}
            {!hasSigned && isListOpen && (
              <Box width="half">
                <Button
                  variant="ghost"
                  icon="arrowForward"
                  onClick={() =>
                    window.open(
                      `${document.location.origin}/umsoknir/undirskriftalisti/${petition?.meta.applicationId}`,
                    )
                  }
                >
                  {formatMessage(m.signList)}
                </Button>
              </Box>
            )}
          </Box>
          <PetitionsTable
            petitions={petitionEndorsements}
            listId={listId}
            canEdit={false}
          />
        </>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewSignedList
