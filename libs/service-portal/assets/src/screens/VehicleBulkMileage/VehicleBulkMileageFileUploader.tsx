import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useRef } from 'react'
import { vehicleMessage } from '../../lib/messages'

interface Props {
  onUploadFileParseComplete?: (records: Array<MileageRecord>) => void
}

export interface MileageRecord {
  vehicleId: string
  mileage: number
}

const VehicleBulkMileageFileUploader = ({
  onUploadFileParseComplete,
}: Props) => {
  const { formatMessage } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileUploadButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const reader = file.stream().getReader()

    let parsedLines: Array<string> = []
    const parseChunk = (res: ReadableStreamReadResult<Uint8Array>) => {
      if (res.done) {
        return
      }

      const chunk = Buffer.from(res.value).toString('utf8')
      const lines = chunk
        .split(new RegExp(',|\\r|\\n|\\r\\n|;'))
        .filter((str) => str !== '')

      parsedLines = parsedLines.concat(lines)
    }
    await reader.read().then(parseChunk)

    const uploadedOdometerStatuses: Array<MileageRecord> = []

    const isMileageEvenOrOdd =
      parsedLines[0] === 'ökutæki' || parsedLines[0] === 'Ökutæki'
        ? 'odd'
        : 'even'

    for (let i = 2; i < parsedLines.length; i = i + 2) {
      const vehicleId =
        isMileageEvenOrOdd === 'even' ? parsedLines[i + 1] : parsedLines[i]

      console.log(parsedLines)
      if (!parsedLines[i] || !parsedLines[i + 1]) {
        continue
      }

      uploadedOdometerStatuses.push({
        vehicleId,
        mileage: parseInt(
          isMileageEvenOrOdd === 'even' ? parsedLines[i] : parsedLines[i + 1],
        ),
      })
    }

    onUploadFileParseComplete &&
      onUploadFileParseComplete(uploadedOdometerStatuses)
  }

  return (
    <form>
      <Button
        colorScheme="default"
        icon="arrowUp"
        iconType="outline"
        size="default"
        variant="utility"
        onClick={handleFileUploadButtonClick}
      >
        {formatMessage(vehicleMessage.uploadExcel)}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={handleFileUpload}
      />
    </form>
  )
}

export default VehicleBulkMileageFileUploader
