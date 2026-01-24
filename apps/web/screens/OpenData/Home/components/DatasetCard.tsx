import React from 'react'
import NextLink from 'next/link'

import { Box, Icon, Link, Tag, Text } from '@island.is/island-ui/core'

import { OrganizationLogo } from './OrganizationLogo'

export interface DataItem {
  id: string
  title: string
  description: string
  category: string
  publisher: string
  organizationImage?: string
  lastUpdated: string
  format: string
  tags: string[]
  downloadUrl?: string
}

interface TranslationFn {
  (key: string, fallback: string): string
}

interface DatasetCardProps {
  item: DataItem
  variant: 'grid' | 'list'
  formatDate: (date: string) => string
  n: TranslationFn
}

const CardHeader: React.FC<{
  publisher: string
  category?: string
  organizationImage?: string
}> = ({ publisher, category, organizationImage }) => (
  <Box display="flex" justifyContent="spaceBetween" alignItems="flexStart" marginBottom={2}>
    <Box>
      <Text variant="eyebrow" as="div" color="blue400">
        {publisher}
      </Text>
      {category && (
        <Text variant="small" color="dark300">
          {category}
        </Text>
      )}
    </Box>
    <Box style={{ width: '40px', height: '40px', flexShrink: 0 }}>
      <OrganizationLogo image={organizationImage} name={publisher} size="small" />
    </Box>
  </Box>
)

const CardTitle: React.FC<{
  id: string
  title: string
  variant: 'h3' | 'h4'
}> = ({ id, title, variant }) => (
  <Box marginBottom={2}>
    <NextLink href={`/opingogn/${id}`} passHref legacyBehavior>
      <Link href={`/opingogn/${id}`} underline="small" skipTab>
        <Text variant={variant} as="h3" color="blue400">
          {title}
        </Text>
      </Link>
    </NextLink>
  </Box>
)

const ViewMoreLink: React.FC<{
  id: string
  label: string
  variant: 'grid' | 'list'
}> = ({ id, label, variant }) => {
  const _thickness = variant === 'grid' ? '2px' : '1px'
  
  return (
    <NextLink href={`/opingogn/${id}`} passHref legacyBehavior>
      <Link href={`/opingogn/${id}`} underline="small" color="blue400">
        <Text variant="small" color="blue400" fontWeight="semiBold">
          {label} →
        </Text>
      </Link>
    </NextLink>
  )
}

const MetaInfo: React.FC<{
  item: DataItem
  formatDate: (date: string) => string
  n: TranslationFn
  variant: 'grid' | 'list'
}> = ({ item, formatDate, n, variant }) => {
  const isGrid = variant === 'grid'
  const iconSize = isGrid ? 'medium' : 'small'
  const textColor = isGrid ? 'dark400' : 'dark300'
  const gap = isGrid ? '0.75rem' : '0.5rem'

  const metaItems = [
    {
      icon: 'calendar' as const,
      label: n('lastUpdated', 'Síðast uppfært'),
      value: formatDate(item.lastUpdated),
    },
    {
      icon: (isGrid ? 'person' : 'lockOpened') as const,
      label: n('access', 'Aðgangur'),
      value: n('open', 'Opinn'),
    },
    {
      icon: 'document' as const,
      label: n('dataFormat', 'Gagnsnið'),
      value: item.format,
    },
  ]

  if (isGrid) {
    return (
      <Box paddingTop={3} marginTop="auto">
        {metaItems.map((meta, index) => (
          <Box
            key={meta.icon}
            display="flex"
            alignItems="center"
            marginBottom={index < metaItems.length - 1 ? 1 : 0}
            style={{ gap }}
          >
            <Icon icon={meta.icon} type="outline" color="blue400" size={iconSize} />
            <Text variant="small" color={textColor}>
              {meta.label}: {meta.value}
            </Text>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box paddingTop={3} display="flex" style={{ gap: '2rem' }} alignItems="center">
      {metaItems.map((meta) => (
        <Box key={meta.icon} display="flex" alignItems="center" style={{ gap }}>
          <Icon icon={meta.icon} type="outline" color="blue400" size={iconSize} />
          <Text variant="small" color={textColor}>
            {meta.label}: {meta.value}
          </Text>
        </Box>
      ))}
    </Box>
  )
}

export const DatasetCard: React.FC<DatasetCardProps> = ({
  item,
  variant,
  formatDate,
  n,
}) => {
  const isGrid = variant === 'grid'

  return (
    <Box
      background="white"
      border="standard"
      borderRadius="large"
      padding={3}
      height={isGrid ? 'full' : undefined}
      display="flex"
      flexDirection="column"
    >
      <CardHeader
        publisher={item.publisher}
        category={item.category}
        organizationImage={item.organizationImage}
      />

      <CardTitle
        id={item.id}
        title={item.title}
        variant={isGrid ? 'h3' : 'h4'}
      />

      <Text variant={isGrid ? 'default' : 'small'} color="dark400">
        {isGrid && item.description?.length > 150
          ? `${item.description.substring(0, 150)}...`
          : item.description}
      </Text>

      {isGrid ? (
        <>
          <MetaInfo item={item} formatDate={formatDate} n={n} variant="grid" />
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            paddingTop={3}
            marginTop="auto"
          >
            <Box>
              {item.tags && item.tags.length > 0 && (
                <Tag variant="blue" outlined>
                  {item.tags[0]}
                </Tag>
              )}
            </Box>
            <ViewMoreLink id={item.id} label={n('viewMore', 'Skoða nánar')} variant="grid" />
          </Box>
        </>
      ) : (
        <Box paddingTop={3} display="flex" style={{ gap: '2rem' }} alignItems="center">
          <MetaInfo item={item} formatDate={formatDate} n={n} variant="list" />
          <Box display="flex" alignItems="center" style={{ marginLeft: 'auto', gap: '1rem' }}>
            {item.tags && item.tags.length > 0 && (
              <Tag variant="blue" outlined>
                {item.tags[0]}
              </Tag>
            )}
            <ViewMoreLink id={item.id} label={n('viewMore', 'Skoða nánar')} variant="list" />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DatasetCard
