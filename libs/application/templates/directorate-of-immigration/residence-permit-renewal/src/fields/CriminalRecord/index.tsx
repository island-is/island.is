import {
  getErrorViaPath,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { CriminalRecordItem } from '../../shared'
import { Box, Button } from '@island.is/island-ui/core'
import DescriptionText from '../../components/DescriptionText'
import { information, application as appmessages } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'
import { RecordRepeatableItem } from './RecordRepeatableItem'

export const CriminalRecord: FC<FieldBaseProps> = (props) => {
  const { application, errors } = props
  const [showItemTitle, setShowItemTitle] = useState(false)

  const { formatMessage } = useLocale()

  const [hasCriminalRecord, setHasCriminalRecord] = useState<string>(
    getValueViaPath(
      application.answers,
      'criminalRecord.hasCriminalRecord',
    ) as string,
  )

  const [applicantName, setApplicantName] = useState<string>(
    getValueViaPath(
      application.externalData,
      'nationalRegistry.data.fullName',
      '',
    ) as string,
  )

  const [selectedCountries, setSelectedCountries] = useState<
    CriminalRecordItem[]
  >(
    getValueViaPath(
      application.answers,
      'criminalRecord.selectedCriminalCountries',
      [],
    ) as CriminalRecordItem[],
  )

  console.log('application', application)

  const [filteredSelectedCountries, setFilteredSelectedCountries] = useState(
    selectedCountries.filter((x) => x.wasRemoved !== 'true'),
  )

  useEffect(() => {
    setFilteredSelectedCountries(
      selectedCountries.filter((x) => x.wasRemoved !== 'true'),
    )
  }, [selectedCountries])

  const handleAdd = () => {
    setSelectedCountries([
      ...selectedCountries,
      {
        countryId: '',
        wasRemoved: 'false',
        date: '',
        punishment: '',
        typeOfOffense: '',
      },
    ])
    setShowItemTitle(filteredSelectedCountries.length > 0)
  }

  const handleRemoveAll = () => {
    setSelectedCountries(
      selectedCountries.map((x) => {
        return { ...x, wasRemoved: 'true' }
      }),
    )
    setShowItemTitle(false)
  }

  const handleRemove = (pos: number) => {
    if (pos > -1) {
      setSelectedCountries(
        selectedCountries.map((country, index) => {
          if (index === pos) {
            return { ...country, wasRemoved: 'true' }
          }
          return country
        }),
      )
      setShowItemTitle(filteredSelectedCountries.length > 0)
    }
  }

  const addDataToCountryList = (
    field: string,
    value: any,
    newIndex: number,
  ) => {
    setSelectedCountries(
      selectedCountries.map((country, index) => {
        if (newIndex === index) {
          return { ...country, [field]: value }
        }
        return country
      }),
    )
  }

  const handleStayAbroadChange = (value: string) => {
    setHasCriminalRecord(value)

    if (value === NO) {
      handleRemoveAll()
    } else {
      handleAdd()
    }
  }

  return (
    <Box>
      <DescriptionText
        text={information.labels.criminalRecord.description}
        format={{ name: applicantName }}
        textProps={{
          as: 'p',
          paddingTop: 0,
          marginBottom: 3,
        }}
      />
      <DescriptionText
        text={information.labels.criminalRecord.title}
        textProps={{
          as: 'h5',
          fontWeight: 'semiBold',
          marginBottom: 3,
        }}
      />
      <RadioController
        id={'criminalRecord.hasCriminalRecord'}
        split="1/2"
        onSelect={(value) => {
          handleStayAbroadChange(value)
        }}
        error={
          errors && getErrorViaPath(errors, 'criminalRecord.hasCriminalRecord')
        }
        defaultValue={hasCriminalRecord}
        options={[
          {
            value: YES,
            label: formatMessage(appmessages.radioOptionYes),
          },
          {
            value: NO,
            label: formatMessage(appmessages.radioOptionNo),
          },
        ]}
      />

      <Box>
        {selectedCountries.map((field, index) => {
          const position = filteredSelectedCountries.indexOf(field)
          return (
            <RecordRepeatableItem
              id={`${props.field.id}.selectedCriminalCountries`}
              repeaterField={field}
              index={index}
              key={`criminalRecord-${index}`}
              handleRemove={handleRemove}
              itemNumber={position}
              addDataToCountryList={addDataToCountryList}
              showItemTitle={showItemTitle}
              {...props}
            />
          )
        })}
        {hasCriminalRecord === YES && (
          <Box paddingTop={2}>
            <Button
              variant="ghost"
              icon="add"
              iconType="outline"
              fluid
              size="large"
              onClick={handleAdd}
              textSize="md"
            >
              {formatMessage(information.labels.criminalRecord.buttonTitle)}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
