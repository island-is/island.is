import { ActionCard, Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useGetSignedList } from '../../hooks'
import format from 'date-fns/format'
import { useMutation } from '@apollo/client'
import { unSignList } from '../../hooks/graphql/mutations'
import {
  SignatureCollectionSignedList,
  SignatureCollectionSuccess,
} from '@island.is/api/schema'

const SignedList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { signedLists, refetchSignedList } = useGetSignedList()

  const [unSign, { loading }] = useMutation(unSignList, {
    variables: {
      input: {
        id: signedLists.length === 1 ?? signedLists[0].id,
      },
    },
  })

  const onUnSignList = async () => {
    try {
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
        } else {
          setModalIsOpen(false)
        }
      })
    } catch (e) {
      toast.error(formatMessage(m.unSignError))
    }
  }

  return (
    <Box>
      {!!signedLists && (
        <Box marginTop={[5, 7]}>
          <Text marginBottom={2}>{formatMessage(m.mySigneeListsHeader)}</Text>
          {signedLists.map((list: SignatureCollectionSignedList) => {
            return (
              <Box marginBottom={5}>
                <ActionCard
                  heading={list.title}
                  eyebrow={`${
                    list.isDigital
                      ? formatMessage(m.signedTime)
                      : formatMessage(m.uploadedTime)
                  } ${format(new Date(list.signedDate), 'dd.MM.yyyy')}`}
                  text={formatMessage(m.collectionTitle)}
                  cta={
                    list.canUnsign
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
                    list.isValid && new Date(list.endTime) < new Date()
                      ? {
                          label: formatMessage(m.collectionClosed),
                          variant: 'red',
                          outlined: true,
                        }
                      : list.isValid && !list.isDigital
                      ? {
                          label: formatMessage(m.paperUploadedSignature),
                          variant: 'blue',
                          outlined: true,
                        }
                      : !list.isValid
                      ? {
                          label: formatMessage('Ógilt meðmæli'),
                          variant: 'red',
                          outlined: false,
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
                    {formatMessage(m.unSignList)}
                  </Text>
                  <Text variant="default" marginTop={2}>
                    {formatMessage(m.unSignModalMessage)}
                  </Text>
                  <Box
                    marginTop={[7, 10]}
                    marginBottom={5}
                    display="flex"
                    justifyContent="center"
                  >
                    <Button
                      loading={loading}
                      colorScheme="destructive"
                      onClick={() => {
                        onUnSignList()
                      }}
                    >
                      {formatMessage(m.unSignModalConfirmButton)}
                    </Button>
                  </Box>
                </Modal>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default SignedList
