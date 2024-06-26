import { ReactNode } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import cn from 'classnames'
import {
  Box,
  BoxProps,
  Button,
  Hidden,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import * as styles from './SingleLicenseCard.css'
import { m } from '../../lib/messages'
import { LinkResolver } from '@island.is/service-portal/core'

export type tag = {
  text?: string
  color: 'red' | 'blue'
}

export const SingleLicenseCard = ({
  title,
  subtitle,
  link,
  img,
  tag = {
    text: undefined,
    color: 'blue',
  },
  secondaryTag,
  additionalLink,
  additionalLinkText,
  background,
  linkText,
  dataTestId,
  translateTitle = 'yes',
}: {
  title: string
  subtitle: string
  link: string
  img: string
  tag?: tag
  linkText?: string
  additionalLink?: ReactNode | string
  additionalLinkText?: string
  background?: BoxProps['background']
  secondaryTag?: tag
  dataTestId?: string
  translateTitle?: 'yes' | 'no'
}) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()

  return (
    <Box
      border="standard"
      borderRadius="large"
      padding={4}
      display="flex"
      flexDirection="row"
      background={background}
      dataTestId={dataTestId}
    >
      <Hidden below="sm">
        <img className={styles.image} src={img} alt={title} />
      </Hidden>
      <Box
        display="flex"
        flexDirection="column"
        width="full"
        paddingLeft={[0, 2]}
      >
        <Box
          display="flex"
          flexDirection={['column', 'column', 'column', 'row']}
          justifyContent="spaceBetween"
          alignItems="flexStart"
        >
          <Text translate={translateTitle} variant="h4" as="h2">
            {title}
          </Text>
          <Box
            display="flex"
            flexDirection={['column', 'column', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexEnd']}
            justifyContent="flexEnd"
            textAlign="right"
            marginBottom={1}
          >
            {secondaryTag ? (
              <Box paddingRight={1} paddingTop={[1, 1, 1, 0]}>
                <Tag disabled variant={secondaryTag.color}>
                  {secondaryTag.text}
                </Tag>
              </Box>
            ) : null}
            {tag.text ? (
              <Box paddingTop={[1, 1, 1, 0]}>
                <Tag disabled variant={tag.color}>
                  {tag.text}
                </Tag>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection={['column', 'row']}
          justifyContent={'spaceBetween'}
          paddingTop={[1, 0]}
        >
          <Box className={cn({ [styles.flexShrink]: additionalLink })}>
            <Text>{subtitle}</Text>
          </Box>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            justifyContent={'flexEnd'}
            alignItems={['flexStart', 'center']}
            className={styles.flexGrow}
            paddingTop={[1, 0]}
          >
            {additionalLink &&
              (typeof additionalLink === 'string' ? (
                <Link
                  to={{
                    pathname: additionalLink,
                  }}
                >
                  <Box paddingTop={[1, 0]}>
                    <Button variant="text" size="small" icon="arrowForward">
                      {additionalLinkText
                        ? additionalLinkText
                        : formatMessage(m.seeDetails)}
                    </Button>
                  </Box>
                </Link>
              ) : (
                additionalLink
              ))}
            {additionalLink && (
              <Hidden below="sm">
                <Box className={styles.line} marginLeft={2} marginRight={2} />
              </Hidden>
            )}
            <LinkResolver href={link}>
              <Box paddingTop={[1, 0]}>
                <Button variant="text" size="small" icon="arrowForward">
                  {linkText ?? formatMessage(m.seeDetails)}
                </Button>
              </Box>
            </LinkResolver>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SingleLicenseCard
