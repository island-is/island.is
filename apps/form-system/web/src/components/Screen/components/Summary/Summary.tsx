import { Box, Text } from '@island.is/island-ui/core'
import { ApplicationState, TextBoxDisplay } from '@island.is/form-system/ui'
import { useLocale } from '@island.is/localization'
import { Divider } from '@island.is/island-ui/core'
import { Display } from '../Display/Display'

interface Props {
  state?: ApplicationState
}

export const Summary = ({ state }: Props) => {
    console.log("fields", state)
      const { lang } = useLocale()
    return (
        <Box marginTop={2}>
          <Text fontWeight='light' as="p" >Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn</Text>
            {state?.screens?.map((screen, index) => (
                <Box key={index} marginTop={5}>
                  <Divider />
                  {
                    screen?.fields
                      ?.filter(
                        (field): field is NonNullable<typeof field> =>
                          field != null && !field.isHidden,
                        )
                        .map((field, index) => {
                          return <Display field={field} key={index} />
                        })}
            </Box>
            ))}
        </Box>
    )
}