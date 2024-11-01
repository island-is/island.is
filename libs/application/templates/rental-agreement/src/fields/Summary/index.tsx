import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import { CopyLink } from '@island.is/application/ui-components'
import { gridRow, sectionWrapper, summaryWrapper } from './summaryStyles.css'
import { summary } from '../../lib/messages'
import { KeyValue } from './KeyValue'

export const Summary: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()

  return (
    <Box className={summaryWrapper}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {formatMessage(summary.pageTitle)}
      </Text>
      <Text>{formatMessage(summary.pageDescription)}</Text>
      <Box marginTop={5} className={sectionWrapper}>
        <GridRow className={gridRow}>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Upphafsdagur samnings'} value={'Value'} />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Leigutímabil'} value={'Value'} />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Uppsagnafrestur'} value={'Value'} />
          </GridColumn>
        </GridRow>

        <GridRow className={gridRow}>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Leiguupphæð'} value={'Value'} />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Trygging'} value={'Value'} />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Tegund'} value={'Value'} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Rafmagnskostnaður'} value={'Value'} />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Hitakostnaður'} value={'Value'} />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue label={'Hússjóður'} value={'Value'} />
          </GridColumn>
        </GridRow>
      </Box>
      <Box marginTop={2}>
        <CopyLink
          linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.RentalAgreement.slug}/${application.id}`}
          buttonTitle={'Afrita hlekk'}
        />
      </Box>
    </Box>
  )
}
