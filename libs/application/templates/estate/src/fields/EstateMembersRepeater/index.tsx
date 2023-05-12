import { FC, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { Answers, EstateMember } from '../../types'
import { AdditionalEstateMember } from './AdditionalEstateMember'
import { getValueViaPath } from '@island.is/application/core'
import { InputController } from '@island.is/shared/form-fields'
import { format as formatNationalId } from 'kennitala'

export const EstateMembersRepeater: FC<FieldBaseProps<Answers>> = ({
  application,
  field,
  errors,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update } = useFieldArray({
    name: id,
  })

  const externalData = application.externalData.syslumennOnEntry?.data as {
    relationOptions: string[]
    estate: EstateRegistrant
  }
  const relations =
    externalData.relationOptions?.map((relation) => ({
      value: relation,
      label: relation,
    })) || []
  const error = (errors as any)?.estate?.estateMembers

  const handleAddMember = () =>
    append({
      nationalId: '',
      initial: false,
      enabled: true,
      name: '',
    })

  useEffect(() => {
    if (fields.length === 0 && externalData.estate.estateMembers) {
      append(externalData.estate.estateMembers)
    }
  }, [])

  return (
    <Box>
      {fields.reduce((acc, member: GenericFormField<EstateMember>, index) => {
        if (member.nationalId === application.applicant) {
          const relation = getValueViaPath<string>(
            application.answers,
            'applicantRelation',
          )
          if (relation && relation !== member.relation) {
            member.relation = relation
          }
        }
        if (!member.initial) {
          return acc
        }
        return [
          ...acc,
          <Box marginTop={index > 0 ? 3 : 0} key={index}>
            <Box display="flex" justifyContent="spaceBetween">
              <Text variant="h4" paddingBottom={2}>
                {formatMessage(m.estateMember)}
              </Text>
              <Box>
                <Button
                  variant="text"
                  size="small"
                  icon={member.enabled ? 'remove' : 'add'}
                  onClick={() => {
                    const updatedMember = {
                      ...member,
                      enabled: !member.enabled,
                    }
                    update(index, updatedMember)
                  }}
                >
                  {member.enabled
                    ? formatMessage(m.inheritanceDisableMember)
                    : formatMessage(m.inheritanceEnableMember)}
                </Button>
              </Box>
            </Box>

            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].nationalId`}
                  name={`${id}[${index}].nationalId`}
                  label={formatMessage(m.inheritanceKtLabel)}
                  readOnly
                  defaultValue={formatNationalId(member.nationalId || '')}
                  backgroundColor="white"
                  disabled={!member.enabled}
                  format={'######-####'}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].name`}
                  name={`${id}[${index}].name`}
                  label={formatMessage(m.inheritanceNameLabel)}
                  readOnly
                  defaultValue={member.name || ''}
                  backgroundColor="white"
                  disabled={!member.enabled}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].relation`}
                  name={`${id}[${index}].relation`}
                  label={formatMessage(m.inheritanceRelationLabel)}
                  readOnly
                  defaultValue={member.relation || ''}
                  backgroundColor="white"
                  disabled={!member.enabled}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].phone`}
                  name={`${id}[${index}].phone`}
                  label={m.phone.defaultMessage}
                  backgroundColor="blue"
                  disabled={!member.enabled}
                  format="###-####"
                  defaultValue={member.phone || ''}
                  error={error && error[index] && error[index].phone}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${id}[${index}].email`}
                  name={`${id}[${index}].email`}
                  label={m.email.defaultMessage}
                  backgroundColor="blue"
                  disabled={!member.enabled}
                  defaultValue={member.email || ''}
                  error={error && error[index] && error[index].email}
                />
              </GridColumn>
            </GridRow>
          </Box>,
        ]
      }, [] as JSX.Element[])}
      {fields.map((member: GenericFormField<EstateMember>, index) => (
        <Box key={member.id} hidden={member.initial}>
          <AdditionalEstateMember
            field={member}
            fieldName={id}
            index={index}
            relationOptions={relations}
            remove={remove}
            error={error && error[index] ? error[index] : null}
          />
        </Box>
      ))}
      <Box marginTop={3}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddMember}
          size="small"
        >
          {formatMessage(m.inheritanceAddMember)}
        </Button>
      </Box>
    </Box>
  )
}

export default EstateMembersRepeater
