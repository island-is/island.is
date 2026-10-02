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
import { useEstateFilesQuery } from './EstateFiles.generated'

export const EstateFiles = () => {
  useNamespaces('sp.estates')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams<{ id: string }>()
  const [search, setSearch] = useState('')

  const { data, loading, error } = useEstateFilesQuery({
    variables: { input: { caseId: id ?? '' } },
    skip: !id,
  })

  const documents = data?.estate?.documents ?? []
  const filtered = documents.filter((d) =>
    search ? d.name?.toLowerCase().includes(search.toLowerCase()) : true,
  )

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
              label={formatMessage(m.searchLabel)}
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
              <T.HeadData>{formatMessage(m.status)}</T.HeadData>
              <T.HeadData />
            </T.Row>
          </T.Head>
          <T.Body>
            {filtered.map((doc, i) => (
              <T.Row key={i}>
                <T.Data>
                  <Text variant="small">{doc.name}</Text>
                  {doc.documentTypeDescription && (
                    <Text variant="small" color="dark300">
                      {doc.documentTypeDescription}
                    </Text>
                  )}
                  {doc.documentDate && (
                    <Text variant="small" color="dark300">
                      {new Date(doc.documentDate).toLocaleDateString(lang)}
                    </Text>
                  )}
                </T.Data>
                <T.Data>
                  {doc.availability && (
                    <Tag variant="blue" outlined>
                      {doc.availability}
                    </Tag>
                  )}
                </T.Data>
                <T.Data>
                  {doc.requestAction?.url && (
                    <LinkButton
                      to={doc.requestAction.url}
                      text={
                        doc.requestAction.label ?? formatMessage(em.viewFile)
                      }
                      variant="text"
                      icon="open"
                    />
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
