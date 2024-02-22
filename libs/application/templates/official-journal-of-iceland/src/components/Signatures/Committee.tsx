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

type ChairmanKey = keyof CommitteeSignatureState['chairman']
type MemberKey = keyof Required<CommitteeSignatureState>['members'][0]

type LocalState = typeof INITIAL_ANSWERS['signature']
type Props = Pick<OJOIFieldBaseProps, 'errors'> & {
  state: LocalState
  setState: (state: LocalState) => void
  addSignature?: boolean
}

const emptyMember = {
  name: '',
  textBelow: '',
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
    newState.committee.members.push(cloneDeep(emptyMember))
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
          required={true}
          id={InputFields.signature.committee.institution}
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
              id={InputFields.signature.committee.chairman.textAbove}
              name={InputFields.signature.committee.chairman.textAbove}
              label={f(signatures.inputs.above.label)}
              defaultValue={state.committee.chairman.textAbove}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('textAbove', e.target.value)
              }
            />
            <InputController
              required={true}
              id={InputFields.signature.committee.chairman.name}
              name={InputFields.signature.committee.chairman.name}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  InputFields.signature.committee.chairman.name,
                )
              }
              label={f(signatures.inputs.name.label)}
              defaultValue={state.committee.chairman.name}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('name', e.target.value)
              }
            />
          </Box>
          <Box className={styles.inputWrapper}>
            <InputController
              id={InputFields.signature.committee.chairman.textAfter}
              name={InputFields.signature.committee.chairman.textAfter}
              label={f(signatures.inputs.after.label)}
              defaultValue={state.committee.chairman.textAfter}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('textAfter', e.target.value)
              }
            />
            <InputController
              id={InputFields.signature.committee.chairman.textBelow}
              name={InputFields.signature.committee.chairman.textBelow}
              label={f(signatures.inputs.below.label)}
              defaultValue={state.committee.chairman.textBelow}
              backgroundColor="blue"
              size="sm"
              onChange={(e) =>
                onCommitteeChairmanChange('textBelow', e.target.value)
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
          const localName =
            InputFields.signature.committee.members.name.replace(
              MEMBER_INDEX,
              `${index}`,
            )
          return (
            <Box key={index} className={styles.inputGroup}>
              <Box className={styles.inputWrapper}>
                <InputController
                  id={localName}
                  name={localName}
                  error={errors && getErrorViaPath(errors, localName)}
                  label={f(signatures.inputs.name.label)}
                  defaultValue={member.name}
                  backgroundColor="blue"
                  size="sm"
                  required={true}
                  onChange={(e) =>
                    onCommitteMemberChange(index, 'name', e.target.value)
                  }
                />
                <InputController
                  id={InputFields.signature.committee.members.textBelow.replace(
                    MEMBER_INDEX,
                    `${index}`,
                  )}
                  name={InputFields.signature.committee.members.textBelow.replace(
                    MEMBER_INDEX,
                    `${index}`,
                  )}
                  label={f(signatures.inputs.below.label)}
                  defaultValue={member.textBelow}
                  backgroundColor="blue"
                  size="sm"
                  onChange={(e) =>
                    onCommitteMemberChange(index, 'textBelow', e.target.value)
                  }
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
