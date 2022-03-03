import React, { useEffect,useState } from 'react'
import { useHistory } from 'react-router-dom'

import {
  ActionCard,
  Box,
  Input,
  Pagination,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalPath } from '@island.is/service-portal/core'

import { m } from '../../lib/messages'

import { OrganisationPreview } from './DocumentProviders'

interface Props {
  organisationsPreview: OrganisationPreview[]
}

const PAGE_SIZE = 10

export const DocumentProvidersSearch = ({ organisationsPreview }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const history = useHistory()
  const { formatMessage } = useLocale()
  const [searchResults, setSearchResults] = useState(organisationsPreview)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const filtered = organisationsPreview
      .filter((org) => {
        return org.name.toLowerCase().includes(searchTerm.toLowerCase())
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    setSearchResults(filtered)

    const lastPage = Math.ceil(filtered.length / PAGE_SIZE)
    if (lastPage === 0) {
      setPage(1)
    } else if (page > lastPage) {
      setPage(lastPage)
    }
  }, [searchTerm, organisationsPreview, page])

  const handleChange = (value: string) => {
    setSearchTerm(value)
  }

  const totalPages = Math.max(Math.ceil(searchResults.length / PAGE_SIZE), 1)
  return (
    <Box>
      <Input
        size="xs"
        placeholder={formatMessage(m.documentProvidersSearchPlaceholder)}
        name="searchProviders"
        backgroundColor="blue"
        icon="search"
        value={searchTerm}
        onChange={(e) => {
          handleChange(e.target.value)
        }}
      />
      {searchResults && (
        <Box marginY={3}>
          <Box marginBottom={2}></Box>
          {searchResults
            .slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page)
            .map(({ name, id, nationalId }) => (
              <Box marginBottom={2} key={id}>
                <ActionCard
                  heading={name}
                  cta={{
                    label: formatMessage(
                      m.documentProvidersSearchResultsActionCardLabel,
                    ),
                    variant: 'text',
                    onClick: () => {
                      history.push({
                        pathname: ServicePortalPath.DocumentProviderDocumentProvidersSingle.replace(
                          ':nationalId',
                          nationalId,
                        ),
                        state: {
                          id,
                          name,
                        },
                      })
                    },
                  }}
                />
              </Box>
            ))}
        </Box>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        renderLink={(page, className, children) => (
          <Box
            cursor="pointer"
            className={className}
            onClick={() => setPage(page)}
          >
            {children}
          </Box>
        )}
      />
    </Box>
  )
}
