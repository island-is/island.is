import { FC } from 'react'
import { theme } from '@island.is/island-ui/theme'
import { DocumentCategory } from '@island.is/api/schema'
import { ActiveDocumentType } from '../../lib/types'
import useWindowSize from 'react-use/lib/useWindowSize'
import DesktopOverview from './DesktopOverview'
import MobileOverview from './MobileOverview'
import NoPDF from '../NoPDF/NoPDF'

export interface Props {
  activeDocument: ActiveDocumentType | null
  onPressBack: () => void
  onRefetch: () => void
  activeArchive: boolean
  activeBookmark: boolean
  loading?: boolean
  error?: {
    message?: string
    code: 'list' | 'single'
  }
  category?: DocumentCategory
}

export const DocumentDisplay: FC<Props> = (props) => {
  const { width } = useWindowSize()

  const isDesktop = width > theme.breakpoints.lg

  if (props.error?.message) {
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
