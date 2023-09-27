import {
  Icon,
  Box,
  BoxProps,
  LoadingDots,
  Button,
} from '@island.is/island-ui/core'
import { useSubmitMailAction } from '../../utils/useSubmitMailAction'
import * as styles from './DocumentActionBar.css'

export type DocumentActionBarProps = {
  onPrintClick?: () => void
  onGoBack?: () => void
  spacing?: BoxProps['columnGap']
  documentId: string
  archived?: boolean
  bookmarked?: boolean
}
export const DocumentActionBar: React.FC<DocumentActionBarProps> = ({
  onGoBack,
  onPrintClick,
  spacing = 1,
  documentId,
  bookmarked,
  archived,
}) => {
  const {
    submitMailAction,
    archiveSuccess,
    bookmarkSuccess,
    loading,
    dataSuccess,
  } = useSubmitMailAction({ messageId: documentId })

  const isBookmarked =
    (bookmarked && !dataSuccess.unbookmark) || bookmarkSuccess
  const isArchived = (archived && !dataSuccess.unarchive) || archiveSuccess

  return (
    <>
      {onGoBack && (
        <Box>
          <button onClick={onGoBack}>
            <Icon color="blue400" icon="arrowBack" />
          </button>
        </Box>
      )}
      <Box className={styles.filterBtns} display="flex" columnGap={spacing}>
        {!loading && (
          <>
            <Button
              circle
              icon="archive"
              iconType={isArchived ? 'filled' : 'outline'}
              onClick={() =>
                submitMailAction(isArchived ? 'unarchive' : 'archive')
              }
              size="medium"
              title="Geymsla"
              colorScheme="light"
            />

            <Button
              circle
              icon="star"
              iconType={isBookmarked ? 'filled' : 'outline'}
              onClick={() =>
                submitMailAction(isBookmarked ? 'unbookmark' : 'bookmark')
              }
              size="medium"
              title="Stjörnumerkja"
              colorScheme="light"
            />
          </>
        )}
        {loading && (
          <Box display="flex" alignItems="center">
            <LoadingDots />
          </Box>
        )}
        {onPrintClick && (
          <Button
            circle
            icon="print"
            iconType={'outline'}
            onClick={onPrintClick}
            size="medium"
            title="Prenta"
            colorScheme="light"
          />
        )}
      </Box>
    </>
  )
}
