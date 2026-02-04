import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  GridContainer,
} from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import { ApplicationState } from '@island.is/form-system/ui'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import { useIntl } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { Divider } from '@island.is/island-ui/core'
import { Display } from '../Display/Display'
import { SectionTypes } from '@island.is/form-system/ui'
import { UPDATE_APPLICATION_SETTINGS } from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'

interface Props {
  state?: ApplicationState
}

export const Summary = ({ state }: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { dispatch } = useApplicationContext()

  const updateCompleted = useMutation(UPDATE_APPLICATION_SETTINGS)

  const handleButtonClick = (sectionIndex?: number, screenIndex?: number) => {
    dispatch({
      type: 'INDEX_SCREEN',
      payload: {
        screenIndex: screenIndex,
        sectionIndex: sectionIndex,
        updateCompleted,
      },
    })
  }

  const sections = state?.sections?.filter(
    (s) =>
      !s?.isHidden &&
      s.sectionType !== SectionTypes.PAYMENT &&
      s.sectionType !== SectionTypes.COMPLETED &&
      s.sectionType !== SectionTypes.SUMMARY,
  )

  return (
    <Box marginTop={2}>
      <Text fontWeight="light" as="p">
        {formatMessage(m.reviewApplication)}
      </Text>
      {sections?.map((section, sectionIndex) =>
        section?.screens
          ?.filter((scr) => !scr?.isHidden)
          .map((screen, screenIndex) => (
            <Box
              key={screen?.id ?? `screen-${sectionIndex}-${screenIndex}`}
              marginTop={2}
            >
              <Divider />
              <GridContainer>
                <GridRow>
                  <GridColumn span={['12/12', '1/2']}>
                    <Box marginTop={2}>
                      {section.sectionType === SectionTypes.PARTIES ? (
                        <Text as="h3" variant="h3" fontWeight="semiBold">
                          {screen?.fields?.[0]?.name?.[lang] ??
                            screen?.name?.[lang]}
                        </Text>
                      ) : (
                        <Text as="h3" variant="h3" fontWeight="semiBold">
                          {screen?.name?.[lang] ?? ''}
                        </Text>
                      )}
                    </Box>
                    <Box
                      display={['flex', 'none']}
                      marginTop={2}
                      marginBottom={2}
                      justifyContent={'flexStart'}
                    >
                      <Button
                        icon="pencil"
                        iconType="filled"
                        variant="utility"
                        inline={true}
                        onClick={() => {
                          handleButtonClick(
                            sectionIndex ?? -1,
                            section.sectionType === SectionTypes.PARTIES
                              ? screen?.displayOrder ?? -1
                              : screenIndex ?? -1,
                          )
                        }}
                      >
                        {formatMessage(m.edit)}
                      </Button>
                    </Box>
                    <Box>
                      {screen?.fields
                        ?.filter(
                          (field): field is NonNullable<typeof field> =>
                            field != null && !field.isHidden,
                        )
                        .map((field, index) => (
                          <Display field={field} key={index} />
                        ))}
                    </Box>
                  </GridColumn>
                  <GridColumn span={['12/12', '1/2']}>
                    <Box
                      display={['none', 'flex']}
                      marginTop={4}
                      justifyContent={'flexEnd'}
                    >
                      <Button
                        icon="pencil"
                        iconType="filled"
                        variant="utility"
                        inline={true}
                        onClick={() => {
                          handleButtonClick(
                            sectionIndex ?? -1,
                            section.sectionType === SectionTypes.PARTIES
                              ? screen?.displayOrder ?? -1
                              : screenIndex ?? -1,
                          )
                        }}
                      >
                        {formatMessage(m.edit)}
                      </Button>
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          )),
      )}
    </Box>
  )
}
