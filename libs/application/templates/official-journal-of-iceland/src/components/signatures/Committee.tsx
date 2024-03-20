import { Box, Text, Button } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { useLocale } from '@island.is/localization'
import {
  CommitteeSignatureState,
  InputFields,
  OJOIFieldBaseProps,
} from '../../lib/types'
import cloneDeep from 'lodash/cloneDeep'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { INITIAL_ANSWERS, MEMBER_INDEX } from '../../lib/constants'
import { getErrorViaPath } from '@island.is/application/core'
import { signatures } from '../../lib/messages/signatures'

type ChairmanKey = keyof NonNullable<CommitteeSignatureState>['chairman']
type MemberKey = keyof NonNullable<CommitteeSignatureState>['members'][0]

type LocalState = typeof INITIAL_ANSWERS['signature']
type Props = Pick<OJOIFieldBaseProps, 'errors'> & {
  state: LocalState
  setState: (state: LocalState) => void
  addSignature?: boolean
}

export const CommitteeSignature = ({ state, setState, errors }: Props) => {
  const { formatMessage: f } = useLocale()

  const onCommitteeChairmanChange = (key: ChairmanKey, value: string) => {
    const newState = cloneDeep(state)
    newState.committee.chairman[key] = value
    setState(newState)
  }

  const onCommitteMemberChange = (
    index: number,
    key: MemberKey,
    value: string,
  ) => {
    const newState = cloneDeep(state)
    if (!newState.committee.members) return
    newState.committee.members[index][key] = value
    setState(newState)
  }

  const onCommitteeChange = (
    key: keyof Omit<CommitteeSignatureState, 'members' | 'chairman'>,
    value: string,
  ) => {
    const newState = cloneDeep(state)
    newState.committee[key] = value
    setState(newState)
  }

  const onAddCommitteeMember = () => {
    const newState = cloneDeep(state)
    if (!newState.committee.members) return
    newState.committee.members.push({
      name: '',
      below: '',
    })
    setState(newState)
  }

  const onRemoveCommitteeMember = (index: number) => {
    const newState = cloneDeep(state)
    if (!newState.committee.members) return
    newState.committee.members.splice(index, 1)
    setState(newState)
  }

  return (
    <Box className={styles.signatureWrapper}>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        rowGap={2}
        columnGap={2}
        marginBottom={2}
      >
        <InputController
          id={InputFields.signature.committee.institution}
          required={true}
          name={InputFields.signature.committee.institution}
          label={f(signatures.inputs.institution.label)}
          error={
            errors &&
            getErrorViaPath(errors, InputFields.signature.committee.institution)
          }
          defaultValue={state.committee.institution}
          backgroundColor="blue"
          onChange={(e) => onCommitteeChange('institution', e.target.value)}
          size="sm"
        />
        <DatePickerController
          id={InputFields.signature.committee.date}
          name={InputFields.signature.committee.date}
          label={f(signatures.inputs.date.label)}
          placeholder={f(signatures.inputs.date.placeholder)}
          backgroundColor="blue"
          size="sm"
          locale="is"
          defaultValue={state.committee.date}
          onChange={(date) => onCommitteeChange('date', date)}
        />
      </Box>
      <Box className={styles.wrapper}>
        <Text variant="h5" marginBottom={2}>
          {f(signatures.headings.chairman)}
        </Text>
        <Box className={styles.inputGroup}>
          <Box className={styles.inputWrapper}>
            <InputController
              id={InputFields.signature.committee.chairman.above}
              name={InputFields.signature.committee.chairman.above}
              label={f(signatures.inputs.above.label)}
              defaultValue={state.committee.chairman.above}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('above', e.target.value)
              }
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.signature.committee.chairman.above,
                )
              }
            />
            <InputController
              id={InputFields.signature.committee.chairman.name}
              name={InputFields.signature.committee.chairman.name}
              required={true}
              label={f(signatures.inputs.name.label)}
              defaultValue={state.committee.chairman.name}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('name', e.target.value)
              }
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.signature.committee.chairman.name,
                )
              }
            />
          </Box>
          <Box className={styles.inputWrapper}>
            <InputController
              id={InputFields.signature.committee.chairman.after}
              name={InputFields.signature.committee.chairman.after}
              label={f(signatures.inputs.after.label)}
              defaultValue={state.committee.chairman.after}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('after', e.target.value)
              }
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.signature.committee.chairman.after,
                )
              }
            />
            <InputController
              id={InputFields.signature.committee.chairman.below}
              name={InputFields.signature.committee.chairman.below}
              label={f(signatures.inputs.below.label)}
              defaultValue={state.committee.chairman.below}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('below', e.target.value)
              }
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.signature.committee.chairman.below,
                )
              }
            />
          </Box>
        </Box>
      </Box>
      <Box className={styles.wrapper} marginTop={2}>
        <Text variant="h5" marginBottom={2}>
          {f(signatures.headings.committeeMembers)}
        </Text>
        {state.committee.members?.map((member, index) => {
          const namePath = InputFields.signature.committee.members.name.replace(
            MEMBER_INDEX,
            `${index}`,
          )

          const belowPath =
            InputFields.signature.committee.members.below.replace(
              MEMBER_INDEX,
              `${index}`,
            )
          return (
            <Box key={index} className={styles.inputGroup}>
              <Box className={styles.inputWrapper}>
                <InputController
                  id={namePath}
                  name={namePath}
                  label={f(signatures.inputs.name.label)}
                  defaultValue={member.name}
                  backgroundColor="blue"
                  size="sm"
                  required={true}
                  onChange={(e) =>
                    onCommitteMemberChange(index, 'name', e.target.value)
                  }
                  error={errors && getErrorViaPath(errors, namePath)}
                />
                <InputController
                  id={belowPath}
                  name={belowPath}
                  label={f(signatures.inputs.below.label)}
                  defaultValue={member.below}
                  backgroundColor="blue"
                  size="sm"
                  onChange={(e) =>
                    onCommitteMemberChange(index, 'below', e.target.value)
                  }
                  error={errors && getErrorViaPath(errors, belowPath)}
                />
                {index > 1 && (
                  <Box className={styles.removeInputGroup}>
                    <Button
                      variant="utility"
                      icon="trash"
                      onClick={() => onRemoveCommitteeMember(index)}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )
        })}
        <Box marginTop={2}>
          <Button onClick={onAddCommitteeMember} variant="utility" icon="add">
            {f(signatures.buttons.addCommitteeMember)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
