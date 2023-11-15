import {
  Accordion,
  Box,
  Checkbox,
  InputFileUpload,
  Text,
  AccordionItem,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useState } from 'react'

const PaperUpload = () => {
  const [withPaperUpload, setWithPaperUpload] = useState(false)
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={5}>
      <Box
        background={withPaperUpload ? 'purple100' : 'white'}
        padding={withPaperUpload ? 5 : 0}
        borderRadius="large"
      >
        <Box
          border={withPaperUpload ? undefined : 'standard'}
          paddingX={withPaperUpload ? 0 : 5}
          paddingY={withPaperUpload ? 0 : 3}
          borderRadius="large"
          cursor="pointer"
          onClick={() => setWithPaperUpload(!withPaperUpload)}
        >
          <Checkbox
            label={formatMessage(m.uploadFile)}
            checked={withPaperUpload}
            onChange={() => setWithPaperUpload(!withPaperUpload)}
          />
        </Box>
        {withPaperUpload && (
          <>
            <Box marginY={5}>
              <Text>{formatMessage(m.uploadFileDescription)}</Text>
            </Box>
            <InputFileUpload
              fileList={[]}
              header={formatMessage(m.uploadHeader)}
              description={formatMessage(m.uploadText)}
              buttonLabel={formatMessage(m.uploadButton)}
              onChange={() => console.log('æði!')}
              onRemove={() => console.log('onRemove')}
            />
            <Box marginTop={10}>
              <Text variant="h4" marginBottom={1}>
                {formatMessage(m.uploadResultsHeader)}
              </Text>
              <Accordion dividerOnTop={false}>
                <AccordionItem
                  id="uploadSuccess"
                  labelVariant="default"
                  label={formatMessage(m.nationalIdsSuccess)}
                >
                  <Text>{'todo'}</Text>
                </AccordionItem>
                <AccordionItem
                  id="uploadError"
                  labelVariant="default"
                  labelColor="red600"
                  label={formatMessage(m.nationalIdsError)}
                >
                  <Text>{'todo'}</Text>
                </AccordionItem>
              </Accordion>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default PaperUpload
