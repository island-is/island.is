import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useGetListsForUser, useGetSignedList } from '../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../Skeletons'

const SigneeView = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { signedList, loadingSignedList, refetchSignedList } =
    useGetSignedList()
  const { listsForUser, loadingUserLists, refetchListsForUser } =
    useGetListsForUser()

  const onUnSignList = () => {
    setModalIsOpen(false)
    refetchSignedList()
    refetchListsForUser()
  }

  const SignedList = () => {
    return (
      <Modal
        id="cancelCollection"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        disclosure={
          <ActionCard
            backgroundColor="blue"
            heading={signedList.owner.name + ' - ' + signedList.area.name}
            eyebrow={format(new Date(signedList.endTime), 'dd.MM.yyyy')}
            text={formatMessage(m.collectionTitle)}
            cta={{
              label: formatMessage(m.unSignList),
              buttonType: {
                variant: 'text',
                colorScheme: 'destructive',
              },
              onClick: () => setModalIsOpen(true),
              icon: undefined,
            }}
          />
        }
      >
        <Text variant="h1" paddingTop={5}>
          {formatMessage(m.unSignModalMessage)}
        </Text>
        <Box marginTop={10} display="flex" justifyContent="center">
          <Button onClick={() => onUnSignList()}>
            {formatMessage(m.unSignModalConfirmButton)}
          </Button>
        </Box>
      </Modal>
    )
  }
  return (
    <div>
      {!loadingSignedList && !loadingUserLists ? (
        <Box>
          {!!signedList && (
            <Box marginTop={10}>
              <Text variant="h4" marginBottom={3}>
                {formatMessage(m.mySigneeListsHeader)}
              </Text>
              <SignedList />
            </Box>
          )}

          <Box marginTop={10}>
            <Text variant="h4" marginBottom={3}>
              {formatMessage(m.mySigneeListsByAreaHeader)}
            </Text>

            <Stack space={5}>
              {listsForUser?.map((list) => {
                return (
                  <ActionCard
                    key={list.id}
                    backgroundColor="white"
                    heading={list.owner.name + ' - ' + list.area.name}
                    eyebrow={format(new Date(list.endTime), 'dd.MM.yyyy')}
                    text={formatMessage(m.collectionTitle)}
                    cta={{
                      label: formatMessage(m.signList),
                      variant: 'text',
                      icon: 'arrowForward',
                      disabled: signedList !== null,
                      onClick: () => {
                        window.open(
                          `${document.location.origin}/umsoknir/maela-med-lista/`,
                        )
                      },
                    }}
                  />
                )
              })}
            </Stack>
          </Box>
        </Box>
      ) : (
        <Skeleton />
      )}
    </div>
  )
}

export default SigneeView
