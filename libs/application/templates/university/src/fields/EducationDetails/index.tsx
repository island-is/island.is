import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DetailsRepeaterItem } from './DetailsRepeaterItem'
import { formerEducation } from '../../lib/messages/formerEducation'
import { getValueViaPath } from '@island.is/application/core'
import { EducationDetailsItem } from '../../shared/types'

export const EducationDetails: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  // TODO change any to correct type
  const [educationList, setEducationList] = useState<EducationDetailsItem[]>(
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
    const withWasRemoved = educationList.map((x) => {
      return {
        ...x,
        wasRemoved: 'false',
      }
    })
    setEducationList(withWasRemoved)
  }, [])

  useEffect(() => {
    setFilteredEducationList(
      educationList.filter((x) => x.wasRemoved !== 'true'),
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
    console.log('answers', application.answers)
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
      <Button icon="add" onClick={() => handleAdd()} variant="ghost" fluid>
        {formatMessage(
          formerEducation.labels.educationDetails.addMoreButtonTitle,
        )}
      </Button>
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
                addDataToEducationList={addDataToEducationList}
              />
              <Button
                icon="add"
                onClick={() => handleAdd()}
                variant="ghost"
                fluid
              >
                {formatMessage(
                  formerEducation.labels.educationDetails.addMoreButtonTitle,
                )}
              </Button>
            </Box>
          )
        }
      })}
    </Box>
  )
}
