import { FC, ReactElement } from 'react'
import { Box, DropdownMenu, LoadingDots } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './styles.css'
import { m } from '../../lib/messages'
import { useExportListMutation } from './exportList.generated'
interface Props {
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

export const ExportList: FC<React.PropsWithChildren<Props>> = ({
  petitionId,
  dropdownItems = [],
}) => {
  const { formatMessage } = useLocale()

  const [exportListPdf, { loading: loadingPdf }] = useExportListMutation({
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

  const [exportListCsv, { loading: loadingCsv }] = useExportListMutation({
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
    <Box className={styles.buttonWrapper}>
      <DropdownMenu
        icon="ellipsisVertical"
        iconType="outline"
        menuLabel={formatMessage(m.downloadPetitions)}
        items={[
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
                  onClick={() => exportListPdf()}
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
                  onClick={() => exportListCsv()}
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
