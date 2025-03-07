import { FC } from 'react'
import { toast } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { DocumentsV2Category } from '@island.is/api/schema'
import useWindowSize from 'react-use/lib/useWindowSize'
import DesktopOverview from './DesktopOverview'
import MobileOverview from './MobileOverview'
import NoPDF from '../NoPDF/NoPDF'

export interface Props {
  onPressBack: () => void
  activeBookmark: boolean
  loading?: boolean
  error?: {
    message?: string
    code: 'list' | 'single'
  }
  category?: DocumentsV2Category
}

export const DocumentDisplay: FC<Props> = (props) => {
  const { width } = useWindowSize()

  const isDesktop = width > theme.breakpoints.lg

  if (props.error?.message) {
    if (!isDesktop) {
      toast.error(props.error?.message, { toastId: 'single-doc-error' })
    }
    if (props.error?.code === 'single' && !isDesktop) {
      return null
    }
    return <NoPDF text={props.error?.message} error />
  }

  if (isDesktop) {
    const { onPressBack, ...deskProps } = props
    return <DesktopOverview {...deskProps} />
  }

  return <MobileOverview {...props} />
}

export default DocumentDisplay
