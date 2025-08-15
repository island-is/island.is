import { useState } from 'react'
import { Box, Button, Text, Checkbox, toast } from '@island.is/island-ui/core'
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

const AddConstituencyModal = ({
  lists,
  collection,
  candidateId,
  refetch,
}: {
  lists: SignatureCollectionList[]
  collection: SignatureCollection
  candidateId: string
  refetch: () => void
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

  const [addNewConstituency, { loading }] = useMutation(addConstituency, {
    onCompleted: () => {
      setModalIsOpen(false)
      refetch()
      toast.success(formatMessage(m.addConstituencySuccess))
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
    <Box>
      <Button
        variant="utility"
        icon="add"
        onClick={() => {
          setModalIsOpen(true)
        }}
      >
        {formatMessage(m.add)}
      </Button>
      <Modal
        id="addConstituency"
        isVisible={modalIsOpen}
        initialVisibility={false}
        onCloseModal={() => {
          setModalIsOpen(false)
          setSelectedConstituencies([])
        }}
      >
        <Box>
          <Text marginBottom={2} variant="h2">
            {formatMessage(m.addConstituency)}
          </Text>
          <Text marginBottom={5} variant="default">
            {formatMessage(m.addConstituencyDescription)}
          </Text>
          {filteredConstituencies.map((constituency) => (
            <Box key={constituency.id} marginBottom={3}>
              <Checkbox
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
                      selectedConstituencies.filter(
                        (c) => c !== constituency.id,
                      ),
                    )
                  }
                }}
              />
            </Box>
          ))}
          <Box display="flex" justifyContent="center" marginTop={7}>
            <Button onClick={() => onAddConstituency()} loading={loading}>
              {formatMessage(m.add)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default AddConstituencyModal
