import { FC, ReactElement } from 'react'
import { Box, DropdownMenu, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from '../styles.css'
import { m } from '../../../lib/messages'
import copyToClipboard from 'copy-to-clipboard'
import { toast } from 'react-toastify'
import { usePDF } from '@react-pdf/renderer'
import MyPdfDocument from './DownloadPdf'
import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import cn from 'classnames'

interface Props {
  petition?: EndorsementList
  petitionSigners: PaginatedEndorsementResponse
  petitionId: string
  onGetCSV: () => void
  dropdownItems?: {
    href?: string
    onClick?: () => void
    title: string
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
}

const baseUrl = `${document.location.origin}/undirskriftalistar/`

const DropdownExport: FC<React.PropsWithChildren<Props>> = ({
  petition,
  petitionSigners,
  petitionId,
  onGetCSV,
  dropdownItems = [],
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()

  const [document] = usePDF({
    document: (
      <MyPdfDocument petition={petition} petitionSigners={petitionSigners} />
    ),
  })
  if (document.error) {
    console.warn(document.error)
  }

  return (
    <Box display="flex">
      <Box marginRight={2} className={styles.hideInMobile}>
        <Button
          onClick={() => {
            const copied = copyToClipboard(baseUrl + petitionId)
            if (!copied) {
              return toast.error(formatMessage(m.copyLinkError.defaultMessage))
            }
            toast.success(formatMessage(m.copyLinkSuccess.defaultMessage))
          }}
          variant="utility"
          icon="link"
        >
          {formatMessage(m.copyLinkToList)}
        </Button>
      </Box>
      <DropdownMenu
        icon="ellipsisVertical"
        iconType="outline"
        menuLabel={formatMessage(m.downloadPetitions)}
        items={[
          {
            title: formatMessage(m.downloadPetitions),
            render: () => {
              return (
                <button
                  className={cn(styles.hideOnDesktop, styles.menuItem)}
                  onClick={() => {
                    const copied = copyToClipboard(baseUrl + petitionId)
                    if (!copied) {
                      return toast.error(
                        formatMessage(m.copyLinkError.defaultMessage),
                      )
                    }
                    toast.success(
                      formatMessage(m.copyLinkSuccess.defaultMessage),
                    )
                  }}
                >
                  {formatMessage(m.linkToList)}
                </button>
              )
            },
          },
          {
            title: formatMessage(m.asPdf),
            render: () => (
              <a
                key={petitionId}
                href={document.url ?? ''}
                download={'Undirskriftalisti.pdf'}
                className={styles.menuItem}
              >
                {formatMessage(m.asPdf)}
              </a>
            ),
          },
          {
            onClick: () => onGetCSV(),
            title: formatMessage(m.asCsv),
          },
          ...dropdownItems,
        ]}
        title={formatMessage(m.downloadPetitions)}
      />
    </Box>
  )
}

export default DropdownExport
