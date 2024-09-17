import { useState } from 'react'
import { Box, Button, Text, Checkbox } from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../../lib/messages'
import { constituencies } from '../../../../../lib/constants'
import { SignatureCollectionList } from '@island.is/api/schema'

const AddConstituencyModal = ({
  lists,
}: {
  lists: SignatureCollectionList[]
}) => {
  const { formatMessage } = useLocale()
  const listTitles = lists.map((l) => l.title)
  const filteredConstituencies = constituencies.filter(
    (c) => !listTitles.some((title) => title.includes(c)),
  )
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedConstituencies, setSelectedConstituencies] = useState<
    string[]
  >([])

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
        label={''}
      >
        <Box display="block" width="full">
          <Text marginBottom={2} variant="h2">
            {formatMessage(m.addConstituency)}
          </Text>
          <Text marginBottom={5} variant="default">
            {formatMessage(m.addConstituencyDescription)}
          </Text>
          {filteredConstituencies.map((constituency) => (
            <Box key={constituency} marginBottom={3}>
              <Checkbox
                large
                backgroundColor="blue"
                label={constituency}
                value={constituency}
                checked={selectedConstituencies.includes(constituency)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedConstituencies([
                      ...selectedConstituencies,
                      constituency,
                    ])
                  } else {
                    setSelectedConstituencies(
                      selectedConstituencies.filter((c) => c !== constituency),
                    )
                  }
                }}
              />
            </Box>
          ))}
          <Box display="flex" justifyContent="center" marginTop={7}>
            <Button>{formatMessage(m.add)}</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default AddConstituencyModal
