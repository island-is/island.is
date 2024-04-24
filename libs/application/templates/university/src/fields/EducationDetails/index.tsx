import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DetailsRepeaterItem } from './DetailsRepeaterItem'
import { formerEducation } from '../../lib/messages/formerEducation'
import { getValueViaPath } from '@island.is/application/core'
import { EducationDetailsItem } from '../../shared/types'
import { InlineResponse200Items } from '@island.is/clients/inna'
import { ApplicationTypes } from '@island.is/university-gateway'

export const EducationDetails: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const predefinedInnaData = getValueViaPath(
    application.externalData,
    'innaEducation.data',
    [],
  ) as Array<InlineResponse200Items>

  const [educationList, setEducationList] = useState<EducationDetailsItem[]>(
    getValueViaPath(
      application.answers,
      'educationDetails.finishedDetails',
      [],
    ) as EducationDetailsItem[],
  )

  const educationOptionAnswer = getValueViaPath(
    application.answers,
    'educationOptions',
    '',
  ) as string

  const [filteredEducationList, setFilteredEducationList] = useState<
    Array<EducationDetailsItem>
  >([])

  useEffect(() => {
    if (predefinedInnaData.length > 0) {
      const combinedLists = [
        ...predefinedInnaData.map((i) => {
          return {
            school: i.organisation || '',
            degreeLevel: formatMessage(
              formerEducation.labels.educationDetails
                .framhaldsskoliSelectionLabel,
            ),
            degreeCountry: 'Ísland',
            degreeMajor: i.diplomaLongName || '',
            finishedUnits: i.diplomaCreditsTotal?.toString(),
            beginningDate: '',
            endDate: i.diplomaDate || '',
            degreeAttachments: [],
            wasRemoved: 'true',
            readOnly: 'true',
          } as EducationDetailsItem
        }),
        ...educationList.filter((x) => x.readOnly === 'false'),
      ]
      setEducationList(combinedLists)
    } else if (
      educationOptionAnswer === ApplicationTypes.DIPLOMA &&
      educationList.length === 0
    ) {
      handleAdd()
    }
  }, [])

  useEffect(() => {
    setFilteredEducationList(
      educationList.filter(
        (x) => x.wasRemoved !== 'true' || x.readOnly === 'true',
      ), // Remove all manual answers that have been removed, but keep in the readOnly data from Inna even though it's marked wasRemoved, that is done to avoid duplicates
    )
  }, [educationList])

  const handleAdd = () => {
    setEducationList([
      ...educationList,
      {
        school: '',
        degreeLevel: '',
        degreeCountry: '',
        degreeMajor: '',
        finishedUnits: '',
        beginningDate: '',
        endDate: '',
        degreeAttachments: [],
        wasRemoved: 'false',
        readOnly: 'false',
      },
    ])
  }
  const handleRemove = (pos: number) => {
    if (pos > -1) {
      setEducationList(
        educationList.map((education, index) => {
          if (index === pos) {
            return { ...education, wasRemoved: 'true' }
          }
          return education
        }),
      )
    }
  }

  const addDataToEducationList = (
    field: string,
    value: string,
    newIndex: number,
  ) => {
    setEducationList(
      educationList.map((education, index) => {
        if (newIndex === index) {
          return { ...education, [field]: value }
        }
        return education
      }),
    )
  }

  return (
    <Box paddingTop={2}>
      {educationList &&
        educationList.map((educationItem, index) => {
          const position = filteredEducationList.indexOf(educationItem)
          const removeable =
            (position > 0 && educationItem.readOnly !== 'true') ||
            (educationOptionAnswer !== '' &&
              educationOptionAnswer !== ApplicationTypes.DIPLOMA)
          return (
            <Box paddingTop={3}>
              <DetailsRepeaterItem
                key={`educationDetails-${index}`}
                id={field.id}
                application={application}
                goToScreen={goToScreen}
                repeaterField={educationItem}
                field={field}
                index={index}
                handleRemove={handleRemove}
                itemNumber={position}
                readOnly={educationItem.readOnly === 'true'}
                addDataToEducationList={addDataToEducationList}
                removeable={removeable}
              />
            </Box>
          )
        })}
      <Button icon="add" onClick={() => handleAdd()} variant="ghost" fluid>
        {formatMessage(
          formerEducation.labels.educationDetails.addMoreButtonTitle,
        )}
      </Button>
    </Box>
  )
}
