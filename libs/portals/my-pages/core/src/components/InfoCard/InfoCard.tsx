/**
 * InfoCard Component
 *
 * A versatile card component designed to display information in various formats.
 * It supports multiple variants, including default, detail, appointment, and link,
 * and can be customized with tags, images, and detailed information.
 * Please use with InfoCardGrid for a grid layout of InfoCards.
 *
 * @component
 * @param {InfoCardProps} props - The properties for the InfoCard component.
 * @param {string} props.title - The title of the card.
 * @param {string} props.description - A brief description displayed on the card.
 * @param {string} props.to - The URL or path the card links to.
 * @param {'small' | 'large'} props.size - The size of the card, either 'small' or 'large'.
 * @param {'default' | 'detail' | 'appointment' | 'link'} [props.variant] - The variant of the card, determining its layout and behavior.
 * @param {object} [props.appointment] - Appointment details for the 'appointment' variant.
 * @param {string} props.appointment.date - The date of the appointment.
 * @param {string} props.appointment.time - The time of the appointment.
 * @param {object} props.appointment.location - The location details of the appointment.
 * @param {string} props.appointment.location.label - The label for the location.
 * @param {string} [props.appointment.location.href] - An optional link for the location.
 * @param {InfoCardDetail[]} [props.detail] - An array of detail objects to display additional information.
 * @param {string} props.detail[].label - The label for the detail item.
 * @param {string | React.ReactNode} props.detail[].value - The value for the detail item.
 * @param {Array<ActionCardProps['tag']>} [props.tags] - An array of tags to display on the card.
 * @param {string} [props.img] - An optional image URL to display on the card.
 *
 * @returns {React.FC<InfoCardProps>} A React functional component rendering the InfoCard.
 */
import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { ActionCardProps } from '@island.is/island-ui/core/types'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { useWindowSize } from 'react-use'
import { m } from '../../lib/messages'
import LinkResolver from '../LinkResolver/LinkResolver'
import { EmptyCard } from './EmptyCard'
import * as styles from './InfoCard.css'
import { LoaderCard } from './LoaderCard'
import { TimeCard } from './TimeCard'

interface InfoCardDetail {
  label: string
  tooltip?: string
  value: string | React.ReactNode
  subValue?: string | React.ReactNode
}

export interface InfoCardProps {
  title: string
  description: string
  to?: string
  size?: 'small' | 'large'
  appointment?: {
    date: string
    time: string
    location: {
      label: string
      href?: string
    }
  }
  detail?: (InfoCardDetail | null)[]
  tooltip?: string
  tags?: Array<ActionCardProps['tag']>
  img?: string
  variant?: 'default' | 'detail' | 'appointment' | 'link'
  loading?: boolean
  error?: boolean
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  to,
  size = 'small',
  detail,
  tags,
  img,
  appointment,
  variant = 'default',
  loading = false,
  tooltip,
  error,
}) => {
  const { width } = useWindowSize()
  const { formatMessage } = useLocale()
  const isMobile = width < theme.breakpoints.md

  const displayBottomBorder = width < theme.breakpoints.xl
  const displayRightBorder = width >= theme.breakpoints.xl

  const detailLength = detail ? detail.length : 0

  let detailData = detail

  if (detailLength >= 12) {
    detailData = detail?.slice(0, 12)
  }

  if (variant === 'appointment') {
    return (
      <TimeCard title={title} data={appointment} description={description} />
    )
  }

  if (loading) {
    return <LoaderCard />
  }

  if (!loading && error) {
    return (
      <EmptyCard
        title={title}
        description={formatMessage(m.errorFetch)}
        size="large"
      />
    )
  }

  const content = (
    <Box
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      padding={3}
      className={styles.boxContainer}
      height="full"
      background="white"
    >
      <GridRow direction="row" className={styles.gridRow}>
        <GridColumn
          span={
            size === 'large'
              ? img && !isMobile
                ? to
                  ? '8/12'
                  : '9/12'
                : to
                ? '11/12'
                : '12/12'
              : to
              ? '11/12'
              : '12/12'
          }
          className={styles.contentContainer}
        >
          <Box
            display="flex"
            justifyContent="spaceBetween"
            flexGrow={1}
            marginBottom={detail ? 3 : 0}
          >
            <Box>
              <Text
                variant="h4"
                marginBottom={variant === 'link' ? 0 : 1}
                color="blue400"
              >
                {title}
              </Text>
              <Inline>
                <Text>{description}</Text>
                {tooltip && <Tooltip text={tooltip} />}
              </Inline>
            </Box>
          </Box>
          {detailData && (
            <Box
              display="flex"
              flexDirection={['column', 'column', 'column', 'column', 'row']}
              flexWrap="nowrap"
              alignItems="stretch"
              justifyContent={'spaceBetween'}
              width="full"
            >
              {detailData.map((item, index) => (
                <React.Fragment key={`${item?.label}-${index}`}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="spaceBetween"
                    className={styles.flexItem}
                  >
                    <Inline>
                      <Text variant="small">{item?.label}</Text>
                      {item?.tooltip && <Tooltip text={item?.tooltip} />}
                    </Inline>
                    <Inline alignY="bottom">
                      <Text variant="h3" as="p">
                        {item?.value}
                      </Text>
                      {item?.subValue && (
                        <Box marginLeft={1}>
                          <Text
                            variant="eyebrow"
                            color="foregroundPrimaryMinimal"
                          >
                            {item?.subValue}
                          </Text>
                        </Box>
                      )}
                    </Inline>
                  </Box>

                  {/* Only show divider between items */}
                  {index < detailData.length - 1 && (
                    <Box
                      display="flex"
                      className={styles.flexItemBorder}
                      justifyContent="center"
                      marginY={[2, 2, 2, 2, 0]}
                    >
                      <Box
                        borderColor="blue200"
                        borderRightWidth={
                          displayRightBorder ? 'standard' : undefined
                        }
                        borderBottomWidth={
                          displayBottomBorder ? 'standard' : undefined
                        }
                      />
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          )}
        </GridColumn>
        {size === 'large' && !isMobile && img && (
          <GridColumn span={'3/12'} className={styles.imageContainer}>
            <Box
              alt=""
              component="img"
              src={img}
              marginRight={isMobile ? 2 : 0}
              className={styles.image}
            />
          </GridColumn>
        )}
        {to && (
          <GridColumn span="1/12" className={styles.icon}>
            <Box display="flex" justifyContent="flexEnd" alignItems="flexStart">
              <Icon icon="arrowForward" type="outline" color="blue400" />
            </Box>
          </GridColumn>
        )}
      </GridRow>
      {tags && tags.length > 0 && (
        <GridRow>
          <GridColumn paddingTop={2}>
            {tags.map((tag, index) => (
              <Tag
                variant={tag?.variant}
                outlined
                disabled
                key={`infocard-tag-${tag?.label ?? index}`}
              >
                {tag?.label}
              </Tag>
            ))}
          </GridColumn>
        </GridRow>
      )}
    </Box>
  )
  return (
    <Box
      width={size === 'large' ? 'full' : undefined}
      className={styles.container}
    >
      {to ? (
        <LinkResolver href={to} className={styles.containerLink}>
          {content}
        </LinkResolver>
      ) : (
        <Box className={styles.containerLink}>{content}</Box>
      )}
    </Box>
  )
}

export default InfoCard
