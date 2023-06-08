import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { StaysAbroadRepeaterItem } from './StaysAbroadRepeaterItem'
import { CountryOfVisit } from '../../shared/types'
import { getValueViaPath } from '@island.is/application/core'
import { RadioController } from '@island.is/shared/form-fields'
import { information } from '../../lib/messages'
import DescriptionText from '../../components/DescriptionText'


export const StaysAbroad: FC<FieldBaseProps>  = (props) => {
  const { application, setBeforeSubmitCallback } = props

  const [hasStayedAbroad, setHasStayedAbroad] = useState<
    string
  >(
    getValueViaPath(
      application.answers,
      'staysAbroad.hasStayedAbroad',
    ) as string,
  )

  const [selectedCountries, setSelectedCountries] = useState<
  CountryOfVisit[]
  >(
        getValueViaPath(
        application.answers,
        'staysAbroad.selectedAbroadCountries',
        [{ country: '', wasRemoved: 'false', dateTo: '', dateFrom: '', purposeOfStay: ''}],
        ) as CountryOfVisit[],
    )

    const [filteredSelectedCountries, setFilteredSelectedCountries] = useState(
    selectedCountries.filter(x => x.wasRemoved !== 'true')
  )

  useEffect(() => {
    setFilteredSelectedCountries(selectedCountries.filter(x => x.wasRemoved !== 'true'))
  }, [selectedCountries])

  const handleAdd = () =>
  setSelectedCountries([
      ...selectedCountries,
      { country: '', wasRemoved: 'false', dateTo: '', dateFrom: '', purposeOfStay: ''}
    ])

  const handleRemoveAll = () => {
    setSelectedCountries(
      selectedCountries.map((country, index) => {
        return { ...country, wasRemoved: 'true' }
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

  const addCountryToList = (field: string, value: any, newIndex: number) => {
    setSelectedCountries(
      selectedCountries.map((country, index) => {
        if(newIndex === index){
          return country
        }
        return country
      })
    )
  }

  const handleLiveAbroadChange = (value: string) => {
    setHasStayedAbroad(value)

    if(value === 'No'){
      handleRemoveAll()
    }
  }

  useEffect(() => {
    console.log('selectedCountries', selectedCountries)
  }, [selectedCountries])

  return (
    <Box>
       <DescriptionText 
            text={information.labels.staysAbroad.pageSubTitle}
            textProps={{
                as: 'p',
                paddingTop:3,
                marginBottom:1
            }}
          />
            <DescriptionText 
              text={information.labels.staysAbroad.questionTitle}
              textProps={{
                as: 'h5',
                fontWeight: 'semiBold',
                marginBottom:3
              }}
            />
      <RadioController 
        id={'staysAbroad.hasStayedAbroad'}
        name={information.labels.staysAbroad.questionTitle.defaultMessage}
        split='1/2'
        onSelect={(value) => {
          handleLiveAbroadChange(value)
        }}
        
        options={[
          {
            value: 'Yes',
            label: 'Já',
          },
          {
            value: 'No',
            label: 'Nei',
          },
        ]}
      />


      { hasStayedAbroad === 'Yes' && (
        <Box>
          {selectedCountries.map((field, index) => {
            return (
              <StaysAbroadRepeaterItem
                id={`${props.field.id}.selectedAbroadCountries`}
                repeaterField={field}
                index={index}
                key={`staysAbroad-${index}`}
                handleRemove={handleRemove}
                itemNumber={index}
                addCountryToList={addCountryToList}
                {...props}
              />
            )
          })}

          <Box paddingTop={2}>
            <Button
              variant="ghost"
              icon="add"
              iconType="outline"
              fluid
              size='large'
              onClick={handleAdd.bind(null, 'operator')}
              textSize='md'
              
            >
              Bæta við fleiri dvalarupplýsingum
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
