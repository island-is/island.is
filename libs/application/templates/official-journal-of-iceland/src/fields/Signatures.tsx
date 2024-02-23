import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { signatures } from '../lib/messages/signatures'
import { Tabs } from '@island.is/island-ui/core'
import { CommitteeSignature } from '../components/signatures/Committee'
import { RegularSignature } from '../components/signatures/Regular'
import { useCallback, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import {
  DEBOUNCE_INPUT_TIMER,
  INITIAL_ANSWERS,
  INSTITUTION_INDEX,
  MEMBER_INDEX,
} from '../lib/constants'
import debounce from 'lodash/debounce'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import {
  committeeSignatureTemplate,
  regularSignatureTemplate,
} from '../components/htmlEditor/templates/signatures'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'
import { useFormContext } from 'react-hook-form'

type LocalState = typeof INITIAL_ANSWERS['signature']

export const Signatures = ({ application, errors }: OJOIFieldBaseProps) => {
  const { formatMessage: f, locale } = useLocale()

  const { answers } = application

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const { setValue } = useFormContext()

  const [selectedTab, setSelectedTab] = useState<string>(
    answers?.signature?.type ?? INITIAL_ANSWERS.signature.type,
  )
  const [state, setState] = useState<LocalState>({
    type: answers?.signature?.type ?? INITIAL_ANSWERS.signature.type,
    signature: answers?.signature?.signature ?? '',
    regular: answers?.signature?.regular ?? INITIAL_ANSWERS.signature.regular,
    committee:
      answers?.signature?.committee ?? INITIAL_ANSWERS.signature.committee,
    additional: answers?.signature?.additional ?? '',
  })

  const updateHandler = useCallback(async () => {
    setValue(InputFields.signature.type, state.type)
    setValue(InputFields.signature.contents, state.signature)
    state.regular.forEach((group, i) => {
      setValue(
        InputFields.signature.regular.institution.replace(
          INSTITUTION_INDEX,
          i.toString(),
        ),
        group.institution,
      )
      setValue(
        InputFields.signature.regular.date.replace(
          INSTITUTION_INDEX,
          i.toString(),
        ),
        group.date,
      )
      group.members.forEach((member, j) => {
        setValue(
          InputFields.signature.regular.members.above
            .replace(INSTITUTION_INDEX, i.toString())
            .replace(INSTITUTION_INDEX, j.toString()),
          member.above,
        )
        setValue(
          InputFields.signature.regular.members.name
            .replace(INSTITUTION_INDEX, i.toString())
            .replace(INSTITUTION_INDEX, j.toString()),
          member.name,
        )
        setValue(
          InputFields.signature.regular.members.below
            .replace(INSTITUTION_INDEX, i.toString())
            .replace(INSTITUTION_INDEX, j.toString()),
          member.below,
        )
        setValue(
          InputFields.signature.regular.members.after
            .replace(INSTITUTION_INDEX, i.toString())
            .replace(INSTITUTION_INDEX, j.toString()),
          member.after,
        )
      })
    })

    setValue(
      InputFields.signature.committee.institution,
      state.committee.institution,
    )
    setValue(InputFields.signature.committee.date, state.committee.date)
    setValue(
      InputFields.signature.committee.chairman.above,
      state.committee.chairman.above,
    )
    setValue(
      InputFields.signature.committee.chairman.name,
      state.committee.chairman.name,
    )
    setValue(
      InputFields.signature.committee.chairman.after,
      state.committee.chairman.after,
    )
    setValue(
      InputFields.signature.committee.chairman.below,
      state.committee.chairman.below,
    )
    state.committee.members.forEach((member, i) => {
      setValue(
        InputFields.signature.committee.members.name.replace(
          MEMBER_INDEX,
          i.toString(),
        ),
        member.name,
      )
      setValue(
        InputFields.signature.committee.members.below.replace(
          MEMBER_INDEX,
          i.toString(),
        ),
        member.below,
      )
    })

    await updateApplication({
      variables: {
        locale,
        input: {
          skipValidation: true,
          id: application.id,
          answers: {
            signature: {
              type: state.type,
              signature: state.signature,
              regular: state.regular,
              committee: state.committee,
              additional: state.additional,
            },
          },
        },
      },
    })
  }, [
    application.id,
    locale,
    setValue,
    state.additional,
    state.committee,
    state.regular,
    state.signature,
    state.type,
    updateApplication,
  ])

  const updateState = useCallback((newState: typeof state) => {
    setState((prev) => ({
      ...prev,
      ...newState,
      signature:
        newState.type === 'regular'
          ? regularSignatureTemplate({
              signatureGroups: newState.regular,
              additionalSignature: newState.additional,
            })
          : committeeSignatureTemplate({
              signature: newState.committee,
              additionalSignature: newState.additional,
            }),
    }))
  }, [])

  const debouncedStateUpdate = debounce(updateState, DEBOUNCE_INPUT_TIMER)

  const preview =
    selectedTab === 'regular'
      ? regularSignatureTemplate({
          signatureGroups: state.regular,
          additionalSignature: state.additional,
        })
      : committeeSignatureTemplate({
          signature: state.committee,
          additionalSignature: state.additional,
        })

  useEffect(() => {
    updateHandler()
  }, [updateHandler])

  const tabs = [
    {
      id: 'regular',
      label: f(signatures.tabs.regular),
      content: (
        <RegularSignature
          state={state}
          errors={errors}
          setState={debouncedStateUpdate}
        />
      ),
    },
    {
      id: 'committee',
      label: f(signatures.tabs.committee),
      content: (
        <CommitteeSignature
          errors={errors}
          state={state}
          setState={debouncedStateUpdate}
        />
      ),
    },
  ]

  return (
    <>
      <FormGroup
        title={f(signatures.general.title)}
        intro={f(signatures.general.intro)}
      >
        <Tabs
          selected={selectedTab}
          onChange={(id) => {
            updateState({ ...state, type: id })
            setValue(InputFields.signature.type, id)
            setSelectedTab(id)
          }}
          tabs={tabs}
          label={f(signatures.general.title)}
        />
      </FormGroup>
      <FormGroup title={f(signatures.headings.preview)}>
        <HTMLEditor
          key={selectedTab}
          value={preview}
          config={signatureConfig}
          readOnly={true}
          name={InputFields.signature.contents}
        />
      </FormGroup>
    </>
  )
}
