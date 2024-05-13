import React from 'react'
import { useIntl } from 'react-intl'

import { Text, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { DescriptionText } from '..'
import { FAFieldBaseProps } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { childrenForm } from '../../lib/messages'
import format from 'date-fns/format'

import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'

import { sortChildrenByAge } from '@island.is/application/templates/family-matters-core/utils'
const childSchool = 'child.school'
const childFoodStamp = 'child.school.food.stamp'
const childAfterSchool = 'child.school.after.school.activity'
import kennitala from 'kennitala'

const ChildrenForm = ({ application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { answers } = application

  const children = application.externalData.childrenCustodyInformation.data

  const sortChildrenAge = sortChildrenByAge(children).reverse()

  return (
    <>
      <Text variant="h3" fontWeight="light" marginBottom={3}>
        {formatMessage(childrenForm.general.description)}
      </Text>
      <Box marginBottom={5}>
        <DescriptionText text={childrenForm.page.content} />
      </Box>

      {sortChildrenAge.map((child) => {
        const birthday = kennitala.info(child.nationalId)?.birthday
        const age = kennitala.info(child.nationalId)?.age
        const dateOfBirth = new Date(birthday)

        return (
          <Box
            marginBottom={5}
            background="blue100"
            padding={3}
            borderRadius="standard"
          >
            <Text variant="h3" fontWeight="light" marginBottom={1}>
              {child.fullName}
            </Text>
            <Text variant="small" fontWeight="light">
              {formatMessage(childrenForm.page.birthday, {
                birthday: format(dateOfBirth, 'dd.MM.yyyy'),
              })}
            </Text>
            {age < 6 && (
              <Box marginTop={[2, 2, 3]}>
                <InputController
                  id={childSchool}
                  name={childSchool}
                  type="text"
                  placeholder={formatMessage(
                    childrenForm.inputs.kindergardenPlaceholder,
                  )}
                  label={formatMessage(childrenForm.inputs.kindergardenLabel)}
                  defaultValue={''}
                  onChange={() => {}}
                />
              </Box>
            )}
            {age > 6 && age < 16 && (
              <>
                <Box marginTop={[2, 2, 3]} marginBottom={[3]}>
                  <InputController
                    id={childSchool}
                    name={childSchool}
                    type="text"
                    size="md"
                    icon="search"
                    placeholder={formatMessage(
                      childrenForm.inputs.elementarySchoolPlaceholder,
                    )}
                    label={formatMessage(
                      childrenForm.inputs.elementarySchoolLabel,
                    )}
                    defaultValue={''}
                    onChange={() => {}}
                  />
                </Box>
                <Box
                  background="white"
                  borderRadius="standard"
                  marginBottom={[1]}
                >
                  <CheckboxController
                    id={childFoodStamp}
                    name={childFoodStamp}
                    defaultValue={[]}
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

                <Box background="white" borderRadius="standard">
                  <CheckboxController
                    id={childAfterSchool}
                    name={childAfterSchool}
                    backgroundColor="white"
                    defaultValue={[]}
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
            {/* TODO: add age <= 20 */}
            {age >= 16 && (
              <>
                <Box marginTop={[2, 2, 3]} marginBottom={[3]}>
                  <InputController
                    id={childSchool}
                    name={childSchool}
                    type="text"
                    size="md"
                    icon="search"
                    placeholder={formatMessage(
                      childrenForm.inputs.highSchoolPlaceholder,
                    )}
                    label={formatMessage(childrenForm.inputs.highSchoolLabel)}
                    defaultValue={''}
                    onChange={() => {}}
                  />
                </Box>
                <Box
                  background="white"
                  borderRadius="standard"
                  marginBottom={[1]}
                >
                  <CheckboxController
                    id={childFoodStamp}
                    name={childFoodStamp}
                    defaultValue={[]}
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
              </>
            )}
          </Box>
        )
      })}
    </>
  )
}

export default withLogo(ChildrenForm)
