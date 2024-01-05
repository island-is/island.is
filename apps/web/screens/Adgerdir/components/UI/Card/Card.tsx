/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactNode, useContext } from 'react'
import { useMeasure } from 'react-use'
import cn from 'classnames'
import Link, { LinkProps } from 'next/link'
import { Box, Stack, Text, Inline } from '@island.is/island-ui/core'
import { Image } from '@island.is/web/graphql/schema'
import { BackgroundImage } from '@island.is/web/components'
import { ColorSchemeContext } from '../ColorSchemeContext/ColorSchemeContext'
import { Tag, TagProps } from '../Tag/Tag'
import { FocusableBox } from '../FocusableBox/FocusableBox'

import * as covidStyles from '../styles/styles.css'
import * as styles from './Card.css'

export type CardTagsProps = {
  tagProps?: Omit<TagProps, 'children'>
  href?: string
  as?: string
  title: string
}

const tagPropsDefaults: Omit<TagProps, 'children'> = {
  variant: 'green',
}

interface CardProps {
  title: string
  image?: Image
  description: string
  tags?: Array<CardTagsProps>
  linkProps?: LinkProps
  href?: string
  as?: string
  status?: string
}

export const Card: FC<React.PropsWithChildren<CardProps>> = ({
  title,
  image,
  description,
  tags = [],
  href,
  as,
  status,
}) => {
  const { colorScheme } = useContext(ColorSchemeContext)
  const [ref, { width }] = useMeasure()

  const stackImage = width < 360

  let borderColor = null
  let titleColor = null
  let tagVariant = 'green' as TagProps['variant']

  switch (colorScheme) {
    case 'green':
      borderColor = 'red200'
      titleColor = 'red600'
      tagVariant = 'green'
      break
    case 'blue':
      borderColor = 'blue200'
      titleColor = 'blue400'
      tagVariant = 'blue'
      break
    default:
      borderColor = 'purple200'
      titleColor = 'blue400'
      break
  }

  const items = [
    <Box
      key={1}
      className={cn(styles.cardContent, {
        [styles.cardContentNarrower]: image && !stackImage,
      })}
    >
      <Stack space={1}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box display="inlineFlex" flexGrow={1}>
            <Text as="h3" variant="h3">
              <span className={covidStyles.textColor[colorScheme]}>
                {title}
              </span>
            </Text>
          </Box>
        </Box>
        {description && <Text>{description}</Text>}
        {tags.length > 0 && (
          <Box paddingTop={3} flexGrow={0} position="relative">
            <Inline space={1}>
              {tags.map(
                ({ title, href, as, ...props }: CardTagsProps, index) => {
                  const tagProps = {
                    ...tagPropsDefaults,
                    ...props.tagProps,
                    variant: tagVariant,
                  }

                  return href ? (
                    <Link key={index} href={href} as={as} legacyBehavior>
                      <Tag {...tagProps}>{title}</Tag>
                    </Link>
                  ) : (
                    <Tag key={index} {...tagProps}>
                      {title}
                    </Tag>
                  )
                },
              )}
            </Inline>
          </Box>
        )}
      </Stack>
    </Box>,
    !!image && (
      <Box
        key={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={cn(styles.imageContainer, {
          [styles.imageContainerStacked]: stackImage,
        })}
      >
        <BackgroundImage
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          positionX={!stackImage ? 'right' : null}
          background="transparent"
          backgroundSize="contain"
          image={image}
        />
      </Box>
    ),
  ]

  if (stackImage) {
    items.reverse()
  }

  const Content = (
    <Box
      ref={ref}
      display="flex"
      height="full"
      borderRadius="large"
      flexDirection="column"
    >
      <Box
        flexGrow={1}
        height="full"
        position="relative"
        display="flex"
        flexDirection={stackImage ? 'column' : 'row'}
      >
        {items}
      </Box>
    </Box>
  )

  if (href) {
    return (
      <FocusableBox
        href={href}
        as={as}
        borderRadius="large"
        flexDirection="column"
        height="full"
        width="full"
        flexGrow={1}
        background="white"
        borderWidth="standard"
        className={covidStyles.focusableBorderColor[colorScheme]}
      >
        {status ? (
          <span
            className={cn(
              styles.status,
              styles.statusPosition,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              styles.statusType[status],
            )}
          ></span>
        ) : null}
        <Frame>{Content}</Frame>
      </FocusableBox>
    )
  }

  return (
    <Frame>
      {status ? (
        <span
          className={cn(
            styles.status,
            styles.statusPosition,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            styles.statusType[status],
          )}
        ></span>
      ) : null}
      {Content}
    </Frame>
  )
}

export const Frame = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      className={cn(styles.card)}
      position="relative"
      borderRadius="large"
      overflow="hidden"
      height="full"
      background="white"
      outline="none"
      padding={[2, 2, 4]}
    >
      {children}
    </Box>
  )
}

export default Card
