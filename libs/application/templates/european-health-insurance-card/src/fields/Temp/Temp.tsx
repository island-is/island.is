import { Box, Inline, Link, Stack, Text } from '@island.is/island-ui/core'
import { NationalRegistry, Person } from '../../lib/types'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ApplicantsController from './TempController'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

const Temp: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const { id } = field

  const getConstraintVal = (constraintId: string) =>
    getValueViaPath(
      answers,
      `${id}.${constraintId}` as string,
      false,
    ) as boolean


  const nationalRegistryData = application.externalData.nationalRegistry?.data as NationalRegistry
  const applicant: Person = {
    name: nationalRegistryData?.fullName,
    nationalId: nationalRegistryData.nationalId,
  }
  const nationalRegistryDataSpouse = application?.externalData?.nationalRegistrySpouse?.data as NationalRegistry
  const spouse: Person = {
    name: nationalRegistryDataSpouse?.name,
    nationalId: nationalRegistryDataSpouse?.nationalId,
  }

  const childrenCustody = [];
  const nationalRegistryDataChildren = application?.externalData?.childrenCustodyInformation as unknown as NationalRegistry
  for (var i = 0; i < nationalRegistryDataChildren.data.length; i++) {
    childrenCustody.push(nationalRegistryDataChildren.data[i])
  }

  return (
    <Box>
      <Stack space={2}>
        <ApplicantsController
          id={`${applicant.nationalId}`}
          checkboxId={`${applicant.nationalId}`}
          label={formatText(
            applicant.name,
            application,
            formatMessage,
          )}
          defaultValue={getConstraintVal(`${applicant.nationalId}`)}
        />
        {nationalRegistryDataSpouse !== null && (
          <ApplicantsController
            id={`${spouse.nationalId}`}
            checkboxId={`${spouse.nationalId}`}
            label={formatText(
              spouse.name,
              application,
              formatMessage,
            )}
            defaultValue={getConstraintVal(`${spouse.nationalId}`)}
          />
        )}

        {nationalRegistryDataChildren?.data?.length > 0 && (
          nationalRegistryDataChildren?.data?.map((item: any) => (
            <ApplicantsController
              id={`${item.nationalId}`}
              checkboxId={`${item.nationalId}`}
              label={formatText(
                item.fullName,
                application,
                formatMessage,
              ) as string}
              defaultValue={getConstraintVal(`${item.nationalId}`)}
            />
          ))
        )}

      </Stack>
    </Box >
  )
}

export default Temp
