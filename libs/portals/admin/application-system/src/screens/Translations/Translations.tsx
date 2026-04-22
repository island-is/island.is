import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Text,
  Table as T,
  Tag,
  Button,
  SkeletonLoader,
  Input,
  Pagination,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ApplicationConfigurations } from '@island.is/application/types'

interface TemplateItem {
  typeId: string
  slug: string
  translationNamespaces: string[]
}

const PAGE_SIZE = 20

const allTemplates: TemplateItem[] = Object.entries(
  ApplicationConfigurations,
).map(([typeId, config]) => ({
  typeId,
  slug: config.slug,
  translationNamespaces: Array.isArray(config.translation)
    ? config.translation
    : [config.translation],
}))

const Translations = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)

  const filtered = allTemplates.filter(
    (t) =>
      t.slug.toLowerCase().includes(searchValue.toLowerCase()) ||
      t.typeId.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <Text variant="h3">{formatMessage(m.translations)}</Text>
      </Box>

      <Box marginBottom={3}>
        <Input
          name="search-translations"
          placeholder={formatMessage(m.searchStrPlaceholder)}
          size="sm"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            setPage(1)
          }}
        />
      </Box>

      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="small" fontWeight="semiBold">
                {formatMessage(m.applicationType)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="small" fontWeight="semiBold">
                Slug
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="small" fontWeight="semiBold">
                Namespaces
              </Text>
            </T.HeadData>
            <T.HeadData />
          </T.Row>
        </T.Head>
        <T.Body>
          {pageItems.map((template) => (
            <T.Row key={template.typeId}>
              <T.Data>
                <Text variant="small">{template.typeId}</Text>
              </T.Data>
              <T.Data>
                <Text variant="small">{template.slug}</Text>
              </T.Data>
              <T.Data>
                <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
                  {template.translationNamespaces.map((ns) => (
                    <Tag key={ns} variant="blue" outlined>
                      {ns}
                    </Tag>
                  ))}
                </Box>
              </T.Data>
              <T.Data>
                <Button
                  variant="text"
                  size="small"
                  onClick={() =>
                    navigate(`/umsoknakerfi/thydingar/${template.typeId}`)
                  }
                >
                  {formatMessage(m.translationOpen)}
                </Button>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>

      {filtered.length === 0 && (
        <Box marginTop={3}>
          <Text>{formatMessage(m.notFound)}</Text>
        </Box>
      )}

      {totalPages > 1 && (
        <Box marginTop={3} display="flex" justifyContent="center">
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(p, className, children) => (
              <button className={className} onClick={() => setPage(p)}>
                {children}
              </button>
            )}
          />
        </Box>
      )}
    </Box>
  )
}

export default Translations
