import React, { FC, createContext, useContext, ReactNode } from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Stack, StackProps } from '../Stack/Stack'
import { Icon } from '../Icon/Icon'

import * as styles from './BulletList.css'

interface BulletListContextValue {
  type: string
}

const BulletListContext = createContext<BulletListContextValue>({
  type: 'ul',
})

export const Bullet: FC<{}> = ({ children }) => {
  const { type } = useContext(BulletListContext)

  return (
    <Text as="span">
      <Box display="flex">
        <Box display="flex">
          <span
            className={cn(styles.bullet, {
              [styles.numbered]: type === 'ol',
            })}
          >
            {type === 'ul' && (
              <span className={styles.icon}>
                <Icon type="bullet" color="red400" width="8" height="8" />
              </span>
            )}
          </span>
        </Box>
        <Box>{children}</Box>
      </Box>
    </Text>
  )
}

interface BulletListProps {
  children: ReactNode
  space?: StackProps['space']
  type?: 'ul' | 'ol'
}

export const BulletList: FC<BulletListProps> = ({
  children,
  space = 1,
  type = 'ul',
}) => {
  return (
    <div className={styles.container}>
      <BulletListContext.Provider value={{ type }}>
        <Stack component={type} space={space}>
          {children}
        </Stack>
      </BulletListContext.Provider>
    </div>
  )
}
