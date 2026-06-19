import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import { FormStepper } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../lib/utils/interfaces'
import { Preview } from '../Preview/Preview'
import { MultiSet } from './components/MultiSet'
import * as styles from './PreviewStepOrGroup.css'

interface Props {
  setOpenPreview: Dispatch<SetStateAction<boolean>>
}

export const PreviewStepOrGroup = ({ setOpenPreview }: Props) => {
  const { control, setSelectStatus } = useContext(ControlContext)
  const { lang } = useLocale()
  const { activeItem, form } = control
  const { screens, fields } = form
  const { type } = activeItem

  useEffect(() => {
    setSelectStatus(NavbarSelectStatus.ON_WITHOUT_SELECT)
  }, [])

  const renderScreen = (screen: FormSystemScreen) => (
    <Box key={screen?.id} marginBottom={6}>
      <Text variant="h2" as="h2" marginBottom={1}>
        {screen?.name?.[lang]}
      </Text>
      {screen?.multiMax && screen.multiMax > 0 ? (
        <MultiSet screen={screen} />
      ) : (
        fields
          ?.filter((field) => field?.screenId === screen?.id)
          .map((field) => (
            <Preview
              key={field?.id}
              data={field as FormSystemField}
              screenOrSection={true}
            />
          ))
      )}
    </Box>
  )

  const sectionScreens =
    screens?.filter((screen) => screen?.sectionId === activeItem?.data?.id) ??
    []

  const stepperSections: FormSystemSection[] = (form.sections ?? [])
    .filter((section): section is FormSystemSection => !!section)
    .map((section) => ({
      ...section,
      screens: (screens ?? [])
        .filter((screen) => screen?.sectionId === section.id)
        .map((screen) => ({
          ...(screen as FormSystemScreen),
          fields: (fields ?? []).filter(
            (field) => field?.screenId === screen?.id,
          ),
        })),
    }))

  const activeSection =
    type === 'Screen'
      ? stepperSections.find((section) =>
          section.screens?.some(
            (screen) => screen?.id === activeItem?.data?.id,
          ),
        )
      : stepperSections.find((section) => section.id === activeItem?.data?.id)
  const activeScreen =
    type === 'Screen' ? (activeItem.data as FormSystemScreen) : undefined

  return (
    <Box display="flex" flexDirection="column" height="full">
      <Box
        position="relative"
        paddingTop={[3, 6, 10]}
        paddingBottom={[3, 6, 10]}
        borderRadius="large"
        background="white"
      >
        <ModalBase
          baseId="formStepperPreview"
          modalLabel="Skref"
          className={styles.stepperPanel}
          renderDisclosure={(disclosure) => (
            <Box position="absolute" style={{ top: 16, right: 8 }}>
              {disclosure}
            </Box>
          )}
          disclosure={
            <Button
              circle
              icon="arrowBack"
              variant="ghost"
              aria-label="Sýna skref"
            />
          }
        >
          {({ closeModal }) => (
            <Box background="white" height="full" padding={[3, 6, 8]}>
              <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
                <Button
                  circle
                  icon="close"
                  variant="ghost"
                  size="small"
                  aria-label="Loka"
                  onClick={closeModal}
                />
              </Box>
              <FormStepper
                sections={stepperSections}
                currentSection={{
                  data: activeSection,
                  index: stepperSections.findIndex(
                    (section) => section.id === activeSection?.id,
                  ),
                }}
                currentScreen={
                  activeScreen ? { data: activeScreen } : undefined
                }
                hasSummaryScreen={form.hasSummaryScreen ?? false}
                hasPayment={form.hasPayment ?? false}
                submitted={false}
              />
            </Box>
          )}
        </ModalBase>
        <GridColumn
          span={['12/12', '12/12', '10/12', '7/9']}
          offset={['0', '0', '1/12', '1/9']}
        >
          {type === 'Section' &&
            sectionScreens.map((screen, index) => (
              <Box key={screen?.id}>
                {index > 0 && (
                  <Box paddingTop={6} paddingBottom={6}>
                    <Divider />
                  </Box>
                )}
                {renderScreen(screen as FormSystemScreen)}
              </Box>
            ))}
          {type === 'Screen' &&
            activeItem.data &&
            renderScreen(activeItem.data as FormSystemScreen)}
        </GridColumn>
      </Box>
      <Box display="flex" justifyContent="flexEnd" marginTop={2}>
        <Button
          onClick={() => {
            setSelectStatus(NavbarSelectStatus.OFF)
            setOpenPreview(false)
          }}
        >
          Loka
        </Button>
      </Box>
    </Box>
  )
}
