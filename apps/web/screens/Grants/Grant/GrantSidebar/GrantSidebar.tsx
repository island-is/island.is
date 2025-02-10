import { useIntl } from 'react-intl'

import { Box, BoxProps, Button, LinkV2, Stack } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { InstitutionPanel } from '@island.is/web/components'
import { Grant } from '@island.is/web/graphql/schema'

import { m } from '../../messages'
import DetailPanel from './DetailPanel'
import ExtraPanel from './ExtraPanel'
import * as styles from '../Grant.css'

interface Props {
  grant: Grant
  locale: Locale
}

export const generateSidebarPanel = (
  data: Array<React.ReactElement>,
  background: BoxProps['background'],
) => {
  if (!data.length) {
    return undefined
  }
  return (
    <Box background={background} padding={3} borderRadius="large">
      <Stack space={2}>{data}</Stack>
    </Box>
  )
}

export const GrantSidebar = ({ grant, locale }: Props) => {
  const { formatMessage } = useIntl()

  const goBackToDashboard = () => {
    return (
      <Box printHidden className={styles.noUnderline}>
        <LinkV2 href={'/styrkjatorg/styrkir'}>
          <Button
            preTextIcon="arrowBack"
            preTextIconType="filled"
            size="small"
            type="button"
            variant="text"
            truncate
            as="span"
            unfocusable
          >
            {formatMessage(m.general.goBack)}
          </Button>
        </LinkV2>
      </Box>
    )
  }
  return (
    <>
      {goBackToDashboard()}

      <DetailPanel grant={grant} locale={locale} />
      <ExtraPanel grant={grant} />
      <InstitutionPanel
        institutionTitle={formatMessage(m.single.provider)}
        institution={
          grant.fund?.parentOrganization.title ??
          formatMessage(m.single.unknownInstitution)
        }
        img={grant.fund?.parentOrganization.logo?.url}
        locale={locale}
      />
    </>
  )
}
