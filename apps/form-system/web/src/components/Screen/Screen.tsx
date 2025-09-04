import { Box, GridColumn, Text } from '@island.is/island-ui/core'
import { Footer } from '../Footer/Footer'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { SectionTypes } from '@island.is/form-system/ui'
import { ExternalData } from './components/ExternalData/ExternalData'
import { Summary } from './components/Summary/Summary'
import { Completed } from './components/Completed/Completed'
import { Field } from './components/Field/Field'
import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Applicants } from './components/Applicants/Applicants'
import { FormSystemApplicant } from '@island.is/api/schema'

export const Screen = () => {
  const { state } = useApplicationContext()
  const { lang } = useLocale()
  const { currentSection, currentScreen } = state
  const screenTitle = currentScreen
    ? currentScreen.data?.name?.[lang]
    : state.sections?.[currentSection.index]?.name?.[lang]
  const currentSectionType = state.sections?.[currentSection.index]?.sectionType
  const [externalDataAgreement, setExternalDataAgreement] = useState(
    state.sections?.[0].isCompleted ?? false,
  )

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
        <Text variant="h2" as="h2" marginBottom={1}>
          {currentSectionType !== SectionTypes.PREMISES &&
            currentSectionType !== SectionTypes.PARTIES &&
            screenTitle}
        </Text>
        {currentSectionType === SectionTypes.PREMISES && (
          <ExternalData setExternalDataAgreement={setExternalDataAgreement} />
        )}
        {currentSectionType === SectionTypes.PARTIES && (
          <Applicants
            applicantTypes={
              (state.application.applicantTypes?.filter(
                (item) => item !== null,
              ) as FormSystemApplicant[]) ?? []
            }
          />
        )}
        {currentSectionType === SectionTypes.SUMMARY &&
          !!state.application.hasSummaryScreen &&
          !currentSection?.data?.isHidden && <Summary state={state} />}

        {currentSectionType === SectionTypes.COMPLETED && <Completed />}
        {currentScreen &&
          currentScreen?.data?.fields
            ?.filter(
              (field): field is NonNullable<typeof field> =>
                field != null && !field.isHidden,
            )
            .map((field, index) => {
              return <Field field={field} key={index} />
            })}
      </GridColumn>
      <Footer externalDataAgreement={externalDataAgreement} />
    </Box>
  )
}
