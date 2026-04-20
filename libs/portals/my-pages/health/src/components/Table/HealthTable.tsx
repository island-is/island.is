import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { EmptyTable, LinkButton } from '@island.is/portals/my-pages/core'
import { Markdown } from '@island.is/shared/components'
import { messages as m } from '../../lib/messages'
import { DetailTable } from '../../utils/types'

import * as styles from '../../screens/Vaccinations/tables/VaccinationsTable.css'

export const HealthTable = ({
  footerText,
  headerData,
  rowData,
}: DetailTable) => {
  return (
    <Box padding={3} background="blue100">
      <T.Table
        box={{
          className: styles.table,
        }}
      >
        <T.Head>
          {headerData.map((item, i) => (
            <T.HeadData key={i}>
              <Text variant="eyebrow" as="span">
                {item.value}
              </Text>
            </T.HeadData>
          ))}
        </T.Head>
        {rowData && rowData.length > 0 && (
          <T.Body>
            {rowData.map((row, i) => (
              <T.Row key={i}>
                {row.map((item, ii) => (
                  <T.Data key={ii}>
                    {item.type === 'link' && item.url ? (
                      <LinkButton
                        to={item.url}
                        text={item.value}
                        variant="text"
                      />
                    ) : (
                      <Text variant="small" as="span">
                        {item.value}
                      </Text>
                    )}
                  </T.Data>
                ))}
              </T.Row>
            ))}
          </T.Body>
        )}
      </T.Table>
      {(rowData === undefined || rowData.length === 0) && (
        <Box width="full" background="white">
          <EmptyTable message={m.noVaccinesRegistered} />
        </Box>
      )}
      <Box marginTop={2} paddingLeft={2}>
        <ul color="black">
          {footerText.map((item, i) => (
            <li key={i} className={styles.footerList}>
              <Markdown>{item}</Markdown>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  )
}
