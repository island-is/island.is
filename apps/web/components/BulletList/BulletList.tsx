import React, { FC, ReactNode, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import cn from 'classnames'

import { Box, Button, Icon, Link, Stack, Text } from '@island.is/island-ui/core'
import { IconBullet } from '@island.is/web/components'

import * as styles from './BulletList.css'

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

export type BulletEntry = IconBullet | NumberBulletGroup

export interface BulletListProps {
  bullets: BulletEntry[]
}

export const BulletList: FC<React.PropsWithChildren<BulletListProps>> = ({
  bullets,
}) => (
  <div>
    {bullets.map((bullet, index) => {
      return bullet.type === 'IconBullet' ? (
        <Row
          key={index}
          left={<IconBullet variant="blue" size="large" image={bullet.icon} />}
        >
          <Stack space={1}>
            <Text variant="h3" as="h3">
              {bullet.title}
            </Text>
            <Text>{bullet.body}</Text>
            {bullet.url && bullet.linkText && (
              <Link href={bullet.url}>
                <Button
                  as="span"
                  variant="text"
                  icon="arrowForward"
                  unfocusable
                >
                  {bullet.linkText}
                </Button>
              </Link>
            )}
          </Stack>
        </Row>
      ) : (
        <NumberSection key={index} group={bullet} />
      )
    })}
  </div>
)

const Row: FC<React.PropsWithChildren<{ left: ReactNode }>> = ({
  left,
  children,
}) => (
  <Box
    alignItems="stretch"
    display="flex"
    flexDirection={['column', 'row', 'row']}
    paddingY={2}
  >
    <Box
      display="flex"
      justifyContent="center"
      className={styles.leftCol}
      marginBottom={[4, 0, 0]}
    >
      {left}
    </Box>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      paddingLeft={[0, 3, 3]}
      className={styles.textBody}
    >
      {children}
    </Box>
  </Box>
)

type NumberSectionProps = {
  group: NumberBulletGroup
}

const NumberSection = ({ group }: NumberSectionProps) => {
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
        <Text variant="h4" as="h3">
          {bullet.title}
        </Text>
        <Text>{bullet.body}</Text>
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
                  <Icon icon="add" size="large" />
                </IconBullet>
              </div>
            }
          >
            <Box cursor="pointer" onClick={toggleExpand}>
              <Text variant="h4" as="h4" color="blue400">
                Sjá {expanded ? 'minna' : 'meira'}
              </Text>
            </Box>
          </Row>
        </>
      )}
    </div>
  )
}

export default BulletList
