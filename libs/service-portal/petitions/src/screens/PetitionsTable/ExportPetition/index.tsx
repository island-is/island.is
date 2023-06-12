import { FC, ReactElement } from 'react'
import { Box, DropdownMenu, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from './styles.css'
import { m } from '../../../lib/messages'
import { downloadCSV } from './downloadCSV'
import copyToClipboard from 'copy-to-clipboard'
import { toast } from 'react-toastify'
import { usePDF } from '@react-pdf/renderer'
import { menuItem } from './styles.css'
import MyPdfDocument from './DownloadPdf'
import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'

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

export const getCSV = async (data: any[], fileName: string) => {
  const name = `${fileName}`
  const dataArray = data.map((item: any) => [
    item.created ?? '',
    item.meta.fullName ?? '',
  ])

  await downloadCSV(name, ['Dagsetning', 'Nafn'], dataArray)
}

const baseUrl = `${document.location.origin}/undirskriftalistar/`

const DropdownExport: FC<Props> = ({
  petition,
  petitionSigners,
  petitionId,
  onGetCSV,
  dropdownItems = [],
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()

  const [document, reRender] = usePDF({
    document: (
      <MyPdfDocument petition={petition} petitionSigners={petitionSigners} />
    ),
  })
  if (document.error) {
    console.warn(document.error)
  }

  const getPdfURL = () => {
    if (!document.blob) {
      return ''
    }
    return URL.createObjectURL(document.blob)
  }

  return (
    <Box className={styles.buttonWrapper} display="flex">
      <Box marginRight={2}>
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
        icon="download"
        iconType="outline"
        menuLabel={formatMessage(m.downloadPetitions)}
        items={[
          {
            title: formatMessage(m.asPdf),
            render: () => (
              <a
                key={petitionId}
                href={document.url ?? ''}
                download={'Undirskriftalisti.pdf'}
                className={menuItem}
              >
                {formatMessage(m.asPdf)}
              </a>
            ),
          },
          {
            title: '2',
            render: () => (
              <a
                key={petitionId}
                href={getPdfURL()}
                download={'Undirskriftalisti.pdf'}
                className={menuItem}
              >
                {formatMessage(m.asPdf)} 2
              </a>
            ),
          },
          {
            title: 'btn',
            render: () => (
              <Button onClick={getPdfURL}>{formatMessage(m.asPdf)} btn</Button>
            ),
          },
          {
            title: 're render',
            render: () => <Button onClick={reRender}>RE-RENDER</Button>,
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
