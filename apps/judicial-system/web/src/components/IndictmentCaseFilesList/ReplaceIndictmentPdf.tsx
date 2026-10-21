import type { ChangeEvent, FC } from 'react'
import { useRef, useState } from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

interface Props {
  caseId: string
}

const ReplaceIndictmentPdf: FC<Props> = ({ caseId }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { handleReplaceIndictmentPdf } = useS3Upload(caseId)

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    setIsUploading(true)

    const succeeded = await handleReplaceIndictmentPdf(file)

    setIsUploading(false)

    if (succeeded) {
      toast.success('Ákæru hefur verið skipt út')
    }
  }

  return (
    <Box marginTop={1}>
      <Text variant="small" marginBottom={1}>
        Skjalið kemur í stað ákærunnar sem kerfið bjó til.
      </Text>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleChange}
      />
      <Button
        variant="text"
        size="small"
        icon="document"
        loading={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        Skipta út ákæru
      </Button>
    </Box>
  )
}

export default ReplaceIndictmentPdf
