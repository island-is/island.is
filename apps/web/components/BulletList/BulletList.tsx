import React, { FC, useState, ReactNode } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import IconBullet from '../IconBullet/IconBullet'
import { Stack, Box, Typography, Button, Icon } from '@island.is/island-ui/core'
import * as styles from './BulletList.treat'

type IconBullet = {
  type: 'IconBullet'
  title: string
  body: string
  icon: string
  url?: string
  linkText?: string
}

type NumberBullet = {
  title: string
  body: string
}

type NumberBulletGroup = {
  type: 'NumberBulletGroup'
  defaultVisible: number
  bullets: NumberBullet[]
}

type Entry = IconBullet | NumberBulletGroup

export interface BulletListProps {
  bullets: Entry[]
}

export const BulletList: FC<BulletListProps> = ({ bullets }) => (
  <div>
    {bullets.map((bullet, index) => {
      return bullet.type === 'IconBullet' ? (
        <Row
          key={index}
          left={<IconBullet variant="blue" size="large" image={bullet.icon} />}
        >
          <Stack space={1}>
            <Typography variant="h3" as="h3">
              {bullet.title}
            </Typography>
            <Typography variant="p" as="p">
              {bullet.body}
            </Typography>
            {bullet.url && bullet.linkText && (
              <Button variant="text" href={bullet.url} leftIcon="arrowRight">
                {bullet.linkText}
              </Button>
            )}
          </Stack>
        </Row>
      ) : (
        <NumberSection key={index} group={bullet} />
      )
    })}
  </div>
)

const Row: FC<{ left: ReactNode }> = ({ left, children }) => (
  <Box alignItems="stretch" display="flex" paddingY={2}>
    <Box display="flex" justifyContent="center" className={styles.leftCol}>
      {left}
    </Box>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      paddingLeft={3}
    >
      {children}
    </Box>
  </Box>
)

const NumberSection: FC<{ group: NumberBulletGroup }> = ({ group }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => setExpanded(!expanded)

  const rendered = group.bullets.map((bullet, index) => (
    <Row
      key={index}
      left={
        <IconBullet variant="red" size="small">
          {index + 1}
        </IconBullet>
      }
    >
      <Stack space={1}>
        <Typography variant="h4" as="h4">
          {bullet.title}
        </Typography>
        <Typography variant="p" as="p">
          {bullet.body}
        </Typography>
      </Stack>
    </Row>
  ))

  return (
    <div>
      {rendered.slice(0, group.defaultVisible)}
      {group.bullets.length > group.defaultVisible && (
        <>
          <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
            {rendered.slice(group.defaultVisible)}
          </AnimateHeight>
          <Row
            left={
              <div
                className={cn(styles.expandButton, {
                  [styles.tilted]: expanded,
                })}
              >
                <IconBullet variant="blue" size="small" onClick={toggleExpand}>
                  <Icon type="plus" width="20" height="20" />
                </IconBullet>
              </div>
            }
          >
            <Box cursor="pointer" onClick={toggleExpand}>
              <Typography variant="h4" as="h4" color="blue400">
                Sjá {expanded ? 'minna' : 'meira'}
              </Typography>
            </Box>
          </Row>
        </>
      )}
    </div>
  )
}

export default BulletList
