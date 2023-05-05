import {
  Box,
  Pagination as PaginationComponent,
} from '@island.is/island-ui/core'
import { CaseFilter } from '../../types/interfaces'

interface Props {
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
  totalPages: number
}

const Pagination = ({ filters, setFilters, totalPages }: Props) => {
  const { pageNumber } = filters

  const goToPage = (pageNumber = 0, scrollTop = true) => {
    const filtersCopy = { ...filters }
    filtersCopy.pageNumber = pageNumber
    setFilters(filtersCopy)
    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  return (
    <Box paddingTop={[5, 5, 5, 8, 8]}>
      <PaginationComponent
        page={pageNumber + 1}
        totalPages={totalPages}
        variant="blue"
        renderLink={(pageNumber, className, children) => (
          <Box
            cursor="pointer"
            className={className}
            onClick={() => goToPage(pageNumber - 1)}
          >
            {children}
          </Box>
        )}
      />
    </Box>
  )
}

export default Pagination
