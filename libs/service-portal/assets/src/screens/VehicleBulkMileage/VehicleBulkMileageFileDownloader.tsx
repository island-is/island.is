import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { vehicleMessage } from '../../lib/messages'
import { downloadFile } from '@island.is/service-portal/core'

const VehicleBulkMileageFileDownloader = () => {
  const { formatMessage } = useLocale()

  const handleFileDownload = async () => {
    downloadFile(
      `magnskraning_kilometrastodu_example`,
      ['Ökutæki', 'Kílómetrastaða'],
      [['ABC001', 10000]],
      'csv',
    )
  }

  return (
    <Button
      colorScheme="default"
      icon="download"
      iconType="outline"
      size="default"
      variant="utility"
      onClick={handleFileDownload}
    >
      {formatMessage(vehicleMessage.downloadTemplate)}
    </Button>
  )
}

export default VehicleBulkMileageFileDownloader
