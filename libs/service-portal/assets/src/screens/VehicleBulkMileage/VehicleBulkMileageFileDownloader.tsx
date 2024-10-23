import { Button, Inline } from '@island.is/island-ui/core'
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

  const downloadExampleFile = async (type: 'csv' | 'xlsx') => {
    setIsLoading(true)
    try {
      downloadFile(
        `magnskraning_kilometrastodu_example`,
        ['bilnumer', 'kilometrastada'],
        [
          ['ABC001', 10000],
          ['DEF002', 99999],
        ],
        type,
      )
    } catch (error) {
      onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Inline space={1}>
      <Button
        colorScheme="default"
        icon="download"
        iconType="outline"
        size="default"
        variant="utility"
        onClick={() => downloadExampleFile('csv')}
        loading={isLoading}
      >
        {formatMessage(vehicleMessage.downloadTemplate)}
      </Button>
      <Button
        colorScheme="default"
        icon="download"
        iconType="outline"
        size="default"
        variant="utility"
        onClick={() => downloadExampleFile('xlsx')}
        loading={isLoading}
      >
        {formatMessage(vehicleMessage.downloadTemplate)}
      </Button>
    </Inline>
  )
}

export default VehicleBulkMileageFileDownloader
