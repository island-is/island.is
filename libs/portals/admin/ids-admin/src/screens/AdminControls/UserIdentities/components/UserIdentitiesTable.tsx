import {
  Box,
  Button,
  Icon,
  LoadingDots,
  Table as T,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../../../lib/messages'
import type { UserIdentityRow } from '../UserIdentities.types'
import * as styles from '../UserIdentities.css'

const SUBJECT_ID_PREFIX_LENGTH = 10

const truncateSubjectId = (subjectId: string): string =>
  subjectId.length > SUBJECT_ID_PREFIX_LENGTH
    ? `${subjectId.slice(0, SUBJECT_ID_PREFIX_LENGTH)}…`
    : subjectId

interface UserIdentitiesTableProps {
  rows: UserIdentityRow[]
  search: string
  loading?: boolean
  onViewClaims: (row: UserIdentityRow) => void
  onDeactivate: (row: UserIdentityRow) => void
  onReactivate: (row: UserIdentityRow) => void
  onClearSearch?: () => void
}
export const UserIdentitiesTable = ({
  rows,
  search,
  loading,
  onViewClaims,
  onDeactivate,
  onReactivate,
  onClearSearch,
}: UserIdentitiesTableProps) => {
  const { formatMessage } = useLocale()

  const handleCopySubjectId = (subjectId: string) => {
    navigator.clipboard.writeText(subjectId).then(() => {
      toast.success(formatMessage(m.copySuccess))
    })
  }

  if (!search) {
    return (
      <Box
        padding={4}
        textAlign="center"
        border="standard"
        borderRadius="large"
      >
        <Text>{formatMessage(m.userIdentitiesEmptyState)}</Text>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box
        padding={4}
        textAlign="center"
        border="standard"
        borderRadius="large"
      >
        <LoadingDots />
      </Box>
    )
  }

  if (rows.length === 0) {
    return (
      <Box
        padding={4}
        textAlign="center"
        border="standard"
        borderRadius="large"
      >
        <Problem
          type="no_data"
          title={formatMessage(m.userIdentitiesNotFound)}
          message={
            onClearSearch ? (
              <Box marginTop={2}>
                <Button variant="ghost" size="small" onClick={onClearSearch}>
                  {formatMessage(m.clearFilter)}
                </Button>
              </Box>
            ) : undefined
          }
          titleSize="h3"
        />
      </Box>
    )
  }

  return (
    <Box className={styles.tableContainer}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.userIdentitiesSubjectId)}</T.HeadData>
            <T.HeadData>{formatMessage(m.userIdentitiesName)}</T.HeadData>
            <T.HeadData>
              {formatMessage(m.userIdentitiesProviderName)}
            </T.HeadData>
            <T.HeadData>
              {formatMessage(m.userIdentitiesProviderSubjectId)}
            </T.HeadData>
            <T.HeadData>
              {formatMessage(m.userIdentitiesEnvironments)}
            </T.HeadData>
            <T.HeadData>{/* Claims */}</T.HeadData>
            <T.HeadData>{/* Actions */}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows.map((row) => {
            const isFullyDeactivated =
              row.activeEnvironments.length === 0 &&
              row.deactivatedEnvironments.length > 0
            return (
              <T.Row key={row.subjectId}>
                <T.Data>
                  <Box display="flex" alignItems="center" columnGap={1}>
                    <Box
                      style={isFullyDeactivated ? { opacity: 0.6 } : undefined}
                      title={row.subjectId}
                    >
                      {truncateSubjectId(row.subjectId)}
                    </Box>
                    <button
                      type="button"
                      aria-label={formatMessage(m.copy)}
                      onClick={() => handleCopySubjectId(row.subjectId)}
                    >
                      <Icon
                        type="outline"
                        color="blue400"
                        icon="copy"
                        size="small"
                      />
                    </button>
                  </Box>
                </T.Data>
                <T.Data>
                  <Box
                    style={isFullyDeactivated ? { opacity: 0.6 } : undefined}
                  >
                    {row.name}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box
                    style={isFullyDeactivated ? { opacity: 0.6 } : undefined}
                  >
                    {row.providerName}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box
                    style={isFullyDeactivated ? { opacity: 0.6 } : undefined}
                  >
                    {row.providerSubjectId}
                  </Box>
                </T.Data>
                <T.Data>
                  <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
                    {row.activeEnvironments.map((env) => (
                      <Tag
                        key={`active-${env}`}
                        variant="blue"
                        outlined
                        disabled
                      >
                        {env}
                      </Tag>
                    ))}
                    {row.deactivatedEnvironments.map((env) => (
                      <Tag key={`deact-${env}`} variant="red" outlined disabled>
                        {env}
                      </Tag>
                    ))}
                  </Box>
                </T.Data>
                <T.Data>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => onViewClaims(row)}
                  >
                    {formatMessage(m.userIdentitiesViewClaims)}
                  </Button>
                </T.Data>
                <T.Data>
                  <Box display="flex" columnGap={2} justifyContent="flexEnd">
                    {row.activeEnvironments.length > 0 && (
                      <Button
                        variant="ghost"
                        size="small"
                        icon="trash"
                        colorScheme="destructive"
                        onClick={() => onDeactivate(row)}
                      />
                    )}
                    {row.deactivatedEnvironments.length > 0 && (
                      <Button
                        variant="ghost"
                        size="small"
                        icon="reload"
                        onClick={() => onReactivate(row)}
                      />
                    )}
                  </Box>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}
