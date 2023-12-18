import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { CheckboxController } from '@island.is/shared/form-fields'
import { HealthcareLicense } from '@island.is/clients/health-directorate'
import { information } from '../../lib/messages'
import { formatDate } from '../../utils'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export const SelectLicenseField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { lang, formatMessage } = useLocale()
  const { application } = props

  const licenseOptions = (licenses: HealthcareLicense[]) => {
    const options = [] as Option[]

    for (let i = 0; i < licenses.length; i++) {
      const license = licenses[i]

      const disabled = license.isRestricted

      options.push({
        value: `${license.professionId}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {lang === 'is'
                  ? license.professionNameIs
                  : license.professionNameEn}
              </Text>
              {license.specialityList.length > 0 && (
                <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                  {formatMessage(
                    information.labels.selectLicense
                      .licenseOptionSubLabelSpeciality,
                    {
                      specialityList: license.specialityList
                        .map((x) =>
                          lang === 'is'
                            ? x.specialityNameIs
                            : x.specialityNameEn,
                        )
                        .join(', '),
                    },
                  )}
                </Text>
              )}
              {license.isTemporary && (
                <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                  {formatMessage(
                    information.labels.selectLicense
                      .licenseOptionSubLabelTemporary,
                    {
                      dateTo: formatDate(license.validTo || new Date()),
                    },
                  )}
                </Text>
              )}
            </Box>
            {disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.selectLicense.restrictionAlertTitle,
                  )}
                  message={
                    <Box component="span" display="block">
                      <Text variant="small">
                        {formatMessage(
                          information.labels.selectLicense
                            .restrictionAlertMessage,
                        )}
                      </Text>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return (
    <Box paddingTop={2}>
      <CheckboxController
        id={`${props.field.id}.professionIds`}
        large
        backgroundColor="blue"
        defaultValue={[]}
        options={licenseOptions(
          application?.externalData?.healthcareLicenses
            ?.data as HealthcareLicense[],
        )}
      />
    </Box>
  )
}
