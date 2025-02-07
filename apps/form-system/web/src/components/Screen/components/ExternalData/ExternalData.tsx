import { Box, Icon, Text } from "@island.is/island-ui/core"
import { Markdown } from "../../../../../../../../libs/shared/components/src"
import { useApplicationContext } from "../../../../context/ApplicationProvider"


export const ExternalData = () => {
  const { state } = useApplicationContext()
  const { application } = state
  const { certificationTypes } = application

  return (
    <Box>
      <Box marginTop={2} marginBottom={5}>
        <Box display="flex" alignItems="center" justifyContent="flexStart">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            Gagnaöflun
          </Text>
        </Box>
      </Box>

      <Box marginBottom={5}>
        {certificationTypes?.map(certificationType => (
          <>
            <Text variant="h4" color="blue400">
              {certificationType?.certificationTypeId}
            </Text>

            <Text>
              <Markdown>
                {certificationType?.id ?? ''}
              </Markdown>
            </Text>
          </>
        ))}
      </Box>
    </Box>
  )
}