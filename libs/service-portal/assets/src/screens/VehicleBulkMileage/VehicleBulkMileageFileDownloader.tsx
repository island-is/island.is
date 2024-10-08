import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { vehicleMessage } from '../../lib/messages'
import { downloadFile } from '@island.is/service-portal/core'
import { useState } from 'react'

interface Props {
  onError: (error: string) => void
}

const VehicleBulkMileageFileDownloader = ({ onError }: Props) => {
  const { formatMessage } = useLocale()
  const [isLoading, setIsLoading] = useState(false)

  const downloadExampleFile = async () => {
    setIsLoading(true)
    try {
      downloadFile(
        `magnskraning_kilometrastodu_example`,
        ['permno', 'mileage'],
        [
          ['ABC001', 10000],
          ['DEF002', 99999],
        ],
        'csv',
      )
    } catch (error) {
      onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      colorScheme="default"
      icon="download"
      iconType="outline"
      size="default"
      variant="utility"
      onClick={downloadExampleFile}
      loading={isLoading}
    >
      {formatMessage(vehicleMessage.downloadTemplate)}
    </Button>
  )
}

export default VehicleBulkMileageFileDownloader
