import React, { FC, createContext, useContext, ReactNode } from 'react'
import cn from 'classnames'
import { Box, Typography, Stack, StackProps, Icon } from '../..'

import * as styles from './BulletList.treat'

interface BulletListContextValue {
  type: string
}

const BulletListContext = createContext<BulletListContextValue>({
  type: 'ul',
})

export const Bullet: FC = ({ children }) => {
  const { type } = useContext(BulletListContext)

  return (
    <Typography variant="p" as="span">
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
    </Typography>
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

export default BulletList
