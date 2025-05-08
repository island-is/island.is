import { FC, useEffect, useState } from 'react'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { ResidenceCountriesRepeaterItem } from './ResidenceCountriesRepeaterItem'
import { CountryOfResidence } from '../../shared'
import {
  getErrorViaPath,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { RadioController } from '@island.is/shared/form-fields'
import { information } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { CountryOfResidenceViewModel } from '@island.is/clients/directorate-of-immigration'
import { DescriptionFormField } from '@island.is/application/ui-fields'

interface ExtendedCountryProps extends CountryOfResidence {
  readOnly?: boolean
}

export const ResidenceCountries: FC<FieldBaseProps> = (props) => {
  const { application, errors } = props

  const { formatMessage } = useLocale()

  const preRegisteredCountries = getValueViaPath(
    application.externalData,
    'applicantInformation.data.currentCountryOfResidenceList',
    [],
  ) as CountryOfResidenceViewModel[]

  const [hasLivedAbroad, setHasLivedAbroad] = useState<string>(
    getValueViaPath(
      application.answers,
      'countriesOfResidence.hasLivedAbroad',
      preRegisteredCountries.length > 0 ? YES : '',
    ) as string,
  )

  const [selectedCountries, setSelectedCountries] = useState<
    ExtendedCountryProps[]
  >(
    getValueViaPath(
      application.answers,
      'countriesOfResidence.selectedAbroadCountries',
      [],
    ) as ExtendedCountryProps[],
  )

  const [filteredSelectedCountries, setFilteredSelectedCountries] = useState<
    Array<ExtendedCountryProps>
  >([])

  useEffect(() => {
    const notDuplicateAnswers = selectedCountries.filter(
      (x) =>
        preRegisteredCountries.findIndex(
          (y) =>
            y.countryId === parseInt(x.countryId) &&
            y.dateFrom === x.dateFrom &&
            y.dateTo === x.dateTo,
        ) === -1,
    )

    const combinedLists = [
      ...preRegisteredCountries
        .filter((x) => !!x.countryId)
        .map((i) => {
          return {
            countryId: i.countryId?.toString(),
            dateTo: i.dateTo ?? '',
            dateFrom: i.dateFrom ?? '',
            wasRemoved: 'false',
            readOnly: true,
          } as ExtendedCountryProps
        }),
      ...notDuplicateAnswers,
    ]
    setSelectedCountries(combinedLists)
  }, [])

  useEffect(() => {
    setFilteredSelectedCountries(
      selectedCountries.filter((x) => x.wasRemoved !== 'true'),
    )
  }, [selectedCountries])

  const handleAdd = () =>
    setSelectedCountries([
      ...selectedCountries,
      {
        countryId: '',
        dateTo: '',
        dateFrom: '',
        wasRemoved: 'false',
      },
    ])

  const handleRemoveAll = () => {
    setSelectedCountries(
      selectedCountries.map((x) => {
        return { ...x, wasRemoved: 'true' }
      }),
    )
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
    }
  }

  const addCountryToList = (field: string, value: string, newIndex: number) => {
    setSelectedCountries(
      selectedCountries.map((country, index) => {
        if (newIndex === index) {
          return { ...country, [field]: value }
        }
        return country
      }),
    )
  }

  const handleLiveAbroadChange = (value: string) => {
    setHasLivedAbroad(value)

    if (value === NO) {
      handleRemoveAll()
    } else if (preRegisteredCountries.length === 0) {
      handleAdd()
    }
  }

  return (
    <Box>
      <Box marginBottom={3}>
        {DescriptionFormField({
          application: application,
          showFieldName: false,
          field: {
            id: 'title',
            title: '',
            description: formatMessage(
              information.labels.countriesOfResidence.questionTitle,
            ),
            titleVariant: 'h5',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}
      </Box>

      <RadioController
        id={'countriesOfResidence.hasLivedAbroad'}
        split="1/2"
        onSelect={(value) => {
          handleLiveAbroadChange(value)
        }}
        disabled={preRegisteredCountries.length > 0}
        error={
          errors &&
          getErrorViaPath(errors, 'countriesOfResidence.hasLivedAbroad')
        }
        defaultValue={hasLivedAbroad}
        options={[
          {
            value: YES,
            label: formatMessage(
              information.labels.radioButtons.radioOptionYes,
            ),
          },
          {
            value: NO,
            label: formatMessage(information.labels.radioButtons.radioOptionNo),
          },
        ]}
      />

      <Box>
        {hasLivedAbroad === YES && (
          <Box marginBottom={1} paddingTop={2}>
            <Text variant="h5">
              {formatMessage(
                information.labels.countriesOfResidence.countryListTitle,
              )}
            </Text>
          </Box>
        )}
        {selectedCountries.map((field, index) => {
          const position = filteredSelectedCountries.indexOf(field)
          return (
            <ResidenceCountriesRepeaterItem
              id={`${props.field.id}.selectedAbroadCountries`}
              repeaterField={field}
              index={index}
              key={`countrySelect-${index}`}
              handleRemove={handleRemove}
              itemNumber={position}
              addCountryToList={addCountryToList}
              readOnly={field.readOnly}
              {...props}
            />
          )
        })}

        {hasLivedAbroad === YES && (
          <Box paddingTop={4}>
            <Button
              variant="ghost"
              icon="add"
              iconType="outline"
              fluid
              size="large"
              onClick={handleAdd}
            >
              {formatMessage(
                information.labels.countriesOfResidence.buttonTitle,
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
