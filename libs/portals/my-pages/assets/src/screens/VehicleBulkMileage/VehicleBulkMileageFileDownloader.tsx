import { DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { vehicleMessage } from '../../lib/messages'
import { downloadFile } from '@island.is/portals/my-pages/core'

interface Props {
  onError: (error: string) => void
}

const VehicleBulkMileageFileDownloader = ({ onError }: Props) => {
  const { formatMessage } = useLocale()

  const downloadExampleFile = async (type: 'csv' | 'xlsx') => {
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
