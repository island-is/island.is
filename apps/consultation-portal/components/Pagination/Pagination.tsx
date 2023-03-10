import {
  Box,
  Pagination as PaginationComponent,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import * as styles from './Pagination.css'

interface PaginationProps {
  updatePage: (argo0: number) => void
  totalPages: number
}

const Pagination = ({ updatePage, totalPages }: PaginationProps) => {
  const [page, setPage] = useState<number>(1)

  const goToPage = (page = 1, scrollTop = true) => {
    setPage(page)
    updatePage(page)

    if (scrollTop) {
      window.scrollTo(0, 0)
    }
  }

  return (
    <Box paddingTop={[5, 5, 5, 8, 8]}>
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        variant="blue"
        renderLink={(page, className, children) => (
          <button
            onClick={() => {
              goToPage(page)
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
