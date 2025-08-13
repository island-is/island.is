import { FC } from 'react'
import cn from 'classnames'

import { IconMapIcon } from '@island.is/island-ui/core'
import { Box, Icon, StatusColor, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import { IconButton } from '@island.is/judicial-system-web/src/components'

import { fileSize } from '../../utils/utils'
import * as styles from './CaseFile.css'

interface Props {
  name: string
  color: StatusColor
  id: string
  size?: number | null
  icon?: {
    icon: IconMapIcon
    color: Colors
    onClick?: (fileId: string) => void
  }
  onClick?: (fileId: string) => void
}

const CaseFile: FC<Props> = (props) => {
  const { name, size, color, id, icon, onClick } = props
  const hasSize = !!size || size === 0

  return (
    <Box
      className={cn(styles.caseFileWrapper, {
        [styles.brokenFile]: !onClick,
      })}
      background={color?.background}
      borderColor={color?.border}
      borderStyle="solid"
      borderRadius="large"
      borderWidth="standard"
      onClick={onClick ? () => onClick(id) : undefined}
      aria-label={onClick ? `Opna ${name}` : undefined}
    >
      <Box component="p" className={styles.caseFileName}>
        <Text fontWeight="semiBold" as="span">
          {name}
        </Text>
        {hasSize && <Text as="span">{` (${fileSize(size)})`}</Text>}
      </Box>
      {icon &&
        (icon.onClick ? (
          <IconButton
            icon={icon.icon}
            colorScheme={icon.color.includes('blue') ? 'blue' : 'red'}
            onClick={() => icon.onClick?.(id)}
          />
        ) : (
          <Icon icon={icon.icon} color={icon.color} />
        ))}
    </Box>
  )
}

export default CaseFile
