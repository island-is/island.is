// import {useQuery} from '@apollo/client';
import {Field, FieldCard, FieldGroup, FieldLabel, FieldRow} from '@ui';
import React from 'react';
import {View} from 'react-native';
import {
  GenericLicenseDataField,
  GenericLicenseType,
} from '../../../graphql/types/schema';

export const FieldRender = ({
  data,
  level = 1,
  licenseType,
}: {
  data: GenericLicenseDataField[];
  level?: number;
  licenseType?: GenericLicenseType;
}) => {
  return (
    <>
      {(data || []).map(
        (
          {type, name, label, value, fields}: GenericLicenseDataField,
          i: number,
        ) => {
          const key = `field-${type}-${i}`;

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
                      />
                    </FieldRow>
                  </FieldGroup>
                );
              } else {
                return <Field key={key} label={label} value={value} compact />;
              }

            case 'Group':
              if (label) {
                return (
                  <View key={key} style={{marginTop: 24, paddingBottom: 4}}>
                    <FieldLabel>{label}</FieldLabel>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </View>
                );
              }
              return (
                <FieldGroup key={key}>
                  <FieldRow>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 2,
                      licenseType: licenseType,
                    })}
                  </FieldRow>
                </FieldGroup>
              );

            case 'Category':
              return (
                <FieldCard
                  key={key}
                  code={name ?? undefined}
                  title={label ?? undefined}
                  type={licenseType}
                  hasFields={!!fields}>
                  <FieldRow>
                    {FieldRender({
                      data: fields as GenericLicenseDataField[],
                      level: 3,
                      licenseType: licenseType,
                    })}
                  </FieldRow>
                </FieldCard>
              );

            default:
              return <Field key={key} label={label} value={value} />;
          }
        },
      )}
    </>
  );
};
