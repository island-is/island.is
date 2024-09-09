import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useRef } from 'react'
import { vehicleMessage } from '../../lib/messages'
import {
  MileageRecord,
  parseCsvToMileageRecord,
} from '../../utils/parseCsvToMileage'

interface Props {
  onUploadFileParseComplete?: (records: Array<MileageRecord>) => void
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

    const records = await parseCsvToMileageRecord(file)
    onUploadFileParseComplete && onUploadFileParseComplete(records)
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
