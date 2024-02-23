import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DetailsRepeaterItem } from './DetailsRepeaterItem'
import { formerEducation } from '../../lib/messages/formerEducation'
import { getValueViaPath } from '@island.is/application/core'
import { EducationDetailsItem } from '../../shared/types'
import { InlineResponse200Items } from '@island.is/clients/inna'

interface ExtendedEducationDetailsProps extends EducationDetailsItem {
  readOnly?: boolean
}

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

  const [educationList, setEducationList] = useState<
    ExtendedEducationDetailsProps[]
  >(
    getValueViaPath(
      application.answers,
      'educationDetails',
      [],
    ) as EducationDetailsItem[],
  )

  const [filteredEducationList, setFilteredEducationList] = useState<
    Array<EducationDetailsItem>
  >([])

  useEffect(() => {
    const combinedLists = [
      ...predefinedInnaData.map((i) => {
        return {
          school: i.organisation || '',
          degreeLevel: 'framhaldsskoli',
          degreeCountry: 'IS',
          degreeMajor: i.diplomaLongName || '',
          finishedUnits: i.diplomaCreditsTotal || 0,
          beginningDate: '',
          endDate: i.diplomaDate || '',
          degreeAttachments: [],
          wasRemoved: 'true',
          readOnly: true,
        } as ExtendedEducationDetailsProps
      }),
      ...educationList,
    ]
    setEducationList(combinedLists)
  }, [])

  useEffect(() => {
    setFilteredEducationList(
      educationList.filter((x) => x.wasRemoved !== 'true' || x.readOnly), // Remove all manual answers that have been removed, but keep in the readOnly data from Inna even though it's marked wasRemoved, that is done to avoid duplicates
    )
  }, [educationList])

  const handleAdd = () => {
    setEducationList([
      ...educationList,
      {
        school: '',
        degreeLevel: '',
        degreeCountry: '',
        beginningDate: '',
        endDate: '',
        degreeAttachments: [],
        wasRemoved: 'false',
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
      {educationList.map((educationItem, index) => {
        const position = filteredEducationList.indexOf(educationItem)

        if (index > 0) {
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
                readOnly={educationItem.readOnly}
                addDataToEducationList={addDataToEducationList}
              />
            </Box>
          )
        }
      })}
      <Button icon="add" onClick={() => handleAdd()} variant="ghost" fluid>
        {formatMessage(
          formerEducation.labels.educationDetails.addMoreButtonTitle,
        )}
      </Button>
    </Box>
  )
}
