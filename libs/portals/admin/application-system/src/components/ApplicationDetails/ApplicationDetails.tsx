import {
  ActionCard,
  Box,
  GridColumn,
  GridRow,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import format from 'date-fns/format'
import { PropsWithChildren } from 'react'
import { statusMapper } from '../../shared/utils'
import { AdminApplication } from '../../types/applications'

interface ValueLineProps {
  title?: string
}

const ValueLine = ({ title, children }: PropsWithChildren<ValueLineProps>) => {
  return (
    <>
      {title && (
        <Text variant="h5" marginBottom={1}>
          {title}
        </Text>
      )}
      <Text>{children}</Text>
    </>
  )
}

interface Props {
  application: AdminApplication
}

export const ApplicationDetails = ({ application }: Props) => {
  const { formatMessage } = useLocale()
  const tag = statusMapper[application.status]
  const logo = getOrganizationLogoUrl(
    application.institution ?? 'stafraent-island',
    [],
  )

  return (
    <Box>
      <Box display="flex" alignItems="center" marginBottom={[2, 2, 3]}>
        <Icon icon="person" color="blue400" type="outline" />
        <Box paddingLeft={2} />
        <Text variant="h3">Umsækjandi</Text>
      </Box>
      <Box padding={4} background="blue100" borderRadius="large">
        <GridRow rowGap={3}>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Nafn">
              {application.applicantName ?? 'Vantar nafn'}
            </ValueLine>
          </GridColumn>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Kennitala">{application.applicant}</ValueLine>
          </GridColumn>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Netfang">nafn@simnet.is</ValueLine>
          </GridColumn>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Sími">8486525</ValueLine>
          </GridColumn>
        </GridRow>
      </Box>
      {/* TODO: Only display this if applicant has procurer */}
      <Box
        display="flex"
        alignItems="center"
        marginBottom={[2, 2, 3]}
        marginTop={[5, 5, 6]}
      >
        <Icon icon="person" color="purple600" type="outline" />
        <Box paddingLeft={2} />
        <Text variant="h3">Umboðshafi</Text>
      </Box>
      <Box padding={4} background="purple100" borderRadius="large">
        <GridRow rowGap={3}>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Nafn">Sigríður Jónsdóttir</ValueLine>
          </GridColumn>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Kennitala">2204774474</ValueLine>
          </GridColumn>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Netfang">sigridur@simnet.is</ValueLine>
          </GridColumn>
          <GridColumn span={['2/2', '2/2', '1/2']}>
            <ValueLine title="Sími">8486525</ValueLine>
          </GridColumn>
        </GridRow>
      </Box>
      <Text variant="h3" marginBottom={[2, 2, 3]} marginTop={[5, 5, 6]}>
        Umsókn
      </Text>
      <ActionCard
        cta={{ label: '' }}
        heading={application.name ?? undefined}
        date={format(new Date(application.created), 'dd.MM.yyyy')}
        logo={logo}
        tag={{
          label: formatMessage(tag.label),
          variant: tag.variant,
          outlined: false,
        }}
      />
    </Box>
  )
}
