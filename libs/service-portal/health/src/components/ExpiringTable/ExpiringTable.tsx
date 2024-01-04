import { Box, Table as T, Text } from '@island.is/island-ui/core'
import {
  DownloadFileButtons,
  LinkButton,
  m,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

interface Props {
  header: React.ReactNode
  children: React.ReactNode
  footnote: string
  link: string
  linkText: string
  onExport?: () => void
}

const ExpiringTable = ({
  header,
  children,
  footnote,
  link,
  linkText,
  onExport,
}: Props) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Box marginTop={2}>
        <T.Table>
          {header}
          <T.Body>{children}</T.Body>
        </T.Table>
        {onExport && (
          <DownloadFileButtons
            BoxProps={{
              paddingTop: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flexEnd',
            }}
            buttons={[
              {
                text: formatMessage(m.getAsExcel),
                onClick: onExport,
              },
            ]}
          />
        )}
      </Box>
      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {footnote}
        </Text>
        <LinkButton to={link} text={linkText} />
      </Box>
    </Box>
  )
}

export default ExpiringTable
