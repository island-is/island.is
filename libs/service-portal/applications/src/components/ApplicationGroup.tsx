import { Text } from '@island.is/island-ui/core'
import { getBaseUrlForm } from '../shared/utils'
import { ApplicationList as List } from '@island.is/application/ui-components'
import { Application } from '@island.is/application/types'

export const applicationGroup = (
  applications: Application[],
  label: string,
  organizations: any,
  refetch: () => void,
) => {
  return (
    <>
      <Text paddingTop={4} paddingBottom={3} variant="eyebrow">
        {label}
      </Text>
      <List
        organizations={organizations}
        applications={applications}
        refetch={refetch}
        onClick={(applicationUrl) =>
          window.open(`${getBaseUrlForm()}/${applicationUrl}`)
        }
      />
    </>
  )
}
