import { ReactElement } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'

interface Props {
  onGetCSV: () => void
  onGetExcel: () => void
  label?: string
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
const DropdownExport = ({
  onGetCSV,
  onGetExcel,
  label,
  dropdownItems = [],
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <DropdownMenu
        icon="ellipsisHorizontal"
        menuLabel={formatMessage(m.moreOptions)}
        items={[
          {
            onClick: () => onGetCSV(),
            title: formatMessage(m.getAsCsv),
          },
          {
            onClick: () => onGetExcel(),
            title: formatMessage(m.getAsExcel),
          },
          ...dropdownItems,
        ]}
        title={label ?? formatMessage(m.more)}
      />
    </Box>
  )
}

export default DropdownExport
