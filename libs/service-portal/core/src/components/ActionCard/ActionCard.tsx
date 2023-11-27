import {
  Box,
  Button,
  ButtonSizes,
  ButtonTypes,
  Hidden,
  Icon,
  IconMapIcon,
  Inline,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import * as React from 'react'
import { CardLoader, isExternalLink } from '../..'
import * as styles from './ActionCard.css'
import LinkResolver from '../LinkResolver/LinkResolver'

type ActionCardProps = {
  capitalizeHeading?: boolean
  date?: string
  heading?: string
  text?: string
  subText?: string
  secondaryText?: string
  eyebrow?: string
  loading?: boolean
  backgroundColor?: 'white' | 'blue' | 'red'
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
    onClick?: () => void
    disabled?: boolean
    centered?: boolean
    hide?: boolean
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
    type: 'avatar' | 'image' | 'logo'
    url?: string
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

export const ActionCard: React.FC<React.PropsWithChildren<ActionCardProps>> = ({
  capitalizeHeading = false,
  date,
  heading,
  text,
  subText,
  secondaryText,
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
          borderRadius="circle"
          background="blue100"
          className={styles.avatar}
        >
          <Text
            capitalizeFirstLetter={capitalizeHeading}
            variant="h3"
            as="p"
            color="blue400"
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
          borderRadius="circle"
        >
          <img className={styles.avatar} src={image.url} alt="action-card" />
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
          paddingTop={tag.label ? 'gutter' : 0}
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
                <LinkResolver href={cta.url}>
                  <Button
                    icon={isExternalLink(cta.url) ? 'open' : cta.icon}
                    colorScheme="default"
                    iconType="outline"
                    size="small"
                    type="span"
                    unfocusable
                    variant="text"
                  >
                    {cta.label}
                  </Button>
                </LinkResolver>
              ) : (
                <Button
                  variant={cta.variant}
                  size="small"
                  onClick={cta.onClick}
                  disabled={cta.disabled}
                  icon={cta.icon}
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

  console.log('tag', tag)
  console.log('sec', secondaryTag)
  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={
        backgroundColor === 'red'
          ? 'red200'
          : backgroundColor === 'blue'
          ? 'blue100'
          : 'blue200'
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
          {heading && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              alignItems={['flexStart', 'flexStart', 'flexEnd']}
            >
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
                    backgroundColor === 'blue' ? 'blue600' : 'currentColor'
                  }
                >
                  {heading}
                </Text>
              </Box>
              <Hidden above="xs">
                {secondaryTag && (
                  <Box marginRight="smallGutter">
                    {!date && !eyebrow && renderTag(secondaryTag)}
                  </Box>
                )}
                <Box>{!date && !eyebrow && renderTag(tag)}</Box>
              </Hidden>
            </Box>
          )}
          {text && <Text paddingTop={heading ? 1 : 0}>{text}</Text>}
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
