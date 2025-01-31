import { FieldBaseProps, OverviewField } from '@island.is/application/types'
import { ReviewGroup } from '@island.is/application/ui-components'
import { Box, Text } from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  field: OverviewField
}

export const OverviewFormField = ({
  field,
  application,
  goToScreen,
}: Props) => {
  const sections = field.sections(application.answers, application.externalData)

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }
  return (
    <Box>
      {sections.map((section, i) => {
        console.log(section)
        const type = section.type
        const items = section.items
        return (
          <Box key={i}>
            <ReviewGroup editAction={() => changeScreens(section.backId ?? '')}>
              {type === 'keyValue' && items
                ? items.map((item, i) => {
                    console.log(item)
                    return (
                      <Box key={i}>
                        <Box>
                          <Text variant="h4" as="h4">
                            blah
                          </Text>
                        </Box>
                      </Box>
                    )
                  })
                : 'adsf'}
            </ReviewGroup>
          </Box>
        )
      })}
    </Box>
  )
}
