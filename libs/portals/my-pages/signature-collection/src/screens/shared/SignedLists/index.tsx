import { ActionCard, Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { Modal } from '@island.is/portals/my-pages/core'
import { useState } from 'react'
import { useGetSignedList } from '../../../hooks'
import format from 'date-fns/format'
import { useMutation } from '@apollo/client'
import { unSignList } from '../../../hooks/graphql/mutations'
import {
  Mutation,
  SignatureCollectionCollectionType,
  SignatureCollectionSignedList,
} from '@island.is/api/schema'

const SignedLists = ({
  signedLists,
}: {
  signedLists: SignatureCollectionSignedList[]
}) => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [listIdToUnsign, setListIdToUnsign] = useState<string | undefined>(
    undefined,
  )
  const collectionType = signedLists?.[0]?.collectionType ?? ''
  const { refetchSignedLists } = useGetSignedList(collectionType)

  const [unSign, { loading }] = useMutation<{
    signatureCollectionUnsign: Mutation['signatureCollectionUnsign']
  }>(unSignList, {
    variables: {
      input: {
        listId: listIdToUnsign,
        collectionType,
      },
    },
  })

  const onUnSignList = async () => {
    try {
      const { data } = await unSign()
      const success = data?.signatureCollectionUnsign?.success

      if (success) {
        toast.success(formatMessage(m.unSignSuccess))
        setModalIsOpen(false)
        refetchSignedLists()
      } else {
        setModalIsOpen(false)
      }
    } catch (e) {
      toast.error(formatMessage(m.unSignError))
    }
  }

  return (
    <Box marginTop={[5, 7]}>
      {signedLists?.length > 0 && (
        <Text marginBottom={2} variant="h4">
          {formatMessage(m.mySigneeListsHeader)}
        </Text>
      )}
      {signedLists?.map((list) => {
        return (
          <Box marginBottom={3} key={list.id}>
            <ActionCard
              heading={list.title.split(' - ')[0]}
              eyebrow={list.area?.name}
              text={
                collectionType ===
                SignatureCollectionCollectionType.Presidential
                  ? formatMessage(m.collectionTitle)
                  : collectionType ===
                    SignatureCollectionCollectionType.Parliamentary
                  ? formatMessage(m.collectionTitleParliamentary)
                  : `${formatMessage(m.collectionMunicipalListOwner)}: ${
                      list.candidate?.ownerName ?? ''
                    } (${format(
                      new Date(list.candidate?.ownerBirthDate),
                      'dd.MM.yyyy',
                    )})`
              }
              cta={
                list.canUnsign
                  ? {
                      label: formatMessage(m.unSignList),
                      buttonType: {
                        variant: 'text',
                        colorScheme: 'destructive',
                      },
                      onClick: () => {
                        setListIdToUnsign(list.id)
                        setModalIsOpen(true)
                      },
                      icon: undefined,
                    }
                  : undefined
              }
              tag={
                list.isValid && !list.active
                  ? {
                      label: formatMessage(m.collectionClosed),
                      variant: 'red',
                      outlined: true,
                    }
                  : list.isValid && !list.isDigital
                  ? {
                      label: formatMessage(m.paperUploadedSignature),
                      variant: 'blueberry',
                      outlined: true,
                    }
                  : list.isValid && list.isDigital
                  ? {
                      label:
                        formatMessage(m.digitalSignature) +
                        ' ' +
                        format(new Date(list.signedDate), 'dd.MM.yyyy'),
                      variant: 'blueberry',
                      outlined: true,
                    }
                  : !list.isValid
                  ? {
                      label: formatMessage(m.signatureIsInvalid),
                      variant: 'red',
                      outlined: false,
                    }
                  : undefined
              }
            />
          </Box>
        )
      })}
      <Modal
        id="unSignList"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        onCloseModal={() => {
          setListIdToUnsign(undefined)
          setModalIsOpen(false)
        }}
      >
        <Box display="block" width="full">
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
        </Box>
      </Modal>
    </Box>
  )
}

export default SignedLists
