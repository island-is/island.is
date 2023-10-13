import { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { StaysAbroadRepeaterItem } from './StaysAbroadRepeaterItem'
import { CountryOfVisit } from '../../shared'
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

export const StaysAbroad: FC<FieldBaseProps> = (props) => {
  const { application, errors } = props
  const [showItemTitle, setShowItemTitle] = useState(false)

  const { formatMessage } = useLocale()

  const [hasStayedAbroad, setHasStayedAbroad] = useState<string>(
    getValueViaPath(
      application.answers,
      'staysAbroad.hasStayedAbroad',
    ) as string,
  )

  const [selectedCountries, setSelectedCountries] = useState<CountryOfVisit[]>(
    getValueViaPath(
      application.answers,
      'staysAbroad.selectedAbroadCountries',
      [],
    ) as CountryOfVisit[],
  )

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
        dateTo: '',
        dateFrom: '',
        purpose: '',
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
    value: string,
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
    setHasStayedAbroad(value)

    if (value === NO) {
      handleRemoveAll()
    } else {
      handleAdd()
    }
  }

  return (
    <Box>
      <DescriptionText
        text={information.labels.staysAbroad.pageSubTitle}
        textProps={{
          as: 'p',
          paddingTop: 0,
          marginBottom: 3,
        }}
      />
      <DescriptionText
        text={information.labels.staysAbroad.questionTitle}
        textProps={{
          as: 'h5',
          fontWeight: 'semiBold',
          marginBottom: 3,
        }}
      />
      <RadioController
        id={'staysAbroad.hasStayedAbroad'}
        split="1/2"
        onSelect={(value) => {
          handleStayAbroadChange(value)
        }}
        error={errors && getErrorViaPath(errors, 'staysAbroad.hasStayedAbroad')}
        defaultValue={hasStayedAbroad}
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
        {selectedCountries.map((field, index) => {
          const position = filteredSelectedCountries.indexOf(field)
          return (
            <StaysAbroadRepeaterItem
              id={`${props.field.id}.selectedAbroadCountries`}
              repeaterField={field}
              index={index}
              key={`staysAbroad-${index}`}
              handleRemove={handleRemove}
              itemNumber={position}
              addDataToCountryList={addDataToCountryList}
              showItemTitle={showItemTitle}
              {...props}
            />
          )
        })}
        {hasStayedAbroad === YES && (
          <Box paddingTop={2}>
            <Button
              variant="ghost"
              icon="add"
              iconType="outline"
              fluid
              size="large"
              onClick={handleAdd}
            >
              {formatMessage(information.labels.staysAbroad.buttonTitle)}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
