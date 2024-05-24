import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import {
  FormSystemApplicantType,
  FormSystemFormApplicantType,
  FormSystemLanguageType,
} from '@island.is/api/schema'
import { EFormApplicantTypes } from '../../../../lib/utils/interfaces'
import { FormApplicantType } from './components/FormApplicantType'
import { useIntl } from 'react-intl'
import { m } from '../../../../lib/messages'

const applicantTypeLabel = [
  'Einstaklingur (innskráður)',
  'Einstaklingur í umboði annars einstaklings',
  'Einstaklingur í umboði lögaðila',
  'Einstaklingur með prókúru',
  'Umboðsveitandi (einstaklingur)',
  'Lögaðili',
]

const applicantTypes = [
  'Einstaklingur',
  'Einstaklingur_með_umboð_annars_einstaklings',
  'Einstaklingur_með_umboð_lögaðila',
  'Einstaklingur_með_prókúru',
  'Einstaklingur_umboðsveitandi',
  'Lögaðili',
]

export const RelevantParties = () => {
  const {
    applicantTypes: applicantTypeTemplates,
    control,
    updateSettings,
  } = useContext(ControlContext)
  const { form } = control
  const { id: formId } = form
  const [formApplicantTypes, setFormApplicantTypes] = useState<
    FormSystemFormApplicantType[]
  >(
    (form.formApplicantTypes ?? []).filter(
      Boolean,
    ) as FormSystemFormApplicantType[],
  )
  const [focus, setOnFocus] = useState('')

  const createFormApplicantType = (
    type: string,
    template: FormSystemApplicantType,
  ): FormSystemFormApplicantType => {
    return {
      __typename: undefined,
      type,
      name: template?.nameSuggestions?.[0]?.nameSuggestion ?? {
        __typename: undefined,
        is: '',
        en: '',
      },
      applicantTypeId: template.id,
      formId,
    }
  }

  const isOther = (applicant: FormSystemFormApplicantType) => {
    const template = applicantTypeTemplates?.find(
      (at) => at?.id === applicant.applicantTypeId,
    )
    if (!template) {
      return true
    }
    if (
      template?.nameSuggestions?.some(
        (ns) => ns?.nameSuggestion?.is === applicant?.name?.is,
      )
    ) {
      return false
    }
    return true
  }

  const handleSelect = (e: { label: string; value: string }, index: number) => {
    const newApplicantTypes = formApplicantTypes.map((f, i) => {
      if (i === index) {
        return {
          ...f,
          name: {
            __typename: undefined,
            is: e.label,
            en: e.value,
          },
        }
      }
      return f
    })
    updateSettings({ ...form, formApplicantTypes: newApplicantTypes })
    setFormApplicantTypes(newApplicantTypes)
  }

  const onFocus = (value: string) => {
    setOnFocus(value)
  }

  const blur = (value: string) => {
    if (focus !== value) {
      updateSettings({ ...form, formApplicantTypes: formApplicantTypes })
    }
    setOnFocus('')
  }

  const handleCheckboxChange = (checked: boolean, index: number) => {
    const updateFormApplicantTypes = (
      newFormApplicantTypes: FormSystemFormApplicantType[],
    ) => {
      const hasLegalEntity = formApplicantTypes.some(
        (f) => f.type === EFormApplicantTypes.logadili,
      )
      const newTypes = hasLegalEntity
        ? newFormApplicantTypes.filter(
            (f) => f.type !== EFormApplicantTypes.logadili,
          )
        : newFormApplicantTypes
      const newList = [...formApplicantTypes, ...newTypes]
      updateSettings({ ...form, formApplicantTypes: newList })
      setFormApplicantTypes([...formApplicantTypes, ...newTypes])
    }

    const removeFormApplicantTypes = (types: EFormApplicantTypes[]) => {
      const newList = formApplicantTypes.filter(
        (f) => !types.includes(f.type as EFormApplicantTypes),
      )
      updateSettings({ ...form, formApplicantTypes: newList })
      setFormApplicantTypes(newList)
    }

    if (checked) {
      if (index === 0) {
        const template = applicantTypeTemplates?.find(
          (at) => at?.type === applicantTypes[index],
        )
        if (template !== undefined && template !== null) {
          const newFormApplicantType: FormSystemFormApplicantType =
            createFormApplicantType(EFormApplicantTypes.einstaklingur, template)
          updateSettings({
            ...form,
            formApplicantTypes: [...formApplicantTypes, newFormApplicantType],
          })
          setFormApplicantTypes([...formApplicantTypes, newFormApplicantType])
        }
      } else if (index === 1) {
        const delegatorTemplate = applicantTypeTemplates?.find(
          (at) => at?.id === 2,
        )
        const delegateeTemplate = applicantTypeTemplates?.find(
          (at) => at?.id === 5,
        )
        if (
          delegatorTemplate === undefined ||
          delegatorTemplate === null ||
          delegateeTemplate === undefined ||
          delegateeTemplate === null
        ) {
          return
        }
        const newFormApplicantTypes: FormSystemFormApplicantType[] = [
          createFormApplicantType(
            EFormApplicantTypes.einstaklingurMedUmbodAnnarsEinstaklings,
            delegatorTemplate,
          ),
          createFormApplicantType(
            EFormApplicantTypes.einstaklingurUmbodsveitandi,
            delegateeTemplate,
          ),
        ]
        setFormApplicantTypes([...formApplicantTypes, ...newFormApplicantTypes])
      } else if (index === 2) {
        const delegatorTemplate = applicantTypeTemplates?.find(
          (at) => at?.id === 6,
        )
        const delegateeTemplate = applicantTypeTemplates?.find(
          (at) => at?.id === 3,
        )
        if (
          delegatorTemplate === undefined ||
          delegatorTemplate === null ||
          delegateeTemplate === undefined ||
          delegateeTemplate === null
        ) {
          return
        }
        const newFormApplicantTypes: FormSystemFormApplicantType[] = [
          createFormApplicantType(
            EFormApplicantTypes.einstaklingurMedUmbodLogadila,
            delegateeTemplate,
          ),
          createFormApplicantType(
            EFormApplicantTypes.logadili,
            delegatorTemplate,
          ),
        ]
        updateFormApplicantTypes(newFormApplicantTypes)
      } else if (index === 3) {
        const procurationHolder = applicantTypeTemplates?.find(
          (at) => at?.id === 4,
        )
        const legalEntity = applicantTypeTemplates?.find((at) => at?.id === 6)
        if (
          procurationHolder === undefined ||
          procurationHolder === null ||
          legalEntity === undefined ||
          legalEntity === null
        ) {
          return
        }

        const newFormApplicantTypes: FormSystemFormApplicantType[] = [
          createFormApplicantType(
            EFormApplicantTypes.einstaklingurMedProkuru,
            procurationHolder,
          ),
          createFormApplicantType(EFormApplicantTypes.logadili, legalEntity),
        ]
        updateFormApplicantTypes(newFormApplicantTypes)
      }
    } else {
      if (index === 0) {
        removeFormApplicantTypes([EFormApplicantTypes.einstaklingur])
      } else if (index === 1) {
        removeFormApplicantTypes([
          EFormApplicantTypes.einstaklingurMedUmbodAnnarsEinstaklings,
          EFormApplicantTypes.einstaklingurUmbodsveitandi,
        ])
      } else if (index === 2) {
        if (
          formApplicantTypes.some(
            (f) => f.type === EFormApplicantTypes.einstaklingurMedProkuru,
          )
        ) {
          removeFormApplicantTypes([
            EFormApplicantTypes.einstaklingurMedUmbodLogadila,
          ])
        } else {
          removeFormApplicantTypes([
            EFormApplicantTypes.einstaklingurMedUmbodLogadila,
            EFormApplicantTypes.logadili,
          ])
        }
      } else if (index === 3) {
        if (
          formApplicantTypes.some(
            (f) => f.type === EFormApplicantTypes.einstaklingurMedUmbodLogadila,
          )
        ) {
          removeFormApplicantTypes([
            EFormApplicantTypes.einstaklingurMedProkuru,
          ])
        } else {
          removeFormApplicantTypes([
            EFormApplicantTypes.einstaklingurMedProkuru,
            EFormApplicantTypes.logadili,
          ])
        }
      }
    }
  }

  const { formatMessage } = useIntl()

  return (
    <Stack space={2}>
      <Box marginBottom={2}>
        <Text variant="h4">{formatMessage(m.selectIndividuals)}</Text>
      </Box>
      <Box padding={2}>
        <Stack space={2}>
          {applicantTypeLabel.slice(0, 4).map((label, index) => (
            <Checkbox
              key={index}
              label={label}
              checked={formApplicantTypes.some(
                (f) => f.type === applicantTypes?.[index],
              )}
              onChange={(e) => handleCheckboxChange(e.target.checked, index)}
            />
          ))}
        </Stack>
      </Box>
      {formApplicantTypes.length > 0 && (
        <Box marginTop={1}>
          <Text variant="h3">{formatMessage(m.defineRelevantParties)}</Text>
        </Box>
      )}
      {formApplicantTypes.map((f, i) => (
        <FormApplicantType
          key={i}
          title={
            f.type && applicantTypeLabel[applicantTypes.indexOf(f.type)]
              ? applicantTypeLabel[applicantTypes.indexOf(f.type)]
              : ''
          }
          name={f.name as FormSystemLanguageType}
          nameSuggestions={
            (applicantTypeTemplates
              ?.find((at) => at?.id === f.applicantTypeId)
              ?.nameSuggestions?.map((ns) => ns?.nameSuggestion) ??
              []) as FormSystemLanguageType[]
          }
          formApplicantType={f}
          index={i}
          handleSelect={handleSelect}
          blur={blur}
          setOnFocus={onFocus}
          setFormApplicantTypes={setFormApplicantTypes}
          isOther={isOther(f)}
        />
      ))}
    </Stack>
  )
}
