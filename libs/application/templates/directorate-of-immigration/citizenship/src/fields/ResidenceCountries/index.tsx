import { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { ResidenceCountriesRepeaterItem } from './ResidenceCountriesRepeaterItem'
import { CountryOfResidence } from '../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { RadioController } from '@island.is/shared/form-fields'
import { information } from '../../lib/messages'
import DescriptionText from '../../components/DescriptionText'
import { useLocale } from '@island.is/localization'

export const ResidenceCountries: FC<FieldBaseProps> = (props) => {
  const { application, setBeforeSubmitCallback } = props

  const { formatMessage } = useLocale()

  const [hasLivedAbroad, setHasLivedAbroad] = useState<string>(
    getValueViaPath(
      application.answers,
      'countriesOfResidence.hasLivedAbroad',
    ) as string,
  )

  const [selectedCountries, setSelectedCountries] = useState<
    CountryOfResidence[]
  >(
    getValueViaPath(
      application.answers,
      'countriesOfResidence.selectedAbroadCountries',
      [],
    ) as CountryOfResidence[],
  )

  const [filteredSelectedCountries, setFilteredSelectedCountries] = useState(
    selectedCountries.filter((x) => x.wasRemoved !== 'true'),
  )

  useEffect(() => {
    setFilteredSelectedCountries(
      selectedCountries.filter((x) => x.wasRemoved !== 'true'),
    )
  }, [selectedCountries])

  const handleAdd = () =>
    setSelectedCountries([
      ...selectedCountries,
      {
        country: '',
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
          return { ...country, country: newCountry }
        }
        return country
      }),
    )
  }

  const handleLiveAbroadChange = (value: string) => {
    setHasLivedAbroad(value)

    if (value === 'No') {
      handleRemoveAll()
    } else {
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
      {/* TODO vantar að gera kassa rauðan ef tómt */}
      <RadioController
        id={'countriesOfResidence.hasLivedAbroad'}
        split="1/2"
        onSelect={(value) => {
          handleLiveAbroadChange(value)
        }}
        defaultValue={hasLivedAbroad}
        options={[
          {
            value: 'Yes',
            label: formatMessage(
              information.labels.radioButtons.radioOptionYes,
            ),
          },
          {
            value: 'No',
            label: formatMessage(information.labels.radioButtons.radioOptionNo),
          },
        ]}
      />

      <Box>
        {hasLivedAbroad === 'Yes' && (
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
              {...props}
            />
          )
        })}

        {hasLivedAbroad === 'Yes' && (
          <Box paddingTop={4}>
            <Button
              variant="ghost"
              icon="add"
              iconType="outline"
              fluid
              size="large"
              onClick={handleAdd}
              textSize="md"
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
