import { Button, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { vehicleMessage } from '../../lib/messages'
import { downloadFile } from '@island.is/portals/my-pages/core'
import { useVehiclesListQuery } from './VehicleBulkMileage.generated'
import { useMemo } from 'react'

interface TableData {
  bilnumber: unknown[]
  'seinasta skraning': unknown[]
  'seinasta skrada stada': unknown[]
  kilometrastada: unknown[]
}

interface Props {
  onError: (error: string) => void
}

const VehicleBulkMileageFileDownloader = ({ onError }: Props) => {
  const { formatMessage } = useLocale()

  const { data, error, loading } = useVehiclesListQuery({
    variables: {
      input: {
        page: 1,
        pageSize: 1000,
        filterOnlyRequiredMileageRegistration: true,
      },
    },
  })

  const table = useMemo(() => {
    if (data?.vehiclesListV3?.data) {
      const table: TableData = {
        bilnumber: [],
        'seinasta skraning': [],
        'seinasta skrada stada': [],
        kilometrastada: [],
      }

      data.vehiclesListV3.data.forEach((vehicle) => {
        table['bilnumber'].push(vehicle.vehicleId)
        table['seinasta skraning'].push(
          vehicle.mileageDetails?.lastMileageRegistration?.date,
        )
        table['seinasta skrada stada'].push(
          vehicle.mileageDetails?.lastMileageRegistration?.mileage ?? 0,
        )
      })
      return table
    }
  }, [data])

  const downloadExampleFile = async (type: 'csv' | 'xlsx', data: TableData) => {
    const header = Object.keys(data)
    const rows = Object.values(data)
    try {
      downloadFile(`magnskraning_kilometrastodu_example`, header, rows, type)
    } catch (error) {
      onError(error)
    }
  }

  if (loading) {
    return <Button loading />
  }

  if (!table) {
    return
  }

  return (
    <DropdownMenu
      icon="ellipsisHorizontal"
      menuLabel={formatMessage(vehicleMessage.downloadTemplate)}
      items={(['csv', 'xlsx'] as const).map((type) => ({
        title: `.${type}`,
        onClick: () => downloadExampleFile(type, table),
      }))}
      title={formatMessage(vehicleMessage.downloadTemplate)}
    />
  )
}

export default VehicleBulkMileageFileDownloader
