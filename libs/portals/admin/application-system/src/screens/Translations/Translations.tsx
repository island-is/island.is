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
  Divider,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { buildSharedNamespaceTranslationPath } from '../../lib/paths'
import {
  useGetApplicationSharedNamespaceListQuery,
  useGetApplicationTemplateListQuery,
} from '../../queries/translations.generated'
import {
  getTranslationSaveErrorDetail,
  isTranslationAccessForbiddenError,
} from '../../utils/translationWorkspaceErrors'

const PAGE_SIZE = 20

interface TranslationsProps {
  isSuperAdmin: boolean
}

const Translations = ({ isSuperAdmin }: TranslationsProps) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error } = useGetApplicationTemplateListQuery({
    ssr: false,
  })

  const {
    data: sharedData,
    loading: sharedLoading,
    error: sharedError,
  } = useGetApplicationSharedNamespaceListQuery({
    ssr: false,
    skip: !isSuperAdmin,
  })

  const templates = data?.applicationTemplateList ?? []
  const sharedNamespaces = sharedData?.applicationSharedNamespaceList ?? []

  const filtered = templates.filter((template) => {
    const search = searchValue.toLowerCase()
    return (
      template.name.toLowerCase().includes(search) ||
      template.slug.toLowerCase().includes(search) ||
      template.typeId.toLowerCase().includes(search)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading || (isSuperAdmin && sharedLoading)) {
    return (
      <Box>
        <SkeletonLoader height={48} repeat={6} space={2} />
      </Box>
    )
  }

  const listError = error ?? (isSuperAdmin ? sharedError : undefined)
  if (listError) {
    const detail = getTranslationSaveErrorDetail(listError)
    const isForbidden = isTranslationAccessForbiddenError(listError)
    return (
      <Box marginTop={3}>
        <Text color="red600">
          {isForbidden
            ? 'You do not have access to view application translations.'
            : detail || listError.message}
        </Text>
      </Box>
    )
  }

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

      {isSuperAdmin && (
        <Box marginBottom={5}>
          <Text variant="h4" marginBottom={3}>
            {formatMessage(m.sharedTranslationSpaces)}
          </Text>

          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  <Text variant="small" fontWeight="semiBold">
                    {formatMessage(m.sharedTranslationNamespace)}
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="small" fontWeight="semiBold">
                    {formatMessage(m.sharedTranslationUsedBy)}
                  </Text>
                </T.HeadData>
                <T.HeadData />
              </T.Row>
            </T.Head>
            <T.Body>
              {sharedNamespaces.map((entry) => (
                <T.Row key={entry.namespace}>
                  <T.Data>
                    <Text variant="small">{entry.namespace}</Text>
                  </T.Data>
                  <T.Data>
                    <Text variant="small">
                      {entry.usedByCount > 0
                        ? `${entry.usedByCount} applications`
                        : 'All applications'}
                    </Text>
                  </T.Data>
                  <T.Data>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() =>
                        navigate(buildSharedNamespaceTranslationPath(entry.namespace))
                      }
                    >
                      {formatMessage(m.translationOpen)}
                    </Button>
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>

          {sharedNamespaces.length === 0 && (
            <Box marginTop={3}>
              <Text>{formatMessage(m.notFound)}</Text>
            </Box>
          )}

          <Box marginTop={5}>
            <Divider />
          </Box>
        </Box>
      )}

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
                <Text variant="small">{template.name}</Text>
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
