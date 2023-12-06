import {
  Box,
  InputFileUpload,
  Text,
  Button,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { resultsForComparison } from '../../../lib/utils'

const CompareLists = () => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <Box marginTop={10}>
      <Box
        background="purple100"
        borderRadius="large"
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        padding={3}
      >
        <Text>{formatMessage(m.uploadFileDescription)}</Text>
        <Button
          icon="documents"
          iconType="outline"
          variant="utility"
          size="small"
          onClick={() => setModalIsOpen(true)}
        >
          {formatMessage(m.compareLists)}
        </Button>
      </Box>
      <Modal
        id="compareLists"
        isVisible={modalIsOpen}
        title={formatMessage(m.compareLists)}
        onClose={() => setModalIsOpen(false)}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text>{formatMessage(m.uploadFileDescription)}</Text>
        <Box paddingTop={5}>
          <InputFileUpload
            fileList={[]}
            header={formatMessage(m.uploadHeader)}
            description={formatMessage(m.uploadText)}
            buttonLabel={formatMessage(m.uploadButton)}
            onChange={() => console.log('todo')}
            onRemove={() => console.log('todo')}
          />
          <Box marginTop={7} marginBottom={5}>
            <Text variant="h3" marginBottom={1}>
              {formatMessage(m.compareListsResultsHeader)}
            </Text>
            <Text marginBottom={5}>
              {formatMessage(m.compareListsResultsDescription)}
            </Text>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{formatMessage(m.signeeNationalId)}</T.HeadData>
                  <T.HeadData>{formatMessage(m.signeeName)}</T.HeadData>
                  <T.HeadData>{formatMessage(m.singleList)}</T.HeadData>
                  <T.HeadData></T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                <T.Row>
                  <T.Data style={{ minWidth: '140px' }}>
                    {resultsForComparison.nationalId}
                  </T.Data>
                  <T.Data style={{ minWidth: '250px' }}>
                    {resultsForComparison.name}
                  </T.Data>
                  <T.Data>{resultsForComparison.list}</T.Data>
                  <T.Data style={{ minWidth: '160px' }}>
                    <Button variant="utility">
                      {formatMessage(m.deleteFromList)}
                    </Button>
                  </T.Data>
                </T.Row>
              </T.Body>
            </T.Table>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default CompareLists
