import { NationalRegistryParent } from '@island.is/application/types'
import { useState } from 'react'
import { personal, information } from '../../lib/messages'
import DescriptionText from '../../components/DescriptionText'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { NationalIdWithName } from '../NationalIdWithName'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'

export const Parents = ({ field, application, error }: any) => {
  const {
    externalData: { nationalRegistryParents },
    answers,
  } = application

  const [parents, setParents] = useState<NationalRegistryParent[]>(
    getValueViaPath(
      answers,
      'parents',
      nationalRegistryParents.data as NationalRegistryParent[],
    ) as NationalRegistryParent[],
  )

  const { formatMessage } = useLocale()

  const addParentToApplication = (nationalId: string) => {
    console.log('added parent with nationalID: ', nationalId)
  }

  return (
    <div>
      {parents.length > 1 &&
        parents.map((p, index) => {
          return (
            <Box key={`parentBox${index}`}>
              <DescriptionText
                text={information.labels.parents.parentTitle}
                format={{ index: index + 1 }}
                textProps={{
                  as: 'h5',
                  fontWeight: 'semiBold',
                  paddingBottom: 1,
                  paddingTop: index === 0 ? 0 : 3,
                  marginBottom: 0,
                }}
              />
              <GridRow marginTop={0}>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <InputController
                    id={`${field.id}[${index}].nationalId`}
                    defaultValue={p.nationalId}
                    label={formatMessage(
                      personal.labels.userInformation.nationalId,
                    )}
                    readOnly
                    format="######-####"
                    backgroundColor="blue"
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <InputController
                    id={`${field.id}[${index}].name`}
                    defaultValue={p.name}
                    label={formatMessage(personal.labels.userInformation.name)}
                    readOnly
                  />
                </GridColumn>
              </GridRow>
            </Box>
          )
        })}
      {parents.length === 1 && (
        <Box>
          <DescriptionText
            text={information.labels.parents.parentTitle}
            format={{ index: 1 }}
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
                id={`${field.id}[0].nationalId`}
                defaultValue={parents[0].nationalId}
                label={formatMessage(
                  personal.labels.userInformation.nationalId,
                )}
                readOnly
                format="######-####"
                backgroundColor="blue"
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
              <InputController
                id={`${field.id}[0].name`}
                defaultValue={parents[0].name}
                label={formatMessage(personal.labels.userInformation.name)}
                readOnly
              />
            </GridColumn>
          </GridRow>

          <DescriptionText
            text={information.labels.parents.parentTitle}
            format={{ index: 2 }}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              paddingBottom: 1,
              paddingTop: 3,
              marginBottom: 0,
            }}
          />
          {/* TODO ekki gera required */}
          <NationalIdWithName
            field={field}
            application={application}
            customId={`${field.id}[1]`}
            onNationalIdChange={addParentToApplication}
          />
        </Box>
      )}

      {parents.length === 0 && (
        <div>
          <DescriptionText
            text={information.labels.parents.parentTitle}
            format={{ index: 1 }}
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
            customId={`${field.id}[0]`}
            onNationalIdChange={addParentToApplication}
          />

          <DescriptionText
            text={information.labels.parents.parentTitle}
            format={{ index: 2 }}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              paddingBottom: 1,
              paddingTop: 3,
              marginBottom: 0,
            }}
          />
          {/* TODO ekki gera required */}
          <NationalIdWithName
            field={field}
            application={application}
            customId={`${field.id}[1]`}
            onNationalIdChange={addParentToApplication}
          />
        </div>
      )}
    </div>
  )
}
