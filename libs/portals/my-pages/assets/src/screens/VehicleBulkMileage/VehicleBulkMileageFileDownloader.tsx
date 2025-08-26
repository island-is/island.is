import { DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { vehicleMessage } from '../../lib/messages'
import { downloadFile } from '@island.is/portals/my-pages/core'
import { TableData } from './types'
import { useCallback, useMemo } from 'react'

interface Props {
  onError: (error: string) => void
  data?: TableData
  loading?: boolean
  disabled?: boolean
}

const FILE_TYPES = ['csv', 'xlsx'] as const

const VehicleBulkMileageFileDownloader = ({
  onError,
  data,
  loading,
  disabled,
}: Props) => {
  const { formatMessage } = useLocale()

  const downloadExampleFile = useCallback(
    async (type: 'csv' | 'xlsx', data: TableData) => {
      const header = Object.keys(data)
      const rows: Array<Array<unknown>> = []
      for (let i = 0; i < data['bilnumer'].length; i++) {
        rows.push(header.map((key) => data[key as keyof TableData][i]))
      }

      try {
        downloadFile(`magnskraning_kilometrastodu_template`, header, rows, type)
      } catch (error) {
        onError(error)
      }
    },
    [onError],
  )

  const menuItems = useMemo(() => {
    if (!data) {
      return []
    }
    const options = FILE_TYPES.map((type) => ({
      title: `.${type}`,
      onClick: () => downloadExampleFile(type, data),
    }))
    return options
  }, [data, downloadExampleFile])

  return (
    <DropdownMenu
      icon="ellipsisHorizontal"
      menuLabel={formatMessage(vehicleMessage.downloadTemplate)}
      items={menuItems}
      title={formatMessage(vehicleMessage.downloadTemplate)}
      loading={loading}
      disabled={disabled}
    />
  )
}

export default VehicleBulkMileageFileDownloader
