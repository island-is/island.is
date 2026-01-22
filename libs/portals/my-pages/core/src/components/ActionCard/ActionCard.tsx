import {
  Box,
  Button,
  ButtonSizes,
  ButtonTypes,
  Hidden,
  Icon,
  IconMapIcon,
  IconMapType,
  Inline,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import * as React from 'react'
import { CardLoader } from '../CardLoader/CardLoader'
import { isExternalLink } from '../../utils/isExternalLink'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './ActionCard.css'

export type ActionCardProps = {
  capitalizeHeading?: boolean
  date?: string
  heading?: string
  text?: string
  subText?: string
  secondaryText?: string
  eyebrow?: string
  loading?: boolean
  backgroundColor?: 'white' | 'blue' | 'red' | 'blueberry'
  borderColor?: 'red100' | 'blue100' | 'blue200'
  headingColor?: 'blue400' | 'blue600' | 'currentColor'
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
  }
  secondaryTag?: ActionCardProps['tag']
  cta: {
    url?: string
    internalUrl?: string
    label: string
    variant?: ButtonTypes['variant']
    size?: ButtonSizes
    icon?: IconMapIcon
    iconType?: IconMapType
    onClick?: () => void
    disabled?: boolean
    centered?: boolean
    hide?: boolean
    callback?: () => void
  }
  secondaryCta?: {
    label: string
    visible?: boolean
    size?: ButtonSizes
    icon?: IconMapIcon
    onClick?: () => void
    disabled?: boolean
    centered?: boolean
  }
  image?: {
    type: 'avatar' | 'image' | 'logo' | 'circle'
    url?: string
    active?: boolean
  }
  translateLabel?: 'yes' | 'no'
}

const defaultCta = {
  variant: 'primary',
  icon: 'arrowForward',
  onClick: () => null,
} as const

const defaultTag = {
  variant: 'blue',
  outlined: true,
  label: '',
} as const

/**
 * @deprecated Use ui/core ActionCard instead
 */
export const ActionCard: React.FC<React.PropsWithChildren<ActionCardProps>> = ({
  capitalizeHeading = false,
  date,
  heading,
  text,
  subText,
  secondaryText,
  borderColor,
  headingColor,
  eyebrow,
  loading,
  backgroundColor = 'white',
  cta: _cta,
  secondaryCta,
  tag: _tag,
  secondaryTag,
  image,
  translateLabel = 'yes',
}) => {
  const cta = { ...defaultCta, ..._cta }
  const tag = { ...defaultTag, ..._tag }
  const bgr =
    backgroundColor === 'white'
      ? 'white'
      : backgroundColor === 'red'
      ? 'red100'
      : backgroundColor === 'blueberry'
      ? 'blueberry100'
      : 'blue100'

  const renderImage = () => {
    if (!image) {
      return null
    }

    if (image.type === 'avatar' && heading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          marginRight={[2, 3]}
          borderRadius="full"
          background="blue100"
          className={cn(styles.avatar, styles.image)}
        >
          <Text
            capitalizeFirstLetter={capitalizeHeading}
            variant="h3"
            as="p"
            color={headingColor ?? 'blue400'}
          >
            {getTitleAbbreviation(heading)}
          </Text>
        </Box>
      )
    }
    if (!image.url || image.url.length === 0) return null
    if (image.type === 'image') {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          marginRight={[2, 3]}
          borderRadius="full"
        >
          <img className={styles.image} src={image.url} alt="" />
        </Box>
      )
    }
    if (image.type === 'circle') {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          marginRight={[2, 3]}
          borderRadius="full"
          background={image.active ? 'white' : 'blue100'}
          className={cn(styles.avatar, styles.image)}
        >
          <img className={styles.circleImg} src={image.url} alt="" />
        </Box>
      )
    }
    if (image.type === 'logo') {
      return (
        <Box
          padding={2}
          marginRight={2}
          className={styles.logo}
          style={{ backgroundImage: `url(${image.url})` }}
        />
      )
    }
    return null
  }

  const renderEyebrow = () => {
    if (!eyebrow) {
      return null
    }

    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent={eyebrow ? 'spaceBetween' : 'flexEnd'}
        marginBottom={[0, 1]}
      >
        <Text variant="eyebrow" color="purple400">
          {eyebrow}
        </Text>
        {renderTag(tag)}
      </Box>
    )
  }
  const renderDate = () => {
    if (!date) {
      return null
    }

    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent={date ? 'spaceBetween' : 'flexEnd'}
        marginBottom={[0, 2]}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box display="flex" marginRight={1} justifyContent="center">
            <Icon icon="time" size="medium" type="outline" color="blue400" />
          </Box>
          <Box display="flex" justifyContent="center">
            <Text variant="small">{date}</Text>
          </Box>
        </Box>
        <Inline alignY="center" space={1}>
          {!eyebrow && renderTag(tag)}
        </Inline>
      </Box>
    )
  }

  const renderTag = (actionTag: ActionCardProps['tag']) => {
    if (!actionTag?.label) {
      return null
    }

    return (
      <Tag outlined={actionTag.outlined} variant={actionTag.variant} disabled>
        {actionTag.label}
      </Tag>
    )
  }

  const renderDefault = () => {
    const hasCTA = cta.label
    const hasSecondaryCTA =
      hasCTA && secondaryCta?.label && secondaryCta?.visible

    return (
      !!hasCTA && (
        <Box
          paddingTop={tag.label || secondaryTag?.label ? 'gutter' : 0}
          display="flex"
          justifyContent={['flexStart', 'flexEnd']}
          alignItems="center"
          flexDirection="row"
        >
          {hasSecondaryCTA && (
            <Box paddingRight={4} paddingLeft={2}>
              <Button
                variant="text"
                size={secondaryCta?.size}
                onClick={secondaryCta?.onClick}
                icon={secondaryCta?.icon}
                disabled={secondaryCta?.disabled}
              >
                {secondaryCta?.label}
              </Button>
            </Box>
          )}
          {!cta.hide && (
            <Box dataTestId="action-card-cta" marginLeft={[0, 3]}>
              {cta.url ? (
                <LinkResolver callback={cta.callback} href={cta.url}>
                  <Button
                    icon={isExternalLink(cta.url) ? 'open' : cta.icon}
                    colorScheme="default"
                    iconType={cta.iconType ?? 'outline'}
                    size={cta.size ?? 'small'}
                    type="span"
                    unfocusable
                    as="span"
                    variant={cta.variant ?? 'text'}
                  >
                    {cta.label}
                  </Button>
                </LinkResolver>
              ) : (
                <Button
                  variant={cta.variant}
                  size={cta.size ?? 'small'}
                  onClick={cta.onClick}
                  disabled={cta.disabled}
                  icon={cta.icon}
                  iconType={cta.iconType}
                >
                  {cta.label}
                </Button>
              )}
            </Box>
          )}
        </Box>
      )
    )
  }

  if (loading) {
    return (
      <Box width="full" className={styles.loader}>
        <CardLoader />
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={
        borderColor ??
        (backgroundColor === 'red'
          ? 'black'
          : backgroundColor === 'blue'
          ? 'blue100'
          : 'blue200')
      }
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background={bgr}
    >
      {renderEyebrow()}

      {renderDate()}
      <Box
        alignItems={['flexStart', 'center']}
        justifyContent="center"
        display="flex"
        flexDirection={['column', 'row']}
      >
        {/* Checking image type so the image is placed correctly */}
        {image?.type !== 'logo' && renderImage()}
        <Box flexDirection="row" width="full">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            alignItems={['flexStart', 'flexStart', 'flexEnd']}
            flexWrap="wrap"
          >
            {heading && (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ flex: 1 }}
              >
                {/* Checking image type so the logo is placed correctly */}
                {image?.type === 'logo' && renderImage()}
                <Text
                  capitalizeFirstLetter={capitalizeHeading}
                  variant="h4"
                  translate={translateLabel}
                  color={
                    headingColor ??
                    (backgroundColor === 'blue' ? 'blue600' : 'currentColor')
                  }
                >
                  {heading}
                </Text>
              </Box>
            )}
            {!heading && text && (
              <Text paddingTop={heading ? 1 : 0}>{text}</Text>
            )}
            <Hidden above="xs">
              {secondaryTag && (
                <Box marginRight="smallGutter">
                  {!date && !eyebrow && renderTag(secondaryTag)}
                </Box>
              )}
              <Box>{!date && !eyebrow && renderTag(tag)}</Box>
            </Hidden>
          </Box>
          {heading && text && <Text paddingTop={heading ? 1 : 0}>{text}</Text>}
          {subText && <Text>{subText}</Text>}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          alignItems="flexStart"
        >
          {secondaryText && (
            <Text paddingTop={tag.label ? 6 : 0}>{secondaryText}</Text>
          )}
        </Box>

        <Box
          display="flex"
          alignItems={['flexStart', 'flexEnd']}
          flexDirection="column"
          flexShrink={0}
          marginTop={[1, 0]}
          marginLeft={[0, 'auto']}
          className={
            tag?.label ? styles.tag : cta.centered ? undefined : styles.button
          }
        >
          <Hidden below="sm">
            <Box
              display="flex"
              flexDirection={[
                'columnReverse',
                'columnReverse',
                'columnReverse',
                'row',
              ]}
            >
              <>
                {!date && !eyebrow && renderTag(secondaryTag)}
                <Box marginRight="smallGutter" marginBottom="smallGutter" />
                {!date && !eyebrow && renderTag(tag)}
              </>
            </Box>
          </Hidden>
          {renderDefault()}
        </Box>
      </Box>
    </Box>
  )
}

const getTitleAbbreviation = (title: string) => {
  const words = title.split(' ')
  let initials = words[0].substring(0, 1).toUpperCase()

  if (words.length > 1)
    initials += words[words.length - 1].substring(0, 1).toUpperCase()

  return initials
}
