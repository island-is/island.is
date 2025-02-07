import {
  Box,
  GridColumn,
  Text
} from '@island.is/island-ui/core'
import { Footer } from '../Footer/Footer'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { SectionTypes } from '@island.is/form-system/ui'
import { ExternalData } from './components/ExternalData/ExternalData'

interface Props {
  screenTitle: string
}


export const Screen = () => {
  const { state } = useApplicationContext()
  const { currentSection, currentScreen } = state
  const screenTitle = currentScreen
    ? state.screens?.[currentScreen.index]?.name?.is
    : state.sections?.[currentSection.index]?.name?.is

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <GridColumn
        span={['12/12', '12/12', '10/12', '7/9']}
        offset={['0', '0', '1/12', '1/9']}
      >
        <Text
          variant="h2"
          as="h2"
          marginBottom={1}
        >
          {state.sections?.[currentSection.index]?.sectionType !== SectionTypes.PREMISES && screenTitle}
        </Text>
        {state.sections?.[currentSection.index]?.sectionType === SectionTypes.PREMISES && (
          <ExternalData />
        )}
      </GridColumn>
      <Footer />
    </Box>
  )

}