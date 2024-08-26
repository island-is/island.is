import {
  Box,
  FocusableBox,
  Button,
  Checkbox,
  Filter,
  Text,
  Stack,
  Pagination,
  Inline,
  DropdownMenu,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  m,
  SAMGONGUSTOFA_SLUG,
  IntroHeader,
} from '@island.is/service-portal/core'
import { dummy } from './mocks/propsDummy'
import { vehicleMessage as messages } from '../../lib/messages'
import * as styles from './VehicleBulkMileage.css'
import { useEffect, useRef, useState } from 'react'
import VehicleBulkMileageTable from './VehicleBulkMileageTable'
import { useVehicleBulkMileageContext } from './VehicleBulkMileageContext'
import { isDefined } from '@island.is/shared/utils'
import { isNullOrUndefined } from 'util'

const VehicleMileage = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const { setVehicles, vehicles } = useVehicleBulkMileageContext()
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const newVehicles = dummy.filter(
      (du) => !vehicles.find((v) => v.vehicleId === du.vehicleId),
    )
    if (newVehicles.length) {
      setVehicles([...vehicles, ...newVehicles])
    }
  }, [pageSize, page])

  const handleBulkSubmit = () => {
    setVehicles(
      vehicles.map((v, index) => {
        if (index === 0) {
          return {
            ...v,
            submissionStatus: 'submit-all',
          }
        } else return v
      }),
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const reader = file.stream().getReader()

    let parsedLines: Array<string> = []
    const parseChunk = (res: ReadableStreamReadResult<Uint8Array>) => {
      if (res.done) {
        return
      }

      const chunk = Buffer.from(res.value).toString('utf8')
      const lines = chunk
        .split(new RegExp(',|\\r|\\n|\\r\\n|;'))
        .filter((str) => str !== '')

      parsedLines = parsedLines.concat(lines)
    }
    await reader.read().then(parseChunk)

    const uploadedOdometerStatuses: Array<{
      vehicleId: string
      mileage: number
    }> = []

    const isMileageEvenOrOdd =
      parsedLines[0] === 'ökutæki' || parsedLines[0] === 'Ökutæki'
        ? 'odd'
        : 'even'

    for (let i = 2; i < parsedLines.length; i = i + 2) {
      const vehicleId =
        isMileageEvenOrOdd === 'even' ? parsedLines[i + 1] : parsedLines[i]

      uploadedOdometerStatuses.push({
        vehicleId,
        mileage: parseInt(
          isMileageEvenOrOdd === 'even' ? parsedLines[i] : parsedLines[i + 1],
        ),
      })
    }

    const newVehicles = vehicles.map((v) => {
      const matchedVehicle = uploadedOdometerStatuses.find(
        (m) => m.vehicleId === v.vehicleId,
      )
      if (matchedVehicle) {
        return {
          ...v,
          mileageUploadedFromFile: matchedVehicle.mileage,
        }
      }

      return v
    })
    setVehicles(newVehicles)
  }

  const updateMileageFromFile = (mileage: Array<string>) => {}

  const handleFileUploadButtonClick = () => {
    console.log('click file upload')
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <Stack space={2}>
      <IntroHeader
        title={m.vehiclesBulkMileage}
        introComponent={formatMessage(messages.vehicleMileageIntro, {
          href: (str: React.ReactNode) => (
            <span>
              <a
                href={formatMessage(messages.mileageExtLink)}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                {str}
              </a>
            </span>
          ),
        })}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      />
      <Box display="flex" justifyContent="spaceBetween">
        <Inline space={2}>
          <Button
            colorScheme="default"
            icon="download"
            iconType="outline"
            size="default"
            variant="utility"
            onClick={() => alert('download excel')}
          >
            {formatMessage(messages.downloadExcel)}
          </Button>
          <form>
            <Button
              colorScheme="default"
              icon="arrowUp"
              iconType="outline"
              size="default"
              variant="utility"
              onClick={() => handleFileUploadButtonClick()}
            >
              {formatMessage(messages.uploadExcel)}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </form>
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
              {formatMessage(messages.entriesPerPage)}
            </Text>
          </Box>

          <DropdownMenu
            disclosure={
              <Button variant="utility" icon="chevronDown" nowrap>
                {pageSize}
              </Button>
            }
            items={[
              {
                title: '10',
                onClick: () => setPageSize(10),
              },
              {
                title: '20',
                onClick: () => setPageSize(20),
              },
              {
                title: '30',
                onClick: () => setPageSize(30),
              },
              {
                title: '40',
                onClick: () => setPageSize(40),
              },
            ]}
          />
        </Box>
      </Box>
      <VehicleBulkMileageTable />
      <FocusableBox marginTop={2} display="flex">
        <Box marginLeft="auto">
          <Button onClick={() => handleBulkSubmit()}>
            {formatMessage(messages.saveAllVisible)}
          </Button>
        </Box>
      </FocusableBox>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          renderLink={(page, className, children) => (
            <button
              onClick={() => {
                setPage(page)
              }}
            >
              <span className={className}>{children}</span>
            </button>
          )}
        />
      )}
    </Stack>
  )
}

export default VehicleMileage
