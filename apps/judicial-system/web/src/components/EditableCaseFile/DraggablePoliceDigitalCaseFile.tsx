import { FC } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { PoliceDigitalCaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

import * as styles from './EditableCaseFile.css'

interface Props {
  file: PoliceDigitalCaseFile
}

const DraggablePoliceDigitalCaseFile: FC<Props> = ({ file }) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const displayDate = formatDate(file.displayDate)

  return (
    <div className={cn(styles.caseFileWrapper, styles.done)}>
      <Box
        data-testid="caseFileDragHandle"
        display="flex"
        paddingX={3}
        paddingY={2}
      >
        <Icon icon="menu" color="blue400" />
      </Box>
      <Box width="full">
        <div
          ref={ref}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text variant="h5">
            <span
              style={{
                display: 'block',
                maxWidth: `${width - (displayDate ? 180 : 90)}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </span>
          </Text>
          {displayDate && <Text variant="small">{displayDate}</Text>}
        </div>
      </Box>
    </div>
  )
}

export default DraggablePoliceDigitalCaseFile
