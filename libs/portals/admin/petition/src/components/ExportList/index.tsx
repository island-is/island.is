import { FC, ReactElement } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './styles.css'
import { m } from '../../lib/messages'
import { downloadCSV } from './downloadCSV'
import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import MyPdfDocument from './MyPdfDocument'
import { usePDF } from '@react-pdf/renderer'

interface Props {
  petition: EndorsementList
  petitions: PaginatedEndorsementResponse
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

export const ExportList: FC<Props> = ({
  petition,
  petitions,
  petitionId,
  onGetCSV,
  dropdownItems = [],
}) => {
  const { formatMessage } = useLocale()

  const [document] = usePDF({
    document: <MyPdfDocument petition={petition} petitionSigners={petitions} />,
  })

  if (document.error) {
    console.warn(document.error)
  }

  return (
    <Box className={styles.buttonWrapper}>
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
