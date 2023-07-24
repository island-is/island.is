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
import { Button, ButtonSizes, ButtonTypes } from '../Button/Button'
import { Icon as IconType } from '../IconRC/iconMap'

import * as styles from './ActionCategoryCard.css'
import { Checkbox } from '../Checkbox/Checkbox'

export const STACK_WIDTH = 280

type Tag = {
  label: string
  href?: string
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

export type ActionCategoryCardProps = {
  ref?: UseMeasureRef<HTMLElement>
  width?: number
  icon?: React.ReactElement
  iconText?: string
  heading: string
  headingAs?: TextProps['as']
  headingVariant?: TextProps['variant']
  text: string
  tags?: Tag[]
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

  secondaryTag?: Tag

  cta?: CTAProps
  secondaryCta?: CTAProps

  //TODO: DOCUMENT THIS: NEW ITEMS FOR HASKOLANAM
  sidePanelConfig?: SidePanelConfigProps
}

const defaultCta = {
  variant: 'primary',
  icon: 'arrowForward',
  onClick: () => null,
} as const

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

export type ActionCategoryCardImage =
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
  ActionCategoryCardProps & ActionCategoryCardImage
>(
  (
    {
      width,
      stackWidth = STACK_WIDTH,
      heading,
      headingAs = 'h3',
      headingVariant = 'h3',
      icon,
      iconText,
      text,
      href = '/',
      tags = [],
      colorScheme = 'blue',
      truncateHeading = false,
      src,
      alt,
      objectFit = 'contain',
      customImage,
      hyphenate = false,
      tagOptions,
      secondaryTag,
      autoStack,
      sidePanelConfig,
      cta: _cta,
      secondaryCta,
      ...rest
    },
    ref,
  ) => {
    const { borderColor, textColor, tagVariant } = colorSchemes[colorScheme]
    const cta = { ...defaultCta, ..._cta }

    const hasTags = Array.isArray(tags) && tags.length > 0
    const hasImage = !!src || !!customImage

    const shouldStack = width && width < stackWidth

    const renderCTA = () => {
      const hasCTA = !!cta.label
      const hasSecondaryCTA = hasCTA && secondaryCta?.label

      return (
        hasCTA && (
          <Box
            paddingTop="gutter"
            display="flex"
            justifyContent={['flexStart', 'flexEnd']}
            alignItems="center"
            flexDirection="row"
          >
            {hasSecondaryCTA && (
              <Box paddingRight={2} paddingLeft={2}>
                <Button
                  variant={secondaryCta.variant}
                  size={secondaryCta?.size}
                  onClick={secondaryCta?.onClick}
                  icon={secondaryCta?.icon}
                  iconType={secondaryCta?.iconType}
                  disabled={secondaryCta?.disabled}
                >
                  {secondaryCta?.label}
                </Button>
              </Box>
            )}
            <Box>
              <Button
                {...(cta.buttonType ?? { variant: cta.variant })}
                size={cta.size}
                onClick={cta.onClick}
                disabled={cta.disabled}
                icon={cta.icon}
                iconType={cta.iconType}
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
            width="full"
            flexDirection="column"
            justifyContent="spaceBetween"
            style={{ alignSelf: 'stretch' }}
          >
            <Box
              display="flex"
              flexDirection={iconText ? 'column' : 'row'}
              alignItems={iconText ? 'flexStart' : icon ? 'center' : 'flexEnd'}
            >
              {icon && (
                <Box display="flex" alignItems="center" marginBottom={2}>
                  <Box
                    paddingRight={1}
                    display="flex"
                    alignItems="center"
                    className={styles.icon}
                  >
                    {icon}
                  </Box>
                  {iconText && <Text variant="small">{iconText}</Text>}
                </Box>
              )}
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
                width="full"
                columnGap={2}
              >
                <Text
                  as={headingAs}
                  variant={headingVariant}
                  color={textColor}
                  truncate={truncateHeading}
                  title={heading}
                >
                  {hyphenate ? <Hyphen>{heading}</Hyphen> : heading}
                </Text>
                <Tag
                  key={secondaryTag?.label}
                  disabled={secondaryTag?.disabled}
                  outlined={true}
                  variant="white"
                  href={secondaryTag?.href}
                  onClick={secondaryTag?.onClick}
                  {...tagOptions}
                >
                  {secondaryTag?.label}
                </Tag>
              </Box>
            </Box>
            <Text paddingTop={2} paddingBottom={3}>
              {text}
            </Text>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent={hasTags ? 'spaceBetween' : 'flexEnd'}
            >
              {hasTags && (
                <Box paddingTop={3}>
                  <Inline space={['smallGutter', 'smallGutter', 'gutter']}>
                    {tags.map((tag) => (
                      <Tag
                        key={tag.label}
                        disabled={tag.disabled}
                        outlined={!tag.href}
                        variant={tagVariant}
                        href={tag.href}
                        onClick={tag.onClick}
                        {...tagOptions}
                      >
                        {tag.label}
                      </Tag>
                    ))}
                  </Inline>
                </Box>
              )}
              <Box>{renderCTA()}</Box>
            </Box>
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
              alignItems="center"
              borderLeftWidth="standard"
              borderStyle="solid"
              borderColor="blue200"
              paddingLeft={3}
              marginLeft={5}
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
              <Box marginTop={2}>
                <Checkbox
                  label="Setja í samanburð"
                  labelVariant="small"
                  onChange={sidePanelConfig.onCheck}
                />
              </Box>
            </Box>
          )}
        </Box>
      </FocusableBox>
    )
  },
)

export const ActionCategoryCard = (
  props: ActionCategoryCardProps & ActionCategoryCardImage,
) => {
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
