import { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
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
import DescriptionText from '../../components/DescriptionText'
import { useLocale } from '@island.is/localization'
import { CountryOfResidenceViewModel } from '@island.is/clients/directorate-of-immigration'

interface ExtendedCountryProps extends CountryOfResidence {
  readOnly?: boolean
}

export const ResidenceCountries: FC<FieldBaseProps> = (props) => {
  const { application, errors } = props

  const { formatMessage } = useLocale()

  const preRegisteredCountries = getValueViaPath(
    application.externalData,
    'currentCountryOfResidenceList.data',
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
          (y) => y.countryId === parseInt(x.countryId),
        ) === -1,
    )

    const combinedLists = [
      ...preRegisteredCountries
        .filter((x) => !!x.countryId)
        .map((i) => {
          return {
            countryId: i.countryId?.toString(),
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

  const addCountryToList = (newCountry: string, newIndex: number) => {
    setSelectedCountries(
      selectedCountries.map((country, index) => {
        if (newIndex === index) {
          return {
            ...country,
            countryId: newCountry,
          }
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
      <DescriptionText
        text={information.labels.countriesOfResidence.questionTitle}
        textProps={{
          as: 'h5',
          fontWeight: 'semiBold',
          marginBottom: 3,
        }}
      />
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
          <DescriptionText
            text={information.labels.countriesOfResidence.countryListTitle}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              paddingTop: 3,
              marginBottom: 1,
            }}
          />
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
