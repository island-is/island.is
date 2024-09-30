import { useLocale } from '@island.is/localization'
import { Box, Filter, FilterMultiChoice } from '@island.is/island-ui/core'
import { SignatureCollectionSignature as Signature } from '@island.is/api/schema'
import { m } from '../../../lib/messages'
import { useEffect, useState } from 'react'
import { FiltersSigneeType, signeeTypes } from '../../../lib/utils'

const FilterSignees = ({
  signees,
  filters,
  onSetFilters,
}: {
  signees: Signature[]
  filters: FiltersSigneeType
  onSetFilters: (filters: FiltersSigneeType) => void
}) => {
  const { formatMessage } = useLocale()

  // page numbers for filtering
  const [pageNumbers, setPageNumbers] = useState<
    Array<{
      label: string
      value: string
    }>
  >([])

  useEffect(() => {
    // set pageNumbers on initial load of lists
    if (signees.length > 0) {
      const pages = signees
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((s) => {
          return {
            label: String(s.pageNumber),
            value: String(s.pageNumber),
          }
        })

      setPageNumbers(pages)
    }
  }, [])

  return (
    <Box>
      <Filter
        labelClear=""
        labelClose=""
        labelResult=""
        labelOpen={formatMessage(m.filter)}
        labelClearAll={formatMessage(m.clearAllFilters)}
        resultCount={signees.length}
        variant="popover"
        onFilterClear={() => {
          onSetFilters({
            signeeType: [],
            pageNumber: [],
          })
        }}
      >
        <FilterMultiChoice
          labelClear={formatMessage(m.clearFilter)}
          categories={[
            {
              id: 'signeeType',
              label: formatMessage(m.typeOfSignee),
              selected: filters.signeeType,
              filters: signeeTypes,
            },
            {
              id: 'pageNumber',
              label: formatMessage(m.paperNumber),
              selected: filters.pageNumber,
              filters: pageNumbers,
            },
          ]}
          onChange={(event) =>
            onSetFilters({
              ...filters,
              [event.categoryId]: event.selected,
            })
          }
          onClear={(categoryId) =>
            onSetFilters({
              ...filters,
              [categoryId]: [],
            })
          }
        />
      </Filter>
    </Box>
  )
}

export default FilterSignees
