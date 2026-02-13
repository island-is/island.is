import { FormSystemField } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/ui'
import { AlertMessage, Box, GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Footer } from '../Footer/Footer'
import { Applicants } from './components/Applicants/Applicants'
import { Completed } from './components/Completed/Completed'
import { ExternalData } from './components/ExternalData/ExternalData'
import { Field } from './components/Field/Field'
import { Summary } from './components/Summary/Summary'

export const Screen = () => {
  const { state } = useApplicationContext()
  const { lang } = useLocale()
  const { currentSection, currentScreen } = state

  const screenTitle =
    currentScreen?.data?.name?.[lang] ??
    (currentSection?.data?.sectionType === SectionTypes.COMPLETED
      ? null
      : state.sections?.[currentSection?.index]?.name?.[lang] ?? '')

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
        {state.screenError && state.screenError.hasError && (
          <Box marginBottom={[4, 4, 5]}>
            <AlertMessage
              type="error"
              title={state.screenError.title?.[lang]}
              message={
                <Text variant="small" whiteSpace="breakSpaces">
                  {state.screenError.message?.[lang]}
                </Text>
              }
            />
          </Box>
        )}

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
            applicantField={currentScreen?.data?.fields?.[0] as FormSystemField}
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
