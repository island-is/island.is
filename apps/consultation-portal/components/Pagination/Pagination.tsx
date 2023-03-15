import {
  Box,
  Pagination as PaginationComponent,
} from '@island.is/island-ui/core'
import * as styles from './Pagination.css'

interface PaginationProps {
  page: number
  setPage: (argo0: number) => void
  totalPages: number
}

const Pagination = ({ page, setPage, totalPages }: PaginationProps) => {
  const goToPage = (page = 0, scrollTop = true) => {
    setPage(page)
    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  return (
    <Box paddingTop={[5, 5, 5, 8, 8]}>
      <PaginationComponent
        page={page + 1}
        totalPages={totalPages}
        variant="blue"
        renderLink={(page, className, children) => (
          <button
            onClick={() => {
              goToPage(page - 1)
            }}
          >
            <div className={styles.spanStyle}>Síða</div>
            <div className={className}>{children}</div>
          </button>
        )}
      />
    </Box>
  )
}

export default Pagination
