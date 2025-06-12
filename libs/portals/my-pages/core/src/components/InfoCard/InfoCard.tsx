/**
 * InfoCard Component
 *
 * A versatile card component designed to display information in various formats.
 * It supports multiple variants, including default, detail, appointment, and link,
 * and can be customized with icons, tags, images, and detailed information.
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
 * @param {object} [props.icon] - Icon details to display on the card.
 * @param {IconProps['icon']} props.icon.type - The type of the icon.
 * @param {IconProps['color']} props.icon.color - The color of the icon.
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
  IconProps,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { ActionCardProps } from '@island.is/island-ui/core/types'
import React from 'react'
import useIsMobile from '../../hooks/useIsMobile/useIsMobile'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './InfoCard.css'
import TimeCard from './TimeCard'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface InfoCardDetail {
  label: string
  value: string | React.ReactNode
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
  icon?: { type: IconProps['icon']; color: IconProps['color'] }
  detail?: InfoCardDetail[]
  tags?: Array<ActionCardProps['tag']>
  img?: string
  variant?: 'default' | 'detail' | 'appointment' | 'link'
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  to,
  size = 'small',
  icon,
  detail,
  tags,
  img,
  appointment,
  variant = 'default',
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const isDesktop = width < theme.breakpoints.xl

  const detailLength = detail ? detail.length : 0

  let detailData = detail
  if (detailLength >= 12) {
    detailData = detail?.slice(0, 12)
  }

  if (variant === 'appointment') {
    console.log('appointment', appointment)
    return (
      <TimeCard title={title} data={appointment} description={description} />
    )
  }

  return (
    <Box width={size === 'large' ? 'full' : undefined}>
      <LinkResolver href={to ?? ''} className={styles.container}>
        <Box
          border="standard"
          borderColor="blue200"
          borderRadius="large"
          padding={3}
          className={styles.boxContainer}
        >
          <GridRow direction="row">
            <GridColumn
              span={
                size === 'large'
                  ? img && !isMobile
                    ? '8/12'
                    : '11/12'
                  : '11/12'
              }
              className={styles.contentContainer}
            >
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems={'center'}
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
                  <Inline space={1}>
                    <Text>{description}</Text>
                    {icon && <Icon icon={icon.type} color={icon.color} />}
                  </Inline>
                </Box>
              </Box>
              {detailData && (
                <Box
                  display="flex"
                  flexDirection={[
                    'column',
                    'column',
                    'column',
                    'column',
                    'row',
                  ]}
                  flexWrap="nowrap"
                  alignItems="stretch"
                  justifyContent={'spaceBetween'}
                  className={styles.detailContainer}
                >
                  {detailData.map((item, index) => (
                    <React.Fragment key={`${item.label}-${index}`}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        className={styles.detailItem}
                      >
                        <Text variant="small">{item.label}</Text>
                        <Text variant="h3" as="p">
                          {item.value}
                        </Text>
                      </Box>

                      {/* Only show divider between items */}
                      {index < detailData.length - 1 && (
                        <Box
                          display="flex"
                          style={{ gap: 4 }}
                          borderColor="blue200"
                          borderRightWidth={
                            size === 'large' ? 'standard' : undefined
                          }
                          marginY={isDesktop ? 2 : 0}
                          borderBottomWidth={isDesktop ? 'standard' : undefined}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              )}
            </GridColumn>
            {size === 'large' && !isMobile && img && (
              <GridColumn span="3/12" className={styles.imageContainer}>
                <Box
                  className={styles.image}
                  alt=""
                  component="img"
                  src={img}
                  marginRight={isMobile ? 2 : 0}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="full"
                />
              </GridColumn>
            )}
            <GridColumn span="1/12" className={styles.icon}>
              <Box
                display="flex"
                justifyContent="flexEnd"
                alignItems="flexStart"
              >
                <Icon icon="arrowForward" type="outline" color="blue400" />
              </Box>
            </GridColumn>
          </GridRow>
          {tags && tags.length > 0 && (
            <GridRow>
              <GridColumn paddingTop={2}>
                {tags.map((tag, index) => (
                  <Tag variant={tag?.variant} outlined key={index}>
                    {tag?.label}
                  </Tag>
                ))}
              </GridColumn>
            </GridRow>
          )}
        </Box>
      </LinkResolver>
    </Box>
  )
}

export default InfoCard
