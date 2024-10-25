import { Button, DropdownMenu, Inline } from '@island.is/island-ui/core'
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
    <DropdownMenu
      icon="ellipsisHorizontal"
      menuLabel={formatMessage(vehicleMessage.downloadTemplate)}
      items={(['csv', 'xlsx'] as const).map((type) => ({
        title: `.${type}`,
        onClick: () => downloadExampleFile(type),
      }))}
      title={formatMessage(vehicleMessage.downloadTemplate)}
    />
  )
}

export default VehicleBulkMileageFileDownloader
