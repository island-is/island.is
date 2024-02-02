import { Box, Button, Text } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { advert } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  InputFields,
  OJOIFieldBaseProps,
  RegularSignatureState,
} from '../../lib/types'
import cloneDeep from 'lodash/cloneDeep'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { INSTITUTION_INDEX, MEMBER_INDEX } from '../../lib/constants'
import { getErrorViaPath } from '@island.is/application/core'

type Props = Pick<OJOIFieldBaseProps, 'errors'> & {
  state: RegularSignatureState
  setState: (state: RegularSignatureState) => void
  addSignature?: boolean
}

type Institution = NonNullable<RegularSignatureState>[0]

type InstitutionMember = NonNullable<Institution['members']>[0]

type MemberKey = keyof InstitutionMember

type InstitutionKey = keyof Omit<Institution, 'members'>

const emptyMember: InstitutionMember = {
  textAbove: '',
  name: '',
  textBelow: '',
  textAfter: '',
}

const emptyInstitution: Institution = {
  institution: '',
  date: '',
  members: [cloneDeep(emptyMember)],
}

export const RegularSignature = ({ state, setState, errors }: Props) => {
  const { formatMessage: f } = useLocale()

  const onChangeMember = (
    institutionIndex: number,
    memberIndex: number,
    key: MemberKey,
    value: string,
  ) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    const member = institution?.members?.find(
      (_, index) => index === memberIndex,
    )

    if (!member) return

    const updatedMember = { ...member, [key]: value }
    institution.members?.splice(memberIndex, 1, updatedMember)
    clonedState.splice(institutionIndex, 1, institution)
    setState(clonedState)
  }

  const onRemoveMember = (institutionIndex: number, memberIndex: number) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    institution.members?.splice(memberIndex, 1)
    clonedState.splice(institutionIndex, 1, institution)
    setState(clonedState)
  }

  const onAddMember = (institutionIndex: number) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    institution.members?.push(cloneDeep(emptyMember))
    clonedState.splice(institutionIndex, 1, institution)
    setState(clonedState)
  }

  const onChangeInstitution = (
    institutionIndex: number,
    key: InstitutionKey,
    value: string,
  ) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    const updatedInstitution = { ...institution, [key]: value }
    clonedState.splice(institutionIndex, 1, updatedInstitution)
    setState(clonedState)
  }

  const onRemoveInstitution = (institutionIndex: number) => {
    const clonedState = cloneDeep(state)
    clonedState.splice(institutionIndex, 1)
    setState(clonedState)
  }

  const onAddInstitution = () => {
    const clonedState = cloneDeep(state)
    clonedState.push(cloneDeep(emptyInstitution))
    setState(clonedState)
  }

  return (
    <Box>
      {state.map((institution, index) => (
        <Box className={styles.institutionWrapper} key={index}>
          <Box className={styles.institution}>
            <InputController
              id={InputFields.case.signature.regular.institution.replace(
                INSTITUTION_INDEX,
                `${index}`,
              )}
              name={InputFields.case.signature.regular.institution.replace(
                INSTITUTION_INDEX,
                `${index}`,
              )}
              label={f(advert.inputs.signature.institution.label)}
              defaultValue={institution.institution}
              backgroundColor="blue"
              onChange={(e) =>
                onChangeInstitution(index, 'institution', e.target.value)
              }
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.case.signature.regular.institution.replace(
                    INSTITUTION_INDEX,
                    `${index}`,
                  ),
                )
              }
              size="sm"
            />
            <DatePickerController
              id={InputFields.case.signature.regular.date.replace(
                INSTITUTION_INDEX,
                `${index}`,
              )}
              name={InputFields.case.signature.regular.date.replace(
                INSTITUTION_INDEX,
                `${index}`,
              )}
              label={f(advert.inputs.signature.date.label)}
              placeholder={f(advert.inputs.signature.date.placeholder)}
              backgroundColor="blue"
              size="sm"
              defaultValue={institution.date}
              onChange={(date) => onChangeInstitution(index, 'date', date)}
            />
            {index > 0 && (
              <Box className={styles.removeInputGroup}>
                <Button
                  variant="utility"
                  icon="trash"
                  onClick={() => onRemoveInstitution(index)}
                />
              </Box>
            )}
          </Box>
          <Box className={styles.wrapper}>
            <Text variant="h5" marginBottom={2}>
              {f(advert.general.signedBy)}
            </Text>
            {institution.members?.map((signature, i) => (
              <Box className={styles.inputGroup} key={`${index}-${i}`}>
                <Box className={styles.inputWrapper}>
                  <InputController
                    id={InputFields.case.signature.regular.members.textAbove
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    name={InputFields.case.signature.regular.members.textAbove
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    error={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.case.signature.regular.members.textAbove
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    label={f(advert.inputs.signature.textAbove.label)}
                    defaultValue={signature.textAbove}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'textAbove', e.target.value)
                    }
                  />
                  <InputController
                    id={InputFields.case.signature.regular.members.name
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    error={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.case.signature.regular.members.name
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    name={InputFields.case.signature.regular.members.name
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    label={f(advert.inputs.signature.name.label)}
                    defaultValue={signature.name}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'name', e.target.value)
                    }
                  />
                </Box>
                <Box className={styles.inputWrapper}>
                  <InputController
                    id={InputFields.case.signature.regular.members.textAfter
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    error={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.case.signature.regular.members.textAfter
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    label={f(advert.inputs.signature.textAfter.label)}
                    defaultValue={signature.textAfter}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'textAfter', e.target.value)
                    }
                  />
                  <InputController
                    id={InputFields.case.signature.regular.members.textBelow
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    error={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.case.signature.regular.members.textBelow
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    label={f(advert.inputs.signature.textBelow.label)}
                    defaultValue={signature.textBelow}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'textBelow', e.target.value)
                    }
                  />
                  {i > 0 && (
                    <Box className={styles.removeInputGroup}>
                      <Button
                        variant="utility"
                        icon="trash"
                        onClick={() => onRemoveMember(index, i)}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            <Box marginTop={2}>
              <Button
                size="small"
                icon="add"
                variant="utility"
                onClick={() => onAddMember(index)}
              >
                {f(advert.buttons.addPerson.label)}
              </Button>
            </Box>
          </Box>
        </Box>
      ))}
      <Box marginTop={2}>
        <Button variant="utility" icon="add" onClick={onAddInstitution}>
          {f(advert.buttons.addInstitution.label)}
        </Button>
      </Box>
    </Box>
  )
}
