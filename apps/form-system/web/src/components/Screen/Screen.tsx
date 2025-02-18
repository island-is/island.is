import {
  Box,
  GridColumn,
  Text
} from '@island.is/island-ui/core'
import { Footer } from '../Footer/Footer'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { SectionTypes } from '@island.is/form-system/ui'
import { ExternalData } from './components/ExternalData/ExternalData'
import { Field } from './components/Field/Field'
import { useState } from 'react'

export const Screen = () => {
  const { state } = useApplicationContext()
  const { currentSection, currentScreen } = state
  const screenTitle = currentScreen
    ? state.screens?.[currentScreen.index]?.name?.is
    : state.sections?.[currentSection.index]?.name?.is
  const s = currentScreen ? state.screens[currentScreen?.index] : null

  const [externalDataAgreement, setExternalDataAgreement] = useState(state.sections?.[0].isCompleted ?? false)

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
          <ExternalData
            setExternalDataAgreement={setExternalDataAgreement}
          />
        )}
        {
          currentScreen && currentScreen?.data?.fields
            ?.filter((field) => field != null)
            .map((field, index) => {
              return (
                <Field field={field!} key={index} />
              )
            })
        }
      </GridColumn>
      <Footer
        externalDataAgreement={externalDataAgreement}
      />
    </Box>
  )

}