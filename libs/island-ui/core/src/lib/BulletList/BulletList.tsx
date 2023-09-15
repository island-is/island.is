import React, { FC, createContext, useContext, ReactNode } from 'react'
import { Colors, theme } from '@island.is/island-ui/theme'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Stack, StackProps } from '../Stack/Stack'

import * as styles from './BulletList.css'

interface BulletListContextValue {
  type: string
  color: Colors
}

const BulletListContext = createContext<BulletListContextValue>({
  type: 'ul',
  color: 'red400',
})

export const Bullet: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const { type, color } = useContext(BulletListContext)

  return (
    <Text as="span">
      <Box display="flex">
        <Box display="flex">
          <span
            className={cn(styles.bullet, {
              [styles.numberColors[color!]]: color,
              [styles.numbered]: type === 'ol',
            })}
          >
            {type === 'ul' && (
              <span
                className={cn(styles.icon, {
                  [styles.bulletColors[color!]]: color,
                })}
              />
            )}
          </span>
        </Box>
        <Box className={styles.content}>{children}</Box>
      </Box>
    </Text>
  )
}

interface BulletListProps {
  children: ReactNode
  space?: StackProps['space']
  type?: 'ul' | 'ol'
  color?: Colors
}

export const BulletList: FC<React.PropsWithChildren<BulletListProps>> = ({
  children,
  space = 1,
  type = 'ul',
  color = 'red400',
}) => {
  return (
    <div className={styles.container}>
      <BulletListContext.Provider value={{ type, color }}>
        <Stack component={type} space={space}>
          {children}
        </Stack>
      </BulletListContext.Provider>
    </div>
  )
}
