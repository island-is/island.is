import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

import { Field, FieldCard, FieldGroup, FieldLabel, FieldRow } from '../../../ui'
import {
  GenericLicenseDataField,
  GenericLicenseType,
} from '../../../graphql/types/schema'

export const FieldRender = ({
  data,
  level = 1,
  licenseType,
}: {
  data: GenericLicenseDataField[]
  level?: number
  licenseType?: GenericLicenseType
}) => {
  const theme = useTheme()
  return (
    <>
      {(data || []).map(
        (
          { type, name, label, value, fields, link }: GenericLicenseDataField,
          i: number,
        ) => {
          const key = `field-${type}-${i}`

          switch (type) {
            case 'Value':
              if (level === 1) {
                return (
                  <FieldGroup key={key}>
                    <FieldRow>
                      <Field
                        size={i === 0 ? 'large' : 'small'}
                        label={label}
                        value={value}
                        link={link}
                      />
                    </FieldRow>
                  </FieldGroup>
                )
              } else {
                return (
                  <Field
                    key={key}
                    label={label}
                    value={value}
                    link={link}
                    compact
                  />
                )
              }

            case 'Group':
              if (label) {
                return (
                  <View
                    key={key}
                    style={{
                      marginTop: theme.spacing[3],
                      paddingBottom: theme.spacing.smallGutter,
                    }}
                  >
                    <FieldLabel>{label}</FieldLabel>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </View>
                )
              }
              return (
                <FieldGroup key={key}>
                  <View>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </View>
                </FieldGroup>
              )

            case 'Table':
              if (label) {
                return (
                  <View
                    key={key}
                    style={{
                      marginTop: theme.spacing[3],
                      paddingBottom: theme.spacing.smallGutter,
                    }}
                  >
                    <FieldLabel>{label}</FieldLabel>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </View>
                )
              }
              return (
                <FieldGroup key={key}>
                  <View>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </View>
                </FieldGroup>
              )

            case 'Category':
              return (
                <FieldCard
                  key={key}
                  code={name ?? undefined}
                  title={label ?? undefined}
                  type={licenseType}
                  hasFields={!!fields}
                >
                  <FieldRow>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 3,
                      licenseType: licenseType,
                    })}
                  </FieldRow>
                </FieldCard>
              )

            default:
              return <Field key={key} label={label} value={value} link={link} />
          }
        },
      )}
    </>
  )
}
