import { Icon, Box, BoxProps } from '@island.is/island-ui/core'

export type DocumentActionBarProps = {
  onArchiveClick?: () => void
  onFavoriteClick?: () => void
  onPrintClick?: () => void
  onGoBack?: () => void
  spacing?: BoxProps['columnGap']
}
export const DocumentActionBar: React.FC<DocumentActionBarProps> = ({
  onGoBack,
  onFavoriteClick,
  onPrintClick,
  onArchiveClick,
  spacing = 1,
}) => {
  return (
    <>
      {onGoBack && (
        <Box>
          <button onClick={onGoBack}>
            <Icon color="blue400" icon="arrowBack" />
          </button>
        </Box>
      )}
      {(onPrintClick || onArchiveClick || onFavoriteClick) && (
        <Box display="flex" columnGap={spacing}>
          {onArchiveClick && (
            <button onClick={onArchiveClick}>
              <Icon color="blue400" icon="archive" type="outline" />
            </button>
          )}
          {onFavoriteClick && (
            <button onClick={onFavoriteClick}>
              <Icon color="blue400" icon="star" type="outline" />
            </button>
          )}
          {onPrintClick && (
            <button onClick={onPrintClick}>
              <Icon color="blue400" icon="print" type="outline" />
            </button>
          )}
        </Box>
      )}
    </>
  )
}
