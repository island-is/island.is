import {
  ActionCard,
  Box,
  Button,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader, Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useGetListsForUser, useGetSignedList } from '../../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../skeletons'
import { useMutation } from '@apollo/client'
import { unSignList } from '../../hooks/graphql/mutations'
import { SignatureCollectionSuccess } from '@island.is/api/schema'

const SigneeView = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { signedList, loadingSignedList, refetchSignedList } =
    useGetSignedList()
  const { listsForUser, loadingUserLists, refetchListsForUser } =
    useGetListsForUser()

  const [unSign, { loading }] = useMutation(unSignList, {
    variables: {
      input: {
        id: signedList?.id,
      },
    },
  })

  const onUnSignList = async () => {
    await unSign().then(({ data }) => {
      if (
        (
          data as any as {
            signatureCollectionUnsign: SignatureCollectionSuccess
          }
        ).signatureCollectionUnsign.success
      ) {
        toast.success(formatMessage(m.unSignSuccess))
        setModalIsOpen(false)
        refetchSignedList()
        refetchListsForUser()
      } else {
        toast.error(formatMessage(m.unSignError))
        setModalIsOpen(false)
      }
    })
  }

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescriptionSignee)}
      />
      {!loadingSignedList && !loadingUserLists ? (
        <Box>
          {listsForUser.length === 0 && (
            <Button
              icon="open"
              iconType="outline"
              onClick={() =>
                window.open(
                  `${document.location.origin}/umsoknir/medmaelasofnun/`,
                )
              }
              size="small"
            >
              {formatMessage(m.createListButton)}
            </Button>
          )}
          {/* Signed list */}
          {!!signedList && (
            <Box marginTop={[0, 7]}>
              <Text variant="h4" marginBottom={3}>
                {formatMessage(m.mySigneeListsHeader)}
              </Text>
              <ActionCard
                heading={signedList.title}
                eyebrow={
                  formatMessage(m.endTime) +
                  ' ' +
                  format(new Date(signedList.endTime), 'dd.MM.yyyy')
                }
                text={formatMessage(m.collectionTitle)}
                cta={
                  new Date(signedList.endTime) > new Date()
                    ? {
                        label: formatMessage(m.unSignList),
                        buttonType: {
                          variant: 'text',
                          colorScheme: 'destructive',
                        },
                        onClick: () => setModalIsOpen(true),
                        icon: undefined,
                      }
                    : undefined
                }
                tag={
                  new Date(signedList.endTime) < new Date()
                    ? {
                        label: formatMessage(m.collectionClosed),
                        variant: 'red',
                        outlined: true,
                      }
                    : undefined
                }
              />
              <Modal
                id="unSignList"
                isVisible={modalIsOpen}
                toggleClose={false}
                initialVisibility={false}
                onCloseModal={() => setModalIsOpen(false)}
              >
                <Text variant="h2" marginTop={[5, 0]}>
                  {formatMessage(m.unSignModalMessage)}
                </Text>
                <Box marginTop={[5, 10]} display="flex" justifyContent="center">
                  <Button
                    loading={loading}
                    onClick={() => {
                      onUnSignList()
                    }}
                  >
                    {formatMessage(m.unSignModalConfirmButton)}
                  </Button>
                </Box>
              </Modal>
            </Box>
          )}
          {/* Other available lists */}
          <Box marginTop={[5, 10]}>
            {listsForUser.length > 0 && (
              <Text variant="h4" marginBottom={3}>
                {formatMessage(m.mySigneeListsByAreaHeader)}
              </Text>
            )}

            <Stack space={5}>
              {listsForUser?.map((list) => {
                return (
                  <ActionCard
                    key={list.id}
                    backgroundColor="white"
                    heading={list.title}
                    eyebrow={
                      formatMessage(m.endTime) +
                      ' ' +
                      format(new Date(list.endTime), 'dd.MM.yyyy')
                    }
                    text={formatMessage(m.collectionTitle)}
                    cta={
                      new Date(list.endTime) > new Date() && !list.maxReached
                        ? {
                            label: formatMessage(m.signList),
                            variant: 'text',
                            icon: 'arrowForward',
                            disabled: signedList !== null,
                            onClick: () => {
                              window.open(
                                `${document.location.origin}${list.slug}`,
                              )
                            },
                          }
                        : undefined
                    }
                    tag={
                      new Date(list.endTime) < new Date()
                        ? {
                            label: formatMessage(m.collectionClosed),
                            variant: 'red',
                            outlined: true,
                          }
                        : list.maxReached
                        ? {
                            label: formatMessage(m.collectionMaxReached),
                            variant: 'red',
                            outlined: true,
                          }
                        : undefined
                    }
                  />
                )
              })}
            </Stack>
          </Box>
        </Box>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default SigneeView
