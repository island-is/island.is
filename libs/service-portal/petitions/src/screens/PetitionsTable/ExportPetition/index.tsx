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
import MyPdfDocumentStatic from './DownloadPdf/static'
import MyPdfDocumentEmpty from './DownloadPdf/empty'
import MyPdfDocumentStripped from './DownloadPdf/stripped'
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

  const [instance] = usePDF({
    document: (
      <MyPdfDocumentStatic
        title={'Test title'}
        description={'Test Description'}
      />
    ),
  })

  const [instance2] = usePDF({
    document: <MyPdfDocumentEmpty />,
  })

  const [instance3] = usePDF({
    document: (
      <MyPdfDocumentStripped
        petition={petition}
        petitionSigners={petitionSigners}
      />
    ),
  })

  if (document.error) {
    console.warn(document.error)
  }

  const getPdfURL = () => {
    console.log('getPdfURL document', document)
    if (!document.blob) {
      return ''
    }
    return URL.createObjectURL(document.blob)
  }

  const getPdfURLInst = (inst: any) => {
    console.log('getPdfURLInst instance', inst)
    if (!inst.url) {
      return ''
    }
    return inst.url
  }

  console.log('render document', document)
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
            onClick: () => window.open(getPdfURL(), '_blank'),
          },
          {
            title: 're render',
            onClick: () => reRender(),
          },
          {
            title: 'MyPdfDocumentStatic',
            onClick: () => window.open(getPdfURLInst(instance), '_blank'),
          },
          {
            title: 'MyPdfDocumentEmpty',
            onClick: () => window.open(getPdfURLInst(instance2), '_blank'),
          },
          {
            title: 'MyPdfDocumentStripped',
            onClick: () => window.open(getPdfURLInst(instance3), '_blank'),
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
