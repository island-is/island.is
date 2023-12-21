import {
  ActionCard,
  Box,
  Button,
  GridColumn,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useGetListsForUser, useGetSignedList } from '../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../Skeletons'
import { useMutation } from '@apollo/client'
import { unSignList } from '../mutations'

const SigneeView = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { signedList, loadingSignedList, refetchSignedList } =
    useGetSignedList()
  const { listsForUser, loadingUserLists } = useGetListsForUser()

  const [unSign] = useMutation(unSignList, {
    onCompleted: (res) => {
      refetchSignedList()

      if (res.data?.signatureCollectionUnsign.success) {
        toast.success(formatMessage(m.unSignSuccess))
        setModalIsOpen(false)
      } else {
        toast.error(formatMessage(m.unSignError))
      }
    },
  })

  const SignedList = () => {
    return (
      <Modal
        id="unSignList"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        onCloseModal={() => setModalIsOpen(false)}
        disclosure={
          <ActionCard
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
          <Button
            onClick={() =>
              unSign({
                variables: {
                  input: {
                    id: signedList.collectionId,
                  },
                },
              })
            }
          >
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
          <IntroHeader
            title={formatMessage(m.pageTitle)}
            intro={formatMessage(m.pageDescription)}
          >
            {listsForUser.length === 0 && (
              <GridColumn span={['8/8', '3/8']}>
                <Box
                  display={'flex'}
                  justifyContent={['flexStart', 'flexEnd']}
                  paddingTop={[2]}
                >
                  <Button
                    icon="open"
                    iconType="outline"
                    onClick={() =>
                      window.open(
                        `${document.location.origin}/umsoknir/medmaelalisti/`,
                      )
                    }
                    size="small"
                  >
                    {formatMessage(m.createListButton)}
                  </Button>
                </Box>
              </GridColumn>
            )}
          </IntroHeader>
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
