import { Box, Inline, Link, Stack, Text } from '@island.is/island-ui/core'
import { NationalRegistry, Person } from '../../lib/types'
import React, { FC } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'

import ApplicantsController from './ApplicantsController'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

const Applicants: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { answers, assignees } = application
  const { id } = field
  // console.log(application.externalData)
  const getConstraintVal = (constraintId: string) =>
    getValueViaPath(
      answers,
      `${id}.${constraintId}` as string,
      false,
    ) as boolean
  const nationalRegistryData = application.externalData.nationalRegistry
    ?.data as NationalRegistry
  const applicant: Person = {
    name: nationalRegistryData?.fullName,
    nationalId: nationalRegistryData.nationalId,
  }
  const nationalRegistryDataSpouse = application?.externalData
    ?.nationalRegistrySpouse?.data as NationalRegistry
  const spouse: Person = {
    name: nationalRegistryDataSpouse?.name,
    nationalId: nationalRegistryDataSpouse?.nationalId,
  }

  const nationalRegistryDataChildren = (application?.externalData
    ?.childrenCustodyInformation as unknown) as NationalRegistry
  console.log(application)
  return (
    <Box>
      <Stack space={2}>
        <ApplicantsController
          id={id}
          checkboxId={id}
          label={formatText(applicant.name, application, formatMessage)}
          defaultValue={getConstraintVal(id)}
        />
        {/* <ApplicantsController
          id={`apply-${applicant.nationalId}`}
          checkboxId={`apply-${applicant.nationalId}`}
          label={formatText(applicant.name, application, formatMessage)}
          defaultValue={getConstraintVal(`apply-${applicant.nationalId}`)}
        /> */}
        {/* {nationalRegistryDataSpouse !== null && (
          <ApplicantsController
            id={`apply-${id}`}
            checkboxId={`apply-${id}`}
            label={formatText(spouse.name, application, formatMessage)}
            defaultValue={getConstraintVal(`apply-${id}`)}
          />
        )}
        {nationalRegistryDataChildren?.data?.length > 0 &&
          nationalRegistryDataChildren?.data?.map((item: any) => (
            <ApplicantsController
              id={`apply-${id}`}
              checkboxId={`apply-${id}`}
              label={
                formatText(item.fullName, application, formatMessage) as string
              }
              defaultValue={getConstraintVal(`apply-${id}`)}
            />
          ))} */}
      </Stack>
    </Box>
  )
}

export default Applicants
