import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import * as styles from './IdsAdminCard.css'

interface ButtonAction {
  onClick?: ComponentPropsWithoutRef<typeof Button>['onClick']
  to?: never
}

interface LinkAction {
  onClick?: never
  to: ComponentPropsWithoutRef<typeof Link>['to']
}

interface TagProps extends ComponentPropsWithoutRef<typeof Tag> {}

interface IdsAdminCardProps {
  title: ReactNode
  eyebrow?: ReactNode
  tags?: TagProps[]
  text?: ReactNode
  cta?: { label: string } & (ButtonAction | LinkAction)
}

export default function IdsAdminCard({
  cta,
  title,
  eyebrow,
  tags = [],
  text,
}: IdsAdminCardProps) {
  const renderCTA = () => {
    if (!cta) {
      return null
    }

    const button = (isLink: boolean) => (
      <Button
        icon="pencil"
        variant="utility"
        onClick={cta.onClick}
        as={isLink ? 'span' : 'button'}
      >
        {cta.label}
      </Button>
    )

    if (cta.to) {
      return (
        <Link className={styles.cta} to={cta.to}>
          {button(true)}
        </Link>
      )
    }

    return button(false)
  }

  return (
    <Box
      component="article"
      borderRadius="large"
      border="standard"
      paddingX={[2, 4]}
      paddingY={3}
      display="flex"
      columnGap={2}
      flexGrow={1}
    >
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        flexGrow={1}
      >
        {eyebrow ? <Box marginBottom={2}>{eyebrow}</Box> : null}

        <Text variant="h3" as="h3">
          {title}
        </Text>
        {text ? <Text>{text}</Text> : null}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        rowGap={[1, 2, 3]}
        justifyContent="spaceBetween"
        alignItems="flexEnd"
      >
        <Box
          display="flex"
          flexDirection={['column', 'row', 'row', 'row', 'row']}
          columnGap={1}
          rowGap={1}
        >
          {tags?.map(({ children, ...tagProps }, tagIndex) => (
            <Tag
              key={tagIndex}
              variant="purple"
              outlined
              disabled
              {...tagProps}
            >
              {children}
            </Tag>
          ))}
        </Box>

        {renderCTA()}
      </Box>
    </Box>
  )
}
