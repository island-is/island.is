import {
  FieldComponents,
  FieldTypes,
  NationalRegistryParent,
} from '@island.is/application/types'
import { TextFormField } from '@island.is/application/ui-fields'
import React from 'react'
import { personal, information } from '../../lib/messages'
import DescriptionText from '../../components/DescriptionText'
import { Box, GridColumn, GridRow, Input } from '@island.is/island-ui/core'
import { NationalIdWithName } from '../NationalIdWithName'
import { InputController } from '@island.is/shared/form-fields'

export const Parents = ({ field, application, error }: any) => {
  const {
    externalData: { nationalRegistryParents },
    answers,
  } = application

  const parents = nationalRegistryParents.data as NationalRegistryParent[]

  const addParentToApplication = (nationalId: string) => {
    console.log('added parent with nationalID: ', nationalId)
  }

  return (
    <div>
      {parents.length > 1 &&
        parents.map((p, index) => {
          return (
            <GridRow marginTop={0}>
              <DescriptionText
                text={
                  index === 1
                    ? information.labels.parents.parentOneTitle
                    : information.labels.parents.parentTwoTitle
                }
                textProps={{
                  as: 'h5',
                  fontWeight: 'semiBold',
                  paddingBottom: 1,
                  paddingTop: index === 1 ? 0 : 3,
                  marginBottom: 0,
                }}
              />
              <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                <InputController
                  id={`parent${index}NationalId`}
                  defaultValue={parents[0].nationalId}
                  label={
                    personal.labels.userInformation.nationalId.defaultMessage
                  }
                  readOnly
                  format="######-####"
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                <InputController
                  id={`parent${index}Name`}
                  defaultValue={parents[0].name}
                  label={personal.labels.userInformation.name.defaultMessage}
                  readOnly
                />
              </GridColumn>
            </GridRow>
          )
        })}
      {parents.length === 1 && (
        <Box>
          <DescriptionText
            text={information.labels.parents.parentOneTitle}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              paddingBottom: 1,
              paddingTop: 0,
              marginBottom: 0,
            }}
          />
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id="parent1NationalId"
                defaultValue={parents[0].nationalId}
                label={
                  personal.labels.userInformation.nationalId.defaultMessage
                }
                // required
                // disabled
                readOnly
                format="######-####"
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id="parent1Name"
                defaultValue={parents[0].name}
                label={personal.labels.userInformation.name.defaultMessage}
                readOnly
              />
            </GridColumn>
          </GridRow>

          <DescriptionText
            text={information.labels.parents.parentTwoTitle}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              paddingBottom: 1,
              paddingTop: 3,
              marginBottom: 0,
            }}
          />
          <NationalIdWithName
            field={field}
            application={application}
            customId="parent2Information"
            customNameLabel={
              personal.labels.userInformation.name.defaultMessage
            }
            customNationalIdLabel={
              personal.labels.userInformation.nationalId.defaultMessage
            }
            onNationalIdChange={addParentToApplication}
          />
        </Box>
      )}

      {parents.length === 0 && (
        <div>
          <DescriptionText
            text={information.labels.parents.parentOneTitle}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              paddingBottom: 1,
              paddingTop: 0,
              marginBottom: 0,
            }}
          />
          <NationalIdWithName
            field={field}
            application={application}
            customId="parent1Information"
            customNameLabel={
              personal.labels.userInformation.name.defaultMessage
            }
            customNationalIdLabel={
              personal.labels.userInformation.nationalId.defaultMessage
            }
            onNationalIdChange={addParentToApplication}
          />

          <DescriptionText
            text={information.labels.parents.parentTwoTitle}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              paddingBottom: 1,
              paddingTop: 3,
              marginBottom: 0,
            }}
          />
          <NationalIdWithName
            field={field}
            application={application}
            customId="parent2Information"
            customNameLabel={
              personal.labels.userInformation.name.defaultMessage
            }
            customNationalIdLabel={
              personal.labels.userInformation.nationalId.defaultMessage
            }
            onNationalIdChange={addParentToApplication}
          />
        </div>
      )}
    </div>
  )
}
