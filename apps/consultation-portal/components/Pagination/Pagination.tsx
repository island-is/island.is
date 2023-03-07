import { Case } from '../../types/interfaces'
import {
  Box,
  Pagination as PaginationComponent,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import * as styles from './Pagination.css'

interface PaginationProps {
  data: Array<Case>
  sendData: (argo0: Array<Case>, argo1: number) => void
}

const CARDS_PER_PAGE = 12

const Pagination = ({ data, sendData }: PaginationProps) => {
  const [page, setPage] = useState<number>(1)

  const count = data.length
  const totalPages = Math.ceil(count / CARDS_PER_PAGE)
  const base = page === 1 ? 0 : (page - 1) * CARDS_PER_PAGE
  const visibleItems = data.slice(base, page * CARDS_PER_PAGE)

  const goToPage = (page = 1, scrollTop = true) => {
    setPage(page)
    sendData(visibleItems, totalPages)
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
            <span className={styles.spanStyle}>Síða</span>
            <span className={className}>{children}</span>
          </button>
        )}
      />
    </Box>
  )
}

export default Pagination
