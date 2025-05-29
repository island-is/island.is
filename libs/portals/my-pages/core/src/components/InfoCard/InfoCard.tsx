import {
  Box,
  GridColumn,
  GridColumnProps,
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

interface InfoCardDetail {
  label: string
  value: string | React.ReactNode
}

export interface InfoCardProps {
  title: string
  description: string
  to: string
  size: 'small' | 'large'
  icon?: { type: IconProps['icon']; color: IconProps['color'] }
  detail?: InfoCardDetail[]
  tags?: Array<ActionCardProps['tag']>
  img?: string
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
}) => {
  const { isMobile } = useIsMobile()
  const detailLength = detail ? detail.length : 0

  const detailItemSpan: GridColumnProps['span'] =
    detailLength <= 2 ? '4/8' : detailLength >= 4 ? '2/8' : '3/8'
  let detailData = detail
  if (detailLength >= 12) {
    detailData = detail?.slice(0, 12)
  }

  console.log('size', title, size)

  return (
    <Box width={size === 'large' ? 'full' : undefined}>
      <LinkResolver href={to} className={styles.container}>
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
            >
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems={'center'}
                marginBottom={detail ? 3 : 0}
              >
                <Box>
                  <Text variant="h4" marginBottom={1} color="blue400">
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
                    size === 'small' ? 'column' : 'row',
                    size === 'small' ? 'column' : 'row',
                    size === 'small' ? 'column' : 'row',
                    'row',
                  ]}
                  flexWrap="nowrap"
                  alignItems={[
                    'flexStart',
                    'flexStart',
                    'flexStart',
                    'flexStart',
                    'center',
                  ]}
                  justifyContent={
                    size === 'small' ? 'spaceBetween' : 'flexStart'
                  }
                >
                  {detailData.map((item, index) => (
                    <>
                      <Box
                        borderColor="blue200"
                        paddingRight={2}
                        paddingLeft={2}
                        paddingY={2}
                        display="flex"
                        justifyContent="center"
                        flexWrap="wrap"
                        flexDirection="column"
                        className={styles.detailItem}
                        key={`${item.label}-${index}`}
                      >
                        <Text variant="small">{item.label}</Text>
                        <Text variant="h3" as="p">
                          {item.value}
                        </Text>
                      </Box>
                      <div
                        className={styles.detailDivider[size]}
                        key={`divider-${index}`}
                      />
                    </>
                  ))}
                </Box>
              )}
            </GridColumn>
            {size === 'large' && !isMobile && img && (
              <GridColumn span="3/12">
                <Box
                  className={styles.image}
                  alt=""
                  component="img"
                  src={img}
                  marginRight={isMobile ? 2 : 0}
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
