import {
  Box,
  Button,
  Checkbox,
  DropdownMenu,
  Filter,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { vehicleMessage } from '../../lib/messages'
import { LinkButton, m } from '@island.is/service-portal/core'
import VehicleBulkMileageFileUploader from './VehicleBulkMileageFileUploader'
import VehicleBulkMileageFileDownloader from './VehicleBulkMileageFileDownloader'
import { AssetsPaths } from '../../lib/paths'
import { MileageRecord } from '../../utils/parseCsvToMileage'

interface Props {
  onPageSizeClick: (pageSize: number) => void
  currentPageSize: number
  onFileUploadComplete?: (records: Array<MileageRecord>) => void
}

export const VehicleBulkMileageOptionsBar = ({
  onFileUploadComplete,
  onPageSizeClick,
  currentPageSize,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" justifyContent="spaceBetween">
      {/*
      <Inline space={2}>
        <VehicleBulkMileageFileDownloader />
        <VehicleBulkMileageFileUploader
          onUploadFileParseComplete={onFileUploadComplete}
        />
        */}
      <LinkButton
        to={AssetsPaths.AssetsVehiclesBulkMileageUpload}
        text={'Magnskrá kílómetrastöðu'}
        variant="utility"
      />
      {/*
        <LinkButton
          to={AssetsPaths.AssetsVehiclesBulkMileageJobOverview}
          text={'Yfirlit magnskráningarunuverka'}
          variant="utility"
        />
        */
      /*
        <Filter
          labelClear={formatMessage(m.clearFilter)}
          labelClearAll={formatMessage(m.clearAllFilters)}
          labelOpen={formatMessage(m.openFilter)}
          labelClose={formatMessage(m.closeFilter)}
          variant="popover"
          onFilterClear={() => {
            console.log(`
            setFilterValue(defaultFilterValues)
            setPage(1)
            `)
          }}
          align="left"
          reverse
        >
          <Box padding={4}>
            <Text variant="eyebrow" as="p" paddingBottom={2}>
              {formatMessage(m.filterBy)}
            </Text>
            <Checkbox
              name="onlyMileageRequiredVehicles"
              label={'Label'}
              value="onlyMileageRequiredVehicles"
              checked={false}
              onChange={(e) => {
                console.log(`
                setPage(1)
                setSearchLoading(true)
                setFilterValue({
                  ...filterValue,
                  onlyMileageRequiredVehicles: e.target.checked,
                })
                `)
              }}
            />
          </Box>
        </Filter>
      </Inline>
      <Box display="flex" alignItems="center">
        <Box marginLeft="auto" marginRight="p1">
          <Text fontWeight="semiBold" textAlign="center" variant="small">
            {formatMessage(vehicleMessage.entriesPerPage)}
          </Text>
        </Box>

        <DropdownMenu
          disclosure={
            <Button variant="utility" icon="chevronDown" nowrap>
              {currentPageSize}
            </Button>
          }
          items={
            [10, 20, 30, 40].map((p) => ({
              title: p.toString(),
              onClick: () => onPageSizeClick(p),
            })) ?? []
          }
        />
      </Box>
      */}
    </Box>
  )
}
