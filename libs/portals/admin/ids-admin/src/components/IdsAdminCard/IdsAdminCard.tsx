import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import React, { ComponentPropsWithoutRef, ReactNode } from 'react'
import * as styles from './IdsAdminCard.css'
import type { TestSupport } from '@island.is/island-ui/utils'

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
  dataTestId,
}: IdsAdminCardProps & TestSupport) {
  const renderCTA = () => {
    if (!cta) {
      return null
    }

    const renderButton = (isLink: boolean) => (
      <Button
        icon="pencil"
        variant="utility"
        onClick={cta.onClick}
        type="button"
        as={isLink ? 'span' : 'button'}
      >
        {cta.label}
      </Button>
    )

    if (cta.to) {
      return (
        <Link className={styles.cta} to={cta.to}>
          {renderButton(true)}
        </Link>
      )
    }

    return renderButton(false)
  }

  return (
    <Box
      component="article"
      borderRadius="large"
      border="standard"
      padding={[3, 4]}
      display="flex"
      columnGap={2}
      flexGrow={1}
      data-testid={dataTestId}
    >
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        flexGrow={1}
      >
        {eyebrow && <Box marginBottom={2}>{eyebrow}</Box>}
        <Text variant="h3" as="h2">
          <span className={styles.mobileTextRestriction}>{title}</span>
        </Text>
        {text && (
          <Text>
            <span className={styles.mobileTextRestriction}>{text}</span>
          </Text>
        )}
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
            <Tag key={tagIndex} variant="purple" outlined {...tagProps}>
              {children}
            </Tag>
          ))}
        </Box>

        {renderCTA()}
      </Box>
    </Box>
  )
}
