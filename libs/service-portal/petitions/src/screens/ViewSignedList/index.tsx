import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
  Box,
  Button,
  Column,
  Columns,
  GridColumn,
  GridRow,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { m } from '../../lib/messages'

import PetitionsTable from '../PetitionsTable'
import { UnendorseList } from '../queries'

import Skeleton from '../Skeletons/Skeleton'
import {
  useGetSingleEndorsement,
  useGetSinglePetition,
  useGetSinglePetitionEndorsements,
} from '../hooks'
import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import { Modal } from '@island.is/service-portal/core'

const ViewSignedList = () => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const listId = pathname.replace('/min-gogn/listar/', '')

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

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { petitionEndorsements, refetchSinglePetitionEndorsements } =
    useGetSinglePetitionEndorsements(listId)

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
                    <Text variant="h4" marginTop={[2, 0]}>
                      {formatMessage(m.listOpenTil)}
                    </Text>
                    <Text variant="default">
                      {format(new Date(petition?.closedDate), 'dd.MM.yyyy')}
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="h4" marginTop={[2, 0]}>
                      {formatMessage(m.listOwner)}
                    </Text>
                    <Text variant="default">{petition?.ownerName}</Text>
                  </Box>
                  <Box>
                    <Text variant="h4" marginTop={[2, 0]}>
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

          <Box marginTop={5} marginBottom={[5, 10]}>
            {hasSigned && isListOpen && (
              <Modal
                id="setDate"
                isVisible={modalIsOpen}
                toggleClose={false}
                initialVisibility={false}
                disclosure={
                  <Button
                    colorScheme="default"
                    variant="ghost"
                    onClick={() => setModalIsOpen(true)}
                    loading={isLoading}
                  >
                    {formatMessage(m.unsignList)}
                  </Button>
                }
              >
                <Text variant="h1" paddingTop={5}>
                  {formatMessage(m.modalUnsign)}
                </Text>
                <Box
                  marginTop={10}
                  display="flex"
                  justifyContent="spaceBetween"
                >
                  <Button variant="ghost" onClick={() => setModalIsOpen(false)}>
                    {formatMessage(m.modalButtonNo)}
                  </Button>
                  <Button onClick={() => onUnsign()}>
                    {formatMessage(m.modalButtonUnsignListYes)}
                  </Button>
                </Box>
              </Modal>
            )}
            {!hasSigned && isListOpen && (
              <GridRow marginTop={5} marginBottom={[5, 10]}>
                <GridColumn span={['12/12', '6/12']}>
                  <Button
                    variant="ghost"
                    icon="open"
                    iconType="outline"
                    onClick={() =>
                      window.open(
                        `${document.location.origin}/umsoknir/undirskriftalisti/${petition?.meta.applicationId}`,
                      )
                    }
                  >
                    {formatMessage(m.signList)}
                  </Button>
                </GridColumn>
              </GridRow>
            )}
          </Box>

          {isListOpen && (
            <PetitionsTable
              petitionSigners={
                petitionEndorsements as PaginatedEndorsementResponse
              }
              listId={listId}
              canEdit={false}
            />
          )}
        </>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewSignedList
