import React, { FC, ReactElement, Children } from 'react'
import { Box, Typography, Stack, StackProps, Icon } from '../..'
import { theme } from '../../theme/theme'

import * as styles from './BulletList.treat'

interface BulletProps {
  index?: number
  type: string
}

export const Bullet: FC<BulletProps> = ({ index, type, children }) => {
  return (
    <Typography variant="p" as="span">
      <Box display="flex">
        <Box display="flex">
          <span className={styles.bullet}>
            {type === 'ol' ? (
              index + 1
            ) : (
              <span className={styles.icon}>
                <Icon
                  type="bullet"
                  color={theme.color.red400}
                  width="8"
                  height="8"
                />
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
  children: ReactElement<HTMLLIElement>[]
  space?: StackProps['space']
  type?: 'ul' | 'ol'
}

export const BulletList: FC<BulletListProps> = ({
  children,
  space = 1,
  type = 'ul',
}) => {
  const items = Children.toArray(children).filter((c) => {
    if (process.env.NODE_ENV !== 'production' && c.type !== 'li') {
      throw new Error('BulletList may only contain <li> elements.')
    }

    return c.type === 'li'
  })

  return (
    <Stack component={type} space={space}>
      {items.map(({ props }, index) => (
        <Bullet key={index} index={index} type={type} {...props} />
      ))}
    </Stack>
  )
}

export default BulletList
