import React from 'react'
import { Checkbox } from '../Checkbox/Checkbox'
import { FilterSearchGroup } from '../FilterSearchGroup/FilterSearchGroup'
import { FilterSearch } from './FilterSearch'


export const Default = () => (
  <div style={{ display: 'flex' }}>
    <FilterSearch
          id="filter-search-box"
          label="Sýna flokka"
          labelCloseButton = "Sía API vörulista"
          labelResultButton={"Skoða niðurstöður"}
          inputValues={{
            placeholder: 'Search',
            colored: false,
            isLoading: true,
          }}
          clearValues={{
            text: 'Hreinsa',
          }}
        >
          <FilterSearchGroup
            id="pricing_category"
            label="Pricing"
          >
            <Checkbox
              id="pricing-free"
              name="pricing"
              label="Free" />
            <Checkbox
              id="pricing-paid"
              name="pricing"
              label="Paid" />

          </FilterSearchGroup>
          <FilterSearchGroup
            id="data_category"
            label="Data"
          >
            <Checkbox
              id="data-public"
              name="data"
              label="public" />
            <Checkbox
              id="data-official"
              name="data"
              label="Official" />
            <Checkbox
            id="data-personal"
              name="data"
              label="Personal" />
            <Checkbox
            id="data-health"
              name="data"
              label="Health" />
            <Checkbox
            id="data-financial"
              name="data"
              label="Financial" />
          </FilterSearchGroup>
          <FilterSearchGroup
            id="type_category"
            label="Type"
          >
            <Checkbox
              id="type-rest"
              name="type"
              label="Rest" />
            <Checkbox
              id="type-soap"
              name="type"
              label="Soap" />
            <Checkbox
              id="type-graphql"
              name="type"
              label="GraphQl" />
          </FilterSearchGroup>
          <FilterSearchGroup
            id="access_category"
            label="Access" >
            <Checkbox
              id="access-xroad"
              name="access"
              label="X-Road" />
            <Checkbox
              id="access-apigw"
              name="access"
              label="API Gateway" />
          </FilterSearchGroup>
        </FilterSearch>
  </div>
)

