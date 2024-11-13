import { FC, ReactElement } from 'react'
import {
  Box,
  DropdownMenu,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from '../styles.css'
import { m } from '../../../lib/messages'
import copyToClipboard from 'copy-to-clipboard'
import { toast } from 'react-toastify'
import { EndorsementList } from '@island.is/api/schema'
import { useMutation } from '@apollo/client'
import { ExportList } from '../../queries'

interface Props {
  petition?: EndorsementList
  petitionId: string
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
  petitionId,
  dropdownItems = [],
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()

  const [exportPdf, { loading: loadingPdf }] = useMutation(ExportList, {
    variables: {
      input: {
        listId: petitionId,
        fileType: 'pdf',
      },
    },
    onCompleted: (data) => {
      window.open(data.endorsementSystemExportList.url, '_blank')
    },
  })

  const [exportCsv, { loading: loadingCsv }] = useMutation(ExportList, {
    variables: {
      input: {
        listId: petitionId,
        fileType: 'csv',
      },
    },
    onCompleted: (data) => {
      window.open(data.endorsementSystemExportList.url, '_blank')
    },
  })

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
                  key="copyLinkDesktop"
                  className={styles.hideOnDesktop}
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
            render: () =>
              loadingPdf ? (
                <Box marginY={3} display="flex" justifyContent="center">
                  <LoadingDots />
                </Box>
              ) : (
                <Box
                  className={styles.menuItem}
                  cursor="pointer"
                  onClick={() => exportPdf()}
                >
                  {formatMessage(m.asPdf)}
                </Box>
              ),
          },
          {
            title: formatMessage(m.asCsv),
            render: () =>
              loadingCsv ? (
                <Box marginY={3} display="flex" justifyContent="center">
                  <LoadingDots />
                </Box>
              ) : (
                <Box
                  className={styles.menuItem}
                  cursor="pointer"
                  onClick={() => exportCsv()}
                >
                  {formatMessage(m.asCsv)}
                </Box>
              ),
          },
          ...dropdownItems,
        ]}
        title={formatMessage(m.downloadPetitions)}
      />
    </Box>
  )
}

export default DropdownExport
