import { FC } from 'react'
import { Pagination } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'

export const TABLE_PAGE_SIZE = 50

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Shared by the employee tables (Launagögn, Mat á einstaklingsbundnum þáttum)
// and the unassigned-outliers table on the analysis screen — page size is the
// caller's business, this only renders the control. Renders nothing below the
// fold when everything already fits on one page.
export const TablePagination: FC<Props> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const { formatMessage } = useLocale()

  if (totalPages <= 1) return null

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      renderLink={(linkPage, className, children) => (
        // A real button, not a clickable Box: the control has to be reachable
        // by keyboard, and type="button" keeps it from submitting the
        // surrounding application form. The prev/next controls render only an
        // icon, so they need the label too.
        <button
          type="button"
          className={className}
          onClick={() => onPageChange(linkPage)}
          aria-label={formatMessage(
            messages.report.employees.paginationPageLabel,
            { page: linkPage },
          )}
          aria-current={linkPage === page ? 'page' : undefined}
        >
          {children}
        </button>
      )}
    />
  )
}
