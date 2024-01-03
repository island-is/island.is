import React from 'react'
import cn from 'classnames'

import { IconMapIcon } from '@island.is/island-ui/core'
import { Box, Icon, StatusColor, Text } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

import { fileSize } from '../../utils/stepHelper'
import IconButton from '../IconButton/IconButton'
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

const CaseFile: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { name, size, color, id, icon, onClick } = props

  console.log(icon)
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
    >
      <Box>
        <Text fontWeight="semiBold" as="span">
          {name}
        </Text>
        {size && <Text as="span">{` (${fileSize(size)})`}</Text>}
      </Box>
      {icon &&
        (icon.onClick ? (
          <IconButton
            icon={icon.icon}
            color={icon.color}
            onClick={() => icon.onClick?.(id)}
          />
        ) : (
          <Icon icon={icon.icon} color={icon.color} />
        ))}
    </Box>
  )
}

export default CaseFile
