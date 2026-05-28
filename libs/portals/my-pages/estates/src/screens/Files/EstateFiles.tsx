import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  m,
  IntroWrapper,
  LinkButton,
  SYSLUMENN_SLUG,
} from '@island.is/portals/my-pages/core'
import { estatesMessages as em } from '../../lib/messages'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'

// TODO: Uncomment and wire up when the GraphQL domain for estates is ready
// import { useEstateFilesQuery } from './EstateFiles.generated'

export const EstateFiles = () => {
  useNamespaces('sp.estates')
  const { formatMessage } = useLocale()
  const { id: _id } = useParams<{ id: string }>()
  const [search, setSearch] = useState('')

  // TODO: Replace with real query once `estateFiles(id)` GraphQL resolver is available.
  // const { data, loading, error } = useEstateFilesQuery({
  //   variables: { id: id ?? '', searchQuery: search || undefined },
  //   skip: !id,
  // })
  const loading = false
  const error = undefined
  const files: {
    id: string
    name: string
    submittedAt?: string
    fileSizeBytes?: number
    fileStatus?: string
    documentUrl?: string
  }[] = []

  const filtered = files.filter((f) =>
    search ? f.name.toLowerCase().includes(search.toLowerCase()) : true,
  )

  const formatFileSize = (bytes?: number) => {
    if (bytes == null) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const statusVariant = (status?: string) => {
    switch (status) {
      case 'received':
        return 'mint'
      case 'pending':
        return 'blue'
      case 'missing':
        return 'red'
      default:
        return 'blue'
    }
  }

  const statusLabel = (status?: string) => {
    switch (status) {
      case 'received':
        return formatMessage(em.fileStatusReceived)
      case 'pending':
        return formatMessage(em.fileStatusPending)
      case 'missing':
        return formatMessage(em.fileStatusMissing)
      default:
        return ''
    }
  }

  return (
    <IntroWrapper
      title={em.filesTitle}
      intro={em.filesIntro}
      serviceProvider={{
        slug: SYSLUMENN_SLUG,
        tooltip: formatMessage(m.estatesTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="submit"
            to={formatMessage(em.filesButtonUrl)}
            text={formatMessage(em.filesButtonLabel)}
            icon="open"
            variant="utility"
          />,
        ],
      }}
    >
      <Box marginBottom={3}>
        <GridRow>
          <GridColumn span={['12/12', '6/12', '4/12']}>
            <Input
              icon={{ name: 'search' }}
              backgroundColor="blue"
              size="xs"
              label={formatMessage(em.searchPlaceholder)}
              placeholder={formatMessage(em.searchPlaceholder)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="estate-files-search"
            />
          </GridColumn>
        </GridRow>
      </Box>

      {loading && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}

      {error && !loading && <Problem error={error} noBorder={false} />}

      {!loading && !error && filtered.length === 0 && (
        <Problem
          type="no_data"
          title={formatMessage(em.noFilesFound)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/movingTruck.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(em.fileName)}</T.HeadData>
              <T.HeadData>{formatMessage(em.fileSizeLabel)}</T.HeadData>
              <T.HeadData>{formatMessage(m.status)}</T.HeadData>
              <T.HeadData />
            </T.Row>
          </T.Head>
          <T.Body>
            {filtered.map((file) => (
              <T.Row key={file.id}>
                <T.Data>
                  <Text variant="small">{file.name}</Text>
                  {file.submittedAt && (
                    <Text variant="small" color="dark300">
                      {file.submittedAt}
                    </Text>
                  )}
                </T.Data>
                <T.Data>
                  <Text variant="small">
                    {formatFileSize(file.fileSizeBytes)}
                  </Text>
                </T.Data>
                <T.Data>
                  {file.fileStatus && statusLabel(file.fileStatus) && (
                    <Tag variant={statusVariant(file.fileStatus)} outlined>
                      {statusLabel(file.fileStatus)}
                    </Tag>
                  )}
                </T.Data>
                <T.Data>
                  {file.documentUrl && (
                    <a
                      href={file.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatMessage(em.viewFile)}
                    </a>
                  )}
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
    </IntroWrapper>
  )
}

export default EstateFiles
