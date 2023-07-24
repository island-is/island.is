import React, { ReactElement, ReactNode, forwardRef, ElementType } from 'react'
import cn from 'classnames'
import { ObjectFitProperty } from 'csstype'
import { useMeasure } from 'react-use'
import { UseMeasureRef } from 'react-use/lib/useMeasure'

import { Box } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Inline } from '../Inline/Inline'
import { Tag, TagProps } from '../Tag/Tag'
import { Hyphen } from '../Hyphen/Hyphen'
import { Text, TextProps } from '../Text/Text'

import * as styles from './CategoryCard.css'
import { Checkbox } from '../Checkbox/Checkbox'
import { Button, ButtonSizes, ButtonTypes } from '../Button/Button'
import { Icon as IconType } from '../IconRC/iconMap'

export const STACK_WIDTH = 280

export type CategoryCardTag = {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  outlined?: boolean
}

export type CTAProps = {
  label: string
  /** Allows for simple variant configuration of the button. If buttonType is defined it will supersede this property. */
  variant?: ButtonTypes['variant']
  /** Allows for full buttonType control. Supersedes the variant property when both are defined. */
  buttonType?: ButtonTypes
  size?: ButtonSizes
  icon?: IconType
  iconType?: 'filled' | 'outline'
  onClick?: () => void
  disabled?: boolean
}

type SidePanelItems = {
  icon?: React.ReactNode
  title: string
}

type SidePanelConfigProps = {
  onCheck?: () => void
  buttonLabel?: string
  checkboxLabel?: string
  items?: Array<SidePanelItems>
  cta?: CTAProps
}

export type CategoryCardProps = {
  ref?: UseMeasureRef<HTMLElement>
  width?: number
  icon?: React.ReactElement
  heading: string
  headingAs?: TextProps['as']
  headingVariant?: TextProps['variant']
  text: string
  tags?: CategoryCardTag[]
  tagOptions?: Pick<TagProps, 'hyphenate' | 'truncate' | 'textLeft'>
  href?: string
  colorScheme?: 'blue' | 'purple' | 'red'
  /** The heading above is truncated instead of overflowing */
  truncateHeading?: TextProps['truncate']
  /** Use event listener to check wether or not to place the image below the text content */
  autoStack?: boolean
  /** The card width breakpoint that the image should stack below content when autoStack = true */
  stackWidth?: number
  /** Hyphenate the heading */
  hyphenate?: boolean
  to?: string
  component?: ElementType

  //TODO: DOCUMENT THIS: NEW ITEMS FOR HASKOLANAM
  sidePanelConfig?: SidePanelConfigProps
}

const colorSchemes = {
  blue: {
    textColor: 'blue400',
    borderColor: 'blue200',
    tagVariant: 'blue',
  },
  purple: {
    textColor: 'purple400',
    borderColor: 'purple200',
    tagVariant: 'purple',
  },
  red: {
    textColor: 'red600',
    borderColor: 'red200',
    tagVariant: 'red',
  },
} as const

export type CategoryCardImage =
  | {
      src: string
      alt: string
      objectFit?: ObjectFitProperty
      customImage?: never
    }
  | {
      src?: never
      alt?: never
      objectFit?: never
      customImage?: ReactNode
    }

const Component = forwardRef<
  HTMLElement,
  CategoryCardProps & CategoryCardImage
>(
  (
    {
      width,
      stackWidth = STACK_WIDTH,
      heading,
      headingAs = 'h3',
      headingVariant = 'h3',
      icon,
      text,
      href = '/',
      tags = [],
      colorScheme = 'blue',
      truncateHeading = false,
      src,
      alt,
      sidePanelConfig,
      objectFit = 'contain',
      customImage,
      hyphenate = false,
      tagOptions,
      autoStack,
      ...rest
    },
    ref,
  ) => {
    const { borderColor, textColor, tagVariant } = colorSchemes[colorScheme]

    const hasTags = Array.isArray(tags) && tags.length > 0
    const hasImage = !!src || !!customImage

    const shouldStack = width && width < stackWidth

    const renderCTA = () => {
      const hasCTA = !!sidePanelConfig?.cta?.label
      const cta = sidePanelConfig?.cta
      return (
        hasCTA &&
        cta && (
          <Box
            paddingTop="gutter"
            display="flex"
            justifyContent={['flexStart', 'flexEnd']}
            flexDirection="row"
          >
            <Box>
              <Button
                {...(cta.buttonType ?? { variant: cta.variant })}
                size={cta.size}
                onClick={cta.onClick}
                disabled={cta.disabled}
                icon={cta.icon}
                iconType={cta.iconType}
                nowrap
              >
                {cta.label}
              </Button>
            </Box>
          </Box>
        )
      )
    }

    return (
      <FocusableBox
        href={href}
        position="relative"
        display="flex"
        flexDirection="row"
        paddingY={3}
        paddingX={4}
        borderRadius="large"
        borderColor={borderColor}
        borderWidth="standard"
        height="full"
        width="full"
        background="white"
        color={colorScheme}
        {...rest}
      >
        <Box
          ref={ref}
          display="flex"
          flexDirection={shouldStack ? 'column' : 'row'}
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          height="full"
          width="full"
        >
          <Box
            display="flex"
            height={sidePanelConfig ? undefined : 'full'}
            width="full"
            flexDirection="column"
            justifyContent={sidePanelConfig ? 'spaceBetween' : 'flexStart'}
            style={sidePanelConfig && { alignSelf: 'stretch' }}
          >
            <Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems={icon ? 'center' : 'flexEnd'}
              >
                {icon && (
                  <Box
                    paddingRight={1}
                    display="flex"
                    alignItems="center"
                    className={styles.icon}
                  >
                    {icon}
                  </Box>
                )}
                <Text
                  as={headingAs}
                  variant={headingVariant}
                  color={textColor}
                  truncate={truncateHeading}
                  title={heading}
                >
                  {hyphenate ? <Hyphen>{heading}</Hyphen> : heading}
                </Text>
              </Box>
              <Text paddingTop={1}>{text}</Text>
            </Box>
            {hasTags && (
              <Box paddingTop={3}>
                <Inline space={['smallGutter', 'smallGutter', 'gutter']}>
                  {tags.map((tag) => {
                    console.log('tag', tag.outlined)
                    return (
                      <Tag
                        key={tag.label}
                        disabled={tag.disabled}
                        outlined={
                          (tag.outlined || tag.outlined === undefined) &&
                          !tag.href
                        }
                        variant={tagVariant}
                        href={tag.href}
                        onClick={tag.onClick}
                        {...tagOptions}
                      >
                        {tag.label}
                      </Tag>
                    )
                  })}
                </Inline>
              </Box>
            )}
          </Box>
          {hasImage &&
            (customImage ? (
              customImage
            ) : (
              <Box
                display="flex"
                position="relative"
                height="full"
                justifyContent="center"
                alignItems={shouldStack ? 'flexEnd' : 'center'}
                marginLeft={shouldStack ? 0 : 2}
                marginTop={shouldStack ? 2 : 0}
                className={cn({
                  [styles.imageContainerHidden]: !autoStack,
                })}
              >
                <img
                  src={src}
                  alt={alt}
                  style={{ objectFit }}
                  className={styles.image}
                />
              </Box>
            ))}
          {sidePanelConfig && (
            <Box
              display="flex"
              flexDirection="column"
              position="relative"
              justifyContent="flexStart"
              paddingLeft={5}
              style={{ alignSelf: 'stretch' }}
            >
              {sidePanelConfig.items &&
                sidePanelConfig.items.map((item) => {
                  return (
                    <Box
                      display="flex"
                      flexDirection="row"
                      width="full"
                      paddingBottom={1}
                    >
                      <Box paddingRight={2}>{item.icon}</Box>
                      <Text whiteSpace="nowrap" variant="small">
                        {item.title}
                      </Text>
                    </Box>
                  )
                })}
              <Box>
                <Checkbox
                  label="Setja í samanburð"
                  labelVariant="small"
                  onChange={sidePanelConfig.onCheck}
                />
              </Box>
              <Box>{renderCTA()}</Box>
            </Box>
          )}
        </Box>
      </FocusableBox>
    )
  },
)

export const CategoryCard = (props: CategoryCardProps & CategoryCardImage) => {
  return props.autoStack ? (
    <WithMeasureProps>
      {(measureProps) => <Component {...props} {...measureProps} />}
    </WithMeasureProps>
  ) : (
    <Component {...props} />
  )
}

interface MeasureProps {
  children: ({
    ref,
    width,
  }: {
    ref: UseMeasureRef<HTMLElement>
    width: number
  }) => ReactElement | null
}

const WithMeasureProps = ({ children }: MeasureProps) => {
  const [ref, { width }] = useMeasure()

  return typeof children === 'function' ? children({ ref, width }) : children
}
