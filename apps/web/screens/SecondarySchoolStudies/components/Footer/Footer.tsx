import { useIntl } from 'react-intl'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../../messages/messages'

const BACKGROUND_COLOR = '#1A3869'

export const Footer = () => {
  const { formatMessage } = useIntl()

  return (
    <GridContainer>
      <Box
        component="footer"
        style={{ background: BACKGROUND_COLOR }}
        paddingY={3}
        paddingX={[3, 3, 5, 8, 12]}
      >
        <Text variant="h3" as="h2" color="white" marginBottom={3}>
          {formatMessage(m.home.title)}
        </Text>
        <GridRow>
          <GridColumn span={['1/1', '1/1', '1/1', '4/12']} paddingBottom={3}>
            <Text fontWeight="semiBold" color="white" marginBottom={1}>
              {formatMessage(m.footer.government)}
            </Text>
            <Text color="white">{formatMessage(m.footer.ministry)}</Text>
          </GridColumn>
          <GridColumn span={['1/1', '1/1', '1/1', '4/12']} paddingBottom={3}>
            <LinkV2
              href={`https://${formatMessage(m.footer.website)}`}
              color="white"
              underline="normal"
            >
              <Text color="white" variant="medium" marginBottom={1}>
                <span
                  style={{
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }}
                >
                  {formatMessage(m.footer.website)}
                </span>
              </Text>
            </LinkV2>
            <Text color="white" variant="medium">
              {formatMessage(m.footer.email)}
            </Text>
          </GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  )
}
