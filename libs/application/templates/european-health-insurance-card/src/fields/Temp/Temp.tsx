import { Box, Inline, Link, Stack, Text } from '@island.is/island-ui/core'
import { NationalRegistry, Person } from '../../lib/types'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ApplicantsController from './TempController'
import { FieldBaseProps } from '@island.is/application/types'
import { any } from 'zod'
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

  const applyForTempApplicant = [];
  const applyForTempSpouse = [];
  const applyForTempChildren = [];

  const nationalRegistryData = application.externalData.nationalRegistry?.data as NationalRegistry
  const tempapplicant: Person = {
    name: nationalRegistryData?.fullName,
    nationalId: nationalRegistryData.nationalId,
  }
  const nationalRegistryDataSpouse = application?.externalData?.nationalRegistrySpouse?.data as NationalRegistry
  const tempspouse: Person = {
    name: nationalRegistryDataSpouse?.name,
    nationalId: nationalRegistryDataSpouse?.nationalId,
  }

  const tempnationalRegistryDataChildren = application?.externalData?.childrenCustodyInformation as unknown as NationalRegistry


  function getObjectKey(obj: any, value: any) {
    return Object.keys(obj).filter(
      (key) => obj[key] === value
    );
  }

  const applicants = getObjectKey(answers, true);

  if (applicants.includes(`apply-${tempapplicant?.nationalId}`)) {
    applyForTempApplicant.push(tempapplicant)
  }

  if (applicants.includes(`apply-${tempspouse?.nationalId}`)) {
    applyForTempSpouse.push(tempspouse)
  }

  for (var i = 0; i < tempnationalRegistryDataChildren.data.length; i++) {
    if (applicants.includes(`apply-${tempnationalRegistryDataChildren.data[i].nationalId}`)) {
      applyForTempChildren.push(tempnationalRegistryDataChildren.data[i])
    }
  }

  return (
    <Box>
      <Stack space={2}>
        {applyForTempApplicant?.length > 0 && (
          <ApplicantsController
            id={`temp-${tempapplicant.nationalId}`}
            checkboxId={`temp-${tempapplicant.nationalId}`}
            label={formatText(
              tempapplicant.name,
              application,
              formatMessage,
            )}
            defaultValue={getConstraintVal(`temp-${tempapplicant.nationalId}`)}
          />
        )}
        {applyForTempSpouse?.length > 0 && (
          <ApplicantsController
            id={`temp-${tempspouse.nationalId}`}
            checkboxId={`temp-${tempspouse.nationalId}`}
            label={formatText(
              tempspouse.name,
              application,
              formatMessage,
            )}
            defaultValue={getConstraintVal(`temp-${tempspouse.nationalId}`)}
          />
        )}
        {applyForTempChildren?.length > 0 && (
          applyForTempChildren?.map((item: any) => (
            <ApplicantsController
              id={`temp-${item.nationalId}`}
              checkboxId={`temp-${item.nationalId}`}
              label={formatText(
                item.fullName,
                application,
                formatMessage,
              ) as string}
              defaultValue={getConstraintVal(`temp-${item.nationalId}`)}
            />
          ))
        )}

      </Stack>
    </Box >
  )
}

export default Temp
