import React, { FC, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'

import first from 'lodash/first'
import { gql, useQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'

interface OrganizationFieldProps {
  disabled: boolean
}
interface Props extends FieldBaseProps {
  field: CustomField
}
type Ministry = { title: string; id: string }
type Organization = { title: string; id: string; tag: Ministry[] }
interface OrganizationOption extends Option {
  ministry: Ministry
}

export const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        id
        title
        tag {
          id
          title
        }
      }
    }
  }
`

export const GET_ORGANIZATION_TAGS_QUERY = gql`
  query GetOrganizationTags($input: GetOrganizationTagsInput!) {
    getOrganizationTags(input: $input) {
      items {
        id
        title
      }
    }
  }
`

const OrganizationField: FC<Props> = ({ error, field, application }) => {
  const { clearErrors, setValue } = useFormContext()
  const { lang, formatMessage } = useLocale()
  const { id, props } = field
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([])
  const [ministries, setMinistries] = useState<Option[]>([])

  const { data: organizationData, refetch: refetchOrganizations } = useQuery(
    GET_ORGANIZATIONS_QUERY,
    {
      variables: { input: { lang } },
    },
  )
  const { data: ministryData, refetch: refetchMinistries } = useQuery(
    GET_ORGANIZATION_TAGS_QUERY,
    {
      variables: { input: { lang } },
    },
  )

  useEffect(() => {
    refetchOrganizations({ input: { lang } })
    refetchMinistries({ input: { lang } })
  }, [lang])

  useEffect(() => {
    if (organizationData?.getOrganizations?.items.length) {
      setOrganizations(
        organizationData?.getOrganizations?.items.map(
          ({ title, id, tag }: Organization) => ({
            label: title,
            value: id,
            ministry: first(tag),
          }),
        ),
      )
    }
  }, [organizationData])

  useEffect(() => {
    if (ministryData?.getOrganizationTags?.items.length) {
      setMinistries(
        ministryData?.getOrganizationTags?.items.map(
          ({ title, id }: Ministry) => ({
            label: title,
            value: id,
          }),
        ),
      )
    }
  }, [ministryData])

  return (
    <>
      <Box paddingTop={2}>
        <GridRow>
          <GridColumn span={['1/1', '1/1', '1/2']}>
            <Controller
              name={id}
              defaultValue=""
              render={({ value, onChange }) => {
                return (
                  <Select
                    name="organization"
                    options={organizations}
                    placeholder={formatText(
                      m.institution,
                      application,
                      formatMessage,
                    )}
                    disabled={(props as OrganizationFieldProps).disabled}
                    value={
                      organizations.find(
                        (option) => option.value === value.id,
                      ) || null
                    }
                    onChange={({ label, value, ministry: m }: any) => {
                      clearErrors(id)
                      onChange({ id: value, title: label })
                      setValue('applicant.ministry', {
                        id: m.id,
                        title: m.title,
                      })
                    }}
                  />
                )
              }}
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/1', '1/2']}>
            <Controller
              name="applicant.ministry"
              defaultValue=""
              render={({ value, onChange }) => (
                <Select
                  name="ministries"
                  options={ministries}
                  placeholder={formatText(
                    m.ministry,
                    application,
                    formatMessage,
                  )}
                  disabled={(props as OrganizationFieldProps).disabled}
                  value={
                    ministries.find((option) => option.value === value.id) ||
                    null
                  }
                  onChange={({ value, label }: any) => {
                    clearErrors('applicant.ministry')
                    onChange({ id: value, title: label })
                    setValue('applicant.institution', null)
                  }}
                />
              )}
            />
          </GridColumn>
        </GridRow>
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">{error}</Text>
        </Box>
      )}
    </>
  )
}

export default OrganizationField
