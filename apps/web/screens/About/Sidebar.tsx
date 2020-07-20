import React, { FC } from 'react'
import cn from 'classnames'
import {
  Box,
  Stack,
  Typography,
  Divider,
  DividerProps,
} from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import useBoundingClientRect from '../../hooks/useBoundingClientRect'
import * as styles from './Sidebar.treat'

type ColorConfig = {
  main: Colors
  secondary: Colors
  divider: DividerProps['weight']
}

const ColorConfig: { [key: string]: ColorConfig } = {
  standard: {
    main: 'blue400',
    secondary: 'dark400',
    divider: 'regular',
  },
  gradient: {
    main: 'white',
    secondary: 'blue100',
    divider: 'purple400',
  },
}

export interface SidebarProps {
  type: keyof typeof ColorConfig
}

const Sidebar: FC<SidebarProps> = ({ type }) => {
  const [ref, rect] = useBoundingClientRect()

  const isFixed = !!rect && rect.top < 0
  const colors = ColorConfig[type]

  return (
    <div ref={ref} className={styles.positionRef}>
      <div
        className={cn(
          styles.container,
          isFixed ? styles.containerFixed : styles.containerAbsolute,
        )}
        style={isFixed ? { left: rect.left } : {}}
      >
        <div
          className={cn(styles.gradient, {
            [styles.gradientVisible]: type === 'gradient',
          })}
        />
        <Box padding={4}>
          <Stack space={2}>
            <Typography variant="h3" as="h3" color={colors.main}>
              Stafrænt Ísland
            </Typography>
            <Divider weight={colors.divider} />
            <Typography variant="p" as="p" color={colors.main}>
              Verkefnið
            </Typography>
            <Stack space={0}>
              <Typography variant="p" as="p" color={colors.main}>
                Vertu með
              </Typography>
              <Typography variant="p" as="p" color={colors.main}>
                Hvað breytist?
              </Typography>
              <Typography variant="p" as="p" color={colors.main}>
                Fagleg nálgun
              </Typography>
              <Typography variant="p" as="p" color={colors.main}>
                Samstarf
              </Typography>
              <Typography variant="p" as="p" color={colors.main}>
                Fréttir og tilkynningar
              </Typography>
            </Stack>
            <Divider weight={colors.divider} />
            <Typography variant="p" as="p" color={colors.secondary}>
              Þjónusta
            </Typography>
            <Divider weight={colors.divider} />
            <Typography variant="p" as="p" color={colors.secondary}>
              Fólkið
            </Typography>
            <Divider weight={colors.divider} />
            <Typography variant="p" as="p" color={colors.secondary}>
              Hafa samband
            </Typography>
          </Stack>
        </Box>
      </div>
    </div>
  )
}

export default Sidebar
