import { useState } from 'react'
import {
  Box,
  Button,
  Text,
  Checkbox,
  toast,
  Stack,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import {
  SignatureCollection,
  SignatureCollectionArea,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { addConstituency } from '../../../../hooks/graphql/mutations'
import { useMutation } from '@apollo/client'
import { useIsOwner } from '../../../../hooks'

const AddConstituencyModal = ({
  lists,
  collection,
  candidateId,
}: {
  lists: SignatureCollectionList[]
  collection: SignatureCollection
  candidateId: string
}) => {
  const { formatMessage } = useLocale()
  const currentConstituencies = lists.map(
    (l) => l.area,
  ) as SignatureCollectionArea[]
  const filteredConstituencies = collection.areas.filter(
    (cc) => !currentConstituencies.some((c) => cc.name === c.name),
  ) as SignatureCollectionArea[]

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedConstituencies, setSelectedConstituencies] = useState<
    string[]
  >([])
  const { refetchIsOwner } = useIsOwner(collection?.collectionType)

  const [addNewConstituency, { loading }] = useMutation(addConstituency, {
    onCompleted: (res) => {
      const success = res?.signatureCollectionAddAreas.success
      if (success) {
        setSelectedConstituencies([])
        setModalIsOpen(false)
        refetchIsOwner()
        toast.success(formatMessage(m.addConstituencySuccess))
      } else {
        toast.error(formatMessage(m.addConstituencyError))
      }
    },
    onError: () => {
      toast.error(formatMessage(m.addConstituencyError))
    },
  })

  const onAddConstituency = async () => {
    addNewConstituency({
      variables: {
        input: {
          collectionId: collection?.id,
          areaIds: selectedConstituencies,
          candidateId: candidateId,
          collectionType: collection?.collectionType,
        },
      },
    })
  }

  return (
    <Modal
      id="addConstituency"
      isVisible={modalIsOpen}
      initialVisibility={false}
      onCloseModal={() => {
        setModalIsOpen(false)
        setSelectedConstituencies([])
      }}
      disclosure={
        <Button
          variant="utility"
          icon="add"
          onClick={() => {
            setModalIsOpen(true)
          }}
        >
          {formatMessage(m.addConstituency)}
        </Button>
      }
    >
      <Box display="block" width="full">
        <Text variant="h2" marginBottom={2}>
          {formatMessage(m.addConstituency)}
        </Text>
        <Text variant="default" marginBottom={5}>
          {formatMessage(m.addConstituencyDescription)}
        </Text>
        <Stack space={3}>
          {filteredConstituencies.map((constituency) => (
            <Checkbox
              key={constituency.id}
              large
              backgroundColor="blue"
              label={constituency.name}
              value={constituency.id}
              checked={selectedConstituencies.includes(constituency.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedConstituencies([
                    ...selectedConstituencies,
                    constituency.id,
                  ])
                } else {
                  setSelectedConstituencies(
                    selectedConstituencies.filter((c) => c !== constituency.id),
                  )
                }
              }}
            />
          ))}
        </Stack>
        <Box display="flex" justifyContent="center" marginTop={7}>
          <Button onClick={() => onAddConstituency()} loading={loading}>
            {formatMessage(m.add)}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddConstituencyModal
