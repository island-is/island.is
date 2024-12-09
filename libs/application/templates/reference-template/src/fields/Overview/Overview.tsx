import { FieldBaseProps, StaticText } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ReviewGroup } from '@island.is/application/ui-components'
import { States } from '../../utils/constants'

type TableRepeaterAnswers = {
  fullName: string
  nationalId: string
  relation: string
}

const KeyValue = ({ label, value }: { label: StaticText; value: string }) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text variant="h4" as="h4">
        {formatMessage(label)}
      </Text>
      <Text>{value}</Text>
    </Box>
  )
}

export const Overview = ({ application, goToScreen }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const tableRepeaterAnswers = getValueViaPath<Array<TableRepeaterAnswers>>(
    application.answers,
    'tableRepeater',
  )

  return (
    <Box component="section" paddingTop={2}>
      <Text title={formatText(m.overviewTitle, application, formatMessage)} />
      <ReviewGroup
        editAction={() => changeScreens('tableRepeater')}
        isEditable={application.state === States.DRAFT}
      >
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '5/12']}>
            <Text variant="h3" marginBottom={2}>
              Values from the table repeater
            </Text>
            {tableRepeaterAnswers &&
              tableRepeaterAnswers.map((ans, i) => {
                return (
                  <KeyValue
                    key={i}
                    label={`Value ${i + 1}`}
                    value={`${ans.fullName} - ${ans.nationalId} - ${ans.relation}`}
                  />
                )
              })}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      {/* More review groups as needed... */}
    </Box>
  )
}
