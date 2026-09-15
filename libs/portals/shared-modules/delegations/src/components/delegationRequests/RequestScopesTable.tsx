import format from 'date-fns/format'

import { Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import * as styles from '../tables/Tables.css'

interface RequestScope {
  scopeName: string
  displayName?: string | null
  domainDisplayName?: string | null
  validTo?: string | null
}

/**
 * The scopes a delegation request asks for, in the same shape the granted
 * delegations tables use — these become those rows once the request is
 * approved.
 */
export const RequestScopesTable = ({ scopes }: { scopes: RequestScope[] }) => {
  const { formatMessage } = useLocale()

  return (
    <div className={styles.tableContainer}>
      <T.Table>
        <T.Head>
          <T.Row>
            {[
              formatMessage(m.headerDomain),
              formatMessage(m.headerScopeName),
              formatMessage(m.headerValidityPeriod),
            ].map((value, i) => (
              <T.HeadData key={value + i} style={{ paddingInline: 16 }}>
                <Text variant="medium" fontWeight="semiBold">
                  {value}
                </Text>
              </T.HeadData>
            ))}
          </T.Row>
        </T.Head>
        <T.Body>
          {scopes.map((scope) => (
            <T.Row key={scope.scopeName}>
              <T.Data style={{ paddingInline: 16, wordBreak: 'break-word' }}>
                <Text variant="medium">{scope.domainDisplayName}</Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16, wordBreak: 'break-word' }}>
                <Text variant="medium">
                  {scope.displayName ?? scope.scopeName}
                </Text>
              </T.Data>
              <T.Data style={{ paddingInline: 16 }}>
                <Text variant="medium">
                  {scope.validTo
                    ? format(new Date(scope.validTo), 'dd.MM.yyyy')
                    : '-'}
                </Text>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </div>
  )
}
