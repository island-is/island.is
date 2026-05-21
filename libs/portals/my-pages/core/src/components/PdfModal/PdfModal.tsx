import { Dialog, DialogDismiss, useDialogStore } from '@ariakit/react'
import {
  Box,
  Button,
  FocusableBox,
  Icon,
  PdfViewer,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useIsMobile } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { CardLoader } from '../CardLoader/CardLoader'
import { m } from '../../lib/messages'
import { formSubmit } from '../../utils/documentFormSubmission'
import { usePdfBlob } from '../../hooks/usePdfBlob'
import * as styles from './PdfModal.css'

interface PdfModalProps {
  url: string | null | undefined
  'aria-label': string
  onClose: () => void
  title?: string
  id?: string
}

export const PdfModal = ({
  url,
  'aria-label': ariaLabel,
  onClose,
  title,
  id = 'pdf-modal',
}: PdfModalProps) => {
  const { data, loading, error } = usePdfBlob(url)
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const [scale, setScale] = useState(1.0)

  const store = useDialogStore({
    open: !!url,
    setOpen: (open) => {
      if (!open) onClose()
    },
  })

  const handlePrint = () => {
    if (!data) return
    const w = window.open(data)
    if (w) w.addEventListener('load', () => w.print())
  }

  return (
    <Dialog
      store={store}
      id={id}
      aria-label={ariaLabel}
      backdrop={<div className={styles.backdrop} />}
      className={styles.dialog}
      unmountOnHide
    >
      {/* Toolbar */}
      <Box
        className={styles.toolbar}
        paddingX={2}
        paddingY={1}
        borderBottomWidth="standard"
        borderColor="blue200"
      >
        {/* Left: icon + title */}
        <Box display="flex" alignItems="center" minWidth={0}>
          <Icon icon="document" type="outline" size="small" color="blue400" />
          {title && (
            <Text variant="small" fontWeight="semiBold" truncate>
              {title}
            </Text>
          )}
        </Box>

        {/* Center: zoom controls */}
        <Box
          padding={1}
          background="backgroundBrandMinimal"
          borderRadius="large"
          display="flex"
          columnGap={1}
          alignItems="center"
        >
          <FocusableBox
            component="button"
            type="button"
            className={styles.zoomButton}
            disabled={scale <= 0.6}
            aria-label={formatMessage(m.zoomOut)}
            onClick={() =>
              setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(1)))
            }
          >
            <Icon icon="remove" type="outline" size="small" color="blue400" />
          </FocusableBox>
          <Text fontWeight="semiBold" variant="small">
            {Math.round(scale * 100)}%
          </Text>
          <FocusableBox
            component="button"
            type="button"
            className={styles.zoomButton}
            disabled={scale >= 3.5}
            aria-label={formatMessage(m.zoomIn)}
            onClick={() =>
              setScale((s) => Math.min(3.5, +(s + 0.1).toFixed(1)))
            }
          >
            <Icon icon="add" type="outline" size="small" color="blue400" />
          </FocusableBox>
        </Box>

        {/* Right: print, download, close */}
        <Box
          columnGap={2}
          display="flex"
          alignItems="center"
          justifyContent="flexEnd"
        >
          <Button
            icon="print"
            iconType="filled"
            variant="utility"
            size="small"
            disabled={!data}
            onClick={handlePrint}
          >
            {isMobile ? undefined : formatMessage(m.print)}
          </Button>
          <Button
            disabled={!url}
            icon="share"
            iconType="outline"
            variant="utility"
            size="small"
            onClick={() => url && formSubmit(url)}
          >
            {isMobile ? undefined : formatMessage(m.download)}
          </Button>
          <DialogDismiss
            render={
              <FocusableBox
                component="button"
                type="button"
                className={styles.zoomButton}
                aria-label={formatMessage(m.closeActiveDocument)}
              >
                <Icon
                  icon="close"
                  type="outline"
                  size="small"
                  color="blue400"
                />
              </FocusableBox>
            }
          />
        </Box>
      </Box>

      {/* Content */}
      <Box className={styles.pdfContent} background="blue100">
        {loading && (
          <Box padding={4}>
            <CardLoader />
          </Box>
        )}
        {error && (
          <Box padding={4}>
            <Problem type="no_data" noBorder={false} />
          </Box>
        )}
        {data && (
          <PdfViewer file={data} showAllPages scale={scale} autoWidth={false} />
        )}
      </Box>
    </Dialog>
  )
}
