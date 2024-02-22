import { Box, Button, Text, DatePicker, Input } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { useLocale } from '@island.is/localization'
import {
  InputFields,
  OJOIFieldBaseProps,
  RegularSignatureState,
} from '../../lib/types'
import cloneDeep from 'lodash/cloneDeep'
import {
  INITIAL_ANSWERS,
  INSTITUTION_INDEX,
  MEMBER_INDEX,
} from '../../lib/constants'
import { getErrorViaPath } from '@island.is/application/core'
import { signatures } from '../../lib/messages/signatures'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

type LocalState = typeof INITIAL_ANSWERS['signature']

type Props = Pick<OJOIFieldBaseProps, 'errors'> & {
  state: LocalState
  setState: (state: LocalState) => void
  addSignature?: boolean
}

type Institution = NonNullable<RegularSignatureState>[0]

type InstitutionMember = NonNullable<Institution['members']>[0]

type MemberKey = keyof InstitutionMember

type InstitutionKey = keyof Omit<Institution, 'members'>

const df = 'yyyy-MM-dd'

export const RegularSignature = ({ state, setState, errors }: Props) => {
  const { formatMessage: f } = useLocale()

  const onChangeMember = (
    institutionIndex: number,
    memberIndex: number,
    key: MemberKey,
    value: string,
  ) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.regular.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    const member = institution?.members?.find(
      (_, index) => index === memberIndex,
    )

    if (!member) return

    const updatedMember = { ...member, [key]: value }
    institution.members?.splice(memberIndex, 1, updatedMember)
    clonedState.regular.splice(institutionIndex, 1, institution)
    setState(clonedState)
  }

  const onRemoveMember = (institutionIndex: number, memberIndex: number) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.regular.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    institution.members?.splice(memberIndex, 1)
    clonedState.regular.splice(institutionIndex, 1, institution)
    setState(clonedState)
  }

  const onAddMember = (institutionIndex: number) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.regular.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    institution.members?.push({
      above: '',
      name: '',
      after: '',
      below: '',
    })
    clonedState.regular.splice(institutionIndex, 1, institution)
    setState(clonedState)
  }

  const onChangeInstitution = (
    institutionIndex: number,
    key: InstitutionKey,
    value: string,
  ) => {
    const clonedState = cloneDeep(state)
    const institution = clonedState.regular.find(
      (_, index) => index === institutionIndex,
    )

    if (!institution) return

    const updatedInstitution = { ...institution, [key]: value }
    clonedState.regular.splice(institutionIndex, 1, updatedInstitution)
    setState(clonedState)
  }

  const onRemoveInstitution = (institutionIndex: number) => {
    const clonedState = cloneDeep(state)
    clonedState.regular.splice(institutionIndex, 1)
    setState(clonedState)
  }

  const onAddInstitution = () => {
    const clonedState = cloneDeep(state)
    clonedState.regular.push(
      cloneDeep({
        institution: '',
        date: '',
        members: [
          {
            above: '',
            name: '',
            after: '',
            below: '',
          },
        ],
      }),
    )
    setState(clonedState)
  }

  return (
    <Box className={styles.signatureWrapper}>
      {state.regular.map((institution, index) => (
        <Box className={styles.institutionWrapper} key={index}>
          <Box className={styles.institution}>
            <Input
              name={InputFields.signature.regular.institution.replace(
                INSTITUTION_INDEX,
                `${index}`,
              )}
              label={f(signatures.inputs.institution.label)}
              defaultValue={institution.institution}
              backgroundColor="blue"
              onChange={(e) =>
                onChangeInstitution(index, 'institution', e.target.value)
              }
              errorMessage={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.signature.regular.institution.replace(
                    INSTITUTION_INDEX,
                    `${index}`,
                  ),
                )
              }
              size="sm"
            />
            <DatePicker
              name={InputFields.signature.regular.date.replace(
                INSTITUTION_INDEX,
                `${index}`,
              )}
              label={f(signatures.inputs.date.label)}
              placeholderText={f(signatures.inputs.date.placeholder)}
              backgroundColor="blue"
              size="sm"
              selected={
                institution.date ? parseISO(institution.date) : undefined
              }
              handleChange={(date) =>
                onChangeInstitution(index, 'date', format(date, df))
              }
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
              {f(signatures.headings.signedBy)}
            </Text>
            {institution.members?.map((signature, i) => (
              <Box className={styles.inputGroup} key={`${index}-${i}`}>
                <Box className={styles.inputWrapper}>
                  <Input
                    name={InputFields.signature.regular.members.textAbove
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    errorMessage={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.signature.regular.members.textAbove
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    label={f(signatures.inputs.above.label)}
                    defaultValue={signature.above}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'above', e.target.value)
                    }
                  />
                  <Input
                    name={InputFields.signature.regular.members.name
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    errorMessage={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.signature.regular.members.name
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    label={f(signatures.inputs.name.label)}
                    defaultValue={signature.name}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'name', e.target.value)
                    }
                  />
                </Box>
                <Box className={styles.inputWrapper}>
                  <Input
                    name={InputFields.signature.regular.members.textAfter
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    errorMessage={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.signature.regular.members.textAfter
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    label={f(signatures.inputs.after.label)}
                    defaultValue={signature.after}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'after', e.target.value)
                    }
                  />
                  <Input
                    name={InputFields.signature.regular.members.textBelow
                      .replace(INSTITUTION_INDEX, `${index}`)
                      .replace(MEMBER_INDEX, `${i}`)}
                    errorMessage={
                      errors &&
                      getErrorViaPath(
                        errors,
                        InputFields.signature.regular.members.textBelow
                          .replace(INSTITUTION_INDEX, `${index}`)
                          .replace(MEMBER_INDEX, `${i}`),
                      )
                    }
                    label={f(signatures.inputs.below.label)}
                    defaultValue={signature.below}
                    backgroundColor="blue"
                    size="sm"
                    onChange={(e) =>
                      onChangeMember(index, i, 'below', e.target.value)
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
                {f(signatures.buttons.addPerson)}
              </Button>
            </Box>
          </Box>
        </Box>
      ))}
      <Box marginTop={2}>
        <Button variant="utility" icon="add" onClick={onAddInstitution}>
          {f(signatures.buttons.addInstitution)}
        </Button>
      </Box>
    </Box>
  )
}
