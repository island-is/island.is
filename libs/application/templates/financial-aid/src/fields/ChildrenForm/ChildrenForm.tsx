import React from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'

import { DescriptionText } from '..'
import { FAFieldBaseProps, SchoolType } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { childrenForm } from '../../lib/messages'
import format from 'date-fns/format'

import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'

import { sortChildrenByAge } from '@island.is/application/templates/family-matters-core/utils'
import kennitala from 'kennitala'
import { getMessageForSchool } from '../../lib/formatters'
import { getSchoolType } from '../../lib/utils'
import { useFormContext } from 'react-hook-form'
export const CHILDREN_INDEX = '{childrenIndex}'

const childrenTypes = (CHILDREN_INDEX: number) => {
  return {
    nationalId: `children-${CHILDREN_INDEX}.nationalId`,
    school: `children-${CHILDREN_INDEX}.school`,
    hasFoodStamps: `children-${CHILDREN_INDEX}.hasFoodStamps`,
    hasAfterSchool: `children-${CHILDREN_INDEX}.hasAfterSchool`,
    hasBookAid: `children-${CHILDREN_INDEX}.hasBookAid`,
  }
}

const ChildrenForm = ({ application, errors }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

  const children = externalData.childrenCustodyInformation.data

  const sortChildrenAge = sortChildrenByAge(children).reverse()
  const { setValue, clearErrors } = useFormContext()

  console.log(answers, errors)

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(childrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={childrenForm.page.content} />
      </Box>

      {sortChildrenAge.map((child, index) => {
        const nationalId = child.nationalId
        const kennitalaInfo = kennitala.info(nationalId)
        const birthday = kennitalaInfo?.birthday
        const age = kennitalaInfo?.age
        const dateOfBirth = new Date(birthday)

        const schoolType = getSchoolType(age)

        const defaultValue = answers?.children
          ? answers?.children[index].school
          : ''

        if (!schoolType) {
          return null
        }
        setValue(childrenTypes(index).nationalId, nationalId)

        return (
          <Box
            marginBottom={5}
            background="blue100"
            padding={3}
            borderRadius="standard"
          >
            <Text variant="h3" fontWeight="semiBold" marginBottom={1}>
              {child.fullName}
            </Text>
            <Text variant="small">
              {formatMessage(childrenForm.page.birthday, {
                birthday: format(dateOfBirth, 'dd.MM.yyyy'),
              })}
            </Text>

            <Box marginTop={[2, 2, 3]}>
              <InputController
                id={childrenTypes(index).school}
                name={childrenTypes(index).school}
                type="text"
                placeholder={formatMessage(
                  getMessageForSchool[schoolType].placeholder,
                )}
                label={formatMessage(getMessageForSchool[schoolType].label)}
                defaultValue={defaultValue}
              />
            </Box>

            {schoolType === SchoolType.ELEMENTARY && (
              <>
                <Box
                  background="white"
                  borderRadius="standard"
                  marginBottom={[1]}
                  marginTop={[3]}
                >
                  <CheckboxController
                    id={childrenTypes(index).hasFoodStamps}
                    name={childrenTypes(index).hasFoodStamps}
                    defaultValue={
                      answers?.children
                        ? [answers?.children[index].hasFoodStamps]
                        : []
                    }
                    large={true}
                    spacing={0}
                    options={[
                      {
                        value: 'yes',
                        label: formatMessage(
                          childrenForm.inputs.elementarySchoolFoodCheck,
                        ),
                      },
                    ]}
                  />
                </Box>
                <Box
                  background="white"
                  borderRadius="standard"
                  marginBottom={[1]}
                >
                  <CheckboxController
                    id={childrenTypes(index).hasAfterSchool}
                    name={childrenTypes(index).hasAfterSchool}
                    defaultValue={
                      answers.children
                        ? [answers.children[index].hasAfterSchool]
                        : []
                    }
                    large={true}
                    spacing={0}
                    options={[
                      {
                        value: 'yes',
                        label: formatMessage(
                          childrenForm.inputs.elementarySchoolAfterSchoolCheck,
                        ),
                      },
                    ]}
                  />
                </Box>
              </>
            )}
            {schoolType === SchoolType.HIGHSCHOOL && (
              <Box
                background="white"
                borderRadius="standard"
                marginBottom={[1]}
              >
                <CheckboxController
                  id={childrenTypes(index).hasBookAid}
                  name={childrenTypes(index).hasBookAid}
                  defaultValue={
                    answers.children
                      ? [answers.children[index].hasAfterSchool]
                      : []
                  }
                  large={true}
                  spacing={0}
                  options={[
                    {
                      value: 'yes',
                      label: formatMessage(
                        childrenForm.inputs.elementarySchoolFoodCheck,
                      ),
                    },
                  ]}
                />
              </Box>
            )}
          </Box>
        )
      })}
    </>
  )
}

export default withLogo(ChildrenForm)
