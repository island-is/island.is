import { FC, useEffect, useState } from 'react'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
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
import { useLocale } from '@island.is/localization'
import { ResidenceAbroadViewModel } from '@island.is/clients/directorate-of-immigration'
import { DescriptionFormField } from '@island.is/application/ui-fields'

interface ExtendedCountryProps extends CountryOfVisit {
  readOnly?: boolean
}

export const StaysAbroad: FC<FieldBaseProps> = (props) => {
  const { application, errors } = props
  const [showItemTitle, setShowItemTitle] = useState(false)

  const { formatMessage } = useLocale()

  const preRegisteredCountries = getValueViaPath(
    application.externalData,
    'currentStayAbroadList.data',
    [],
  ) as ResidenceAbroadViewModel[]

  const [hasStayedAbroad, setHasStayedAbroad] = useState<string>(
    getValueViaPath(
      application.answers,
      'staysAbroad.hasStayedAbroad',
      preRegisteredCountries.length > 0 ? YES : '',
    ) as string,
  )

  const [selectedCountries, setSelectedCountries] = useState<
    ExtendedCountryProps[]
  >(
    getValueViaPath(
      application.answers,
      'staysAbroad.selectedAbroadCountries',
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
            dateTo: i.dateTo,
            dateFrom: i.dateFrom,
            purpose: i.purposeOfStay,
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
      <Box marginBottom={3}>
        {DescriptionFormField({
          application: application,
          showFieldName: false,
          field: {
            id: 'title',
            title: '',
            description: formatMessage(
              information.labels.staysAbroad.pageSubTitle,
            ),
            titleVariant: 'h5',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}
      </Box>
      <Box marginBottom={3}>
        {DescriptionFormField({
          application: application,
          showFieldName: false,
          field: {
            id: 'title',
            title: '',
            description: formatMessage(
              information.labels.staysAbroad.questionTitle,
            ),
            titleVariant: 'h5',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}
      </Box>
      <RadioController
        id={'staysAbroad.hasStayedAbroad'}
        split="1/2"
        onSelect={(value) => {
          handleStayAbroadChange(value)
        }}
        disabled={preRegisteredCountries.length > 0}
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
              readOnly={field.readOnly}
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
