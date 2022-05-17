import React, { useEffect, useState } from 'react'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { GridColumn, GridRow, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CompanySearchController,
  InputController,
} from '@island.is/shared/form-fields'
import { applicant } from '../../lib/messages'
import { gql, useLazyQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { RskCompany } from '@island.is/api/schema'

export const COMPANY_REGISTRY_COMPANY = gql`
  query GetCompany($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      name
      nationalId
      companyInfo {
        vat {
          dateOfRegistration
          dateOfDeregistration
          classification {
            type
            classificationSystem
            number
            name
          }
        }
      }
    }
  }
`

interface CompanyRegistryCompany {
  companyRegistryCompany: RskCompany
}

interface SearchField {
  nationalId: string
  label: string
}

export const InformationAboutApplication = ({
  application,
  errors,
}: FieldBaseProps) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [nationalId, setNationalId] = useState<string>('')
  const [isatNumber, setIsatNumber] = useState<string>('')

  const searchFieldLabel = getValueViaPath(
    application.answers,
    'applicant.searchField.label',
    '',
  ) as string
  const companyName = getValueViaPath(
    application.answers,
    'applicant.name',
    '',
  ) as string
  const companyNationalId = getValueViaPath(
    application.answers,
    'applicant.nationalId',
    '',
  ) as string
  const typeOfOperation = getValueViaPath(
    application.answers,
    'applicant.typeOfOperation',
    '',
  ) as string

  const [getCompany, { loading, data }] = useLazyQuery<CompanyRegistryCompany>(
    COMPANY_REGISTRY_COMPANY,
  )

  useEffect(() => {
    nationalId.length === 10 &&
      getCompany({ variables: { input: { nationalId } } })
  }, [nationalId, getCompany])

  useEffect(() => {
    if (data) {
      setValue('applicant.name', data?.companyRegistryCompany?.name ?? '')
      setValue(
        'applicant.nationalId',
        data?.companyRegistryCompany?.nationalId ?? '',
      )
      let typeOfOperation = ''
      if (
        data.companyRegistryCompany.companyInfo?.vat &&
        data.companyRegistryCompany.companyInfo?.vat.length > 0
      ) {
        // Find a valid ÍSAT number for this company
        data.companyRegistryCompany.companyInfo?.vat.map((v) => {
          if (!v.dateOfDeregistration) {
            v.classification?.map((c) => {
              if (c.type === 'Aðal') {
                typeOfOperation = `${c.number} - ${c.name}`
              }
              return c
            })
          }
          return v
        })
        setIsatNumber(
          typeOfOperation.length > 2 ? typeOfOperation.slice(0, 2) : '',
        )
      }
      setValue('applicant.typeOfOperation', typeOfOperation)
    }
  }, [data])

  return (
    <GridRow>
      <GridColumn span={['1/1', '1/1', '1/1']} paddingTop={2}>
        <CompanySearchController
          id="applicant.searchField"
          name="applicant.searchField"
          label={formatText(
            applicant.labels.nameAndNationalId,
            application,
            formatMessage,
          )}
          defaultValue={{
            value: searchFieldLabel,
            label: searchFieldLabel,
          }}
          initialInputValue={searchFieldLabel}
          setNationalId={setNationalId}
        />
      </GridColumn>
      <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
        <InputController
          id="applicant.name"
          name="applicant.name"
          label={formatText(applicant.labels.name, application, formatMessage)}
          error={errors && getErrorViaPath(errors, 'applicant.name')}
          required
          loading={loading}
          defaultValue={companyName}
          backgroundColor="blue"
          disabled
        />
      </GridColumn>
      <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
        <InputController
          id="applicant.nationalId"
          name="applicant.nationalId"
          label={formatText(
            applicant.labels.nationalId,
            application,
            formatMessage,
          )}
          format="######-####"
          loading={loading}
          error={errors && getErrorViaPath(errors, 'applicant.nationalId')}
          required
          defaultValue={companyNationalId}
          backgroundColor="blue"
          disabled
        />
      </GridColumn>
      <GridColumn span={['1/1', '1/1', '1/1']} paddingTop={2}>
        <InputController
          id="applicant.typeOfOperation"
          name="applicant.typeOfOperation"
          label={formatText(
            applicant.labels.typeOfOperation,
            application,
            formatMessage,
          )}
          loading={loading}
          error={errors && getErrorViaPath(errors, 'applicant.typeOfOperation')}
          required
          defaultValue={typeOfOperation}
          backgroundColor="blue"
          disabled
        />
      </GridColumn>
      {isatNumber !== '84' && isatNumber !== '' && (
        <GridColumn span={['1/1', '1/1', '1/1']} paddingTop={2}>
          <AlertMessage
            type="warning"
            title={formatText(
              applicant.labels.typeOfOperationNotValid,
              application,
              formatMessage,
            )}
          />
        </GridColumn>
      )}
    </GridRow>
  )
}
