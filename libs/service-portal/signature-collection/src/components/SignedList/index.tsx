import { ActionCard, Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useGetSignedList } from '../../hooks'
import format from 'date-fns/format'
import { useMutation } from '@apollo/client'
import { unSignList } from '../../hooks/graphql/mutations'
import { SignatureCollectionSuccess } from '@island.is/api/schema'

const SignedList = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { signedList, refetchSignedList } = useGetSignedList()

  const [unSign, { loading }] = useMutation(unSignList, {
    variables: {
      input: {
        id: signedList?.id,
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
      {!!signedList && (
        <Box marginTop={[5, 7]}>
          <Text marginBottom={2}>{formatMessage(m.mySigneeListsHeader)}</Text>
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
      )}
    </Box>
  )
}

export default SignedList
