import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { vehicleMessage } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'
import { downloadFile, formatDate } from '@island.is/service-portal/core'

const VehicleBulkMileageFileDownloader = () => {
  const { formatMessage } = useLocale()

  const { getValues } = useFormContext()

  const handleFileDownload = async () => {
    const formValues = getValues()
    const today = new Date()

    const dataArrays = Object.keys(formValues).map((key) => {
      const val = formValues[key]
      return [key, val ? `${val} km` : '']
    })
    downloadFile(
      `magnskraning_kilometrastodu-${formatDate(today, 'dd-MM-yyyy')}`,
      ['Fastanúmer', 'Kílómetrastaða'],
      dataArrays,
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
      {formatMessage(vehicleMessage.downloadExcel)}
    </Button>
  )
}

export default VehicleBulkMileageFileDownloader
