import React, { useContext, useState } from 'react'
import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import {
  IApplicantType,
  IFormApplicantType,
} from '../../../../types/interfaces'
import { saveApplicantTypes } from '../../../../services/apiService'
import { EFormApplicantTypes } from '../../../../types/enums'
import { FormApplicantType } from './components/FormApplicantType'

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

export default function RelevantParties() {
  const { formBuilder } = useContext(FormBuilderContext)
  const applicantTypeTemplates = formBuilder.applicantTypes
  const [formApplicantTypes, setFormApplicantTypes] = useState<
    IFormApplicantType[]
  >(formBuilder.form.formApplicantTypes)
  const { id: formId } = formBuilder.form

  const [focus, setOnFocus] = useState('')

  const createFormApplicantType = (
    type: EFormApplicantTypes,
    template: IApplicantType,
  ): IFormApplicantType => {
    return {
      formId: formId,
      type: type,
      applicantTypeId: template.id,
      name: template.nameSuggestions[0].nameSuggestion,
    }
  }

  const handleCheckboxChange = (checked: boolean, index: number) => {
    const updateFormApplicantTypes = (
      newFormApplicantTypes: IFormApplicantType[],
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
      saveApplicantTypes(formId, newList)
      setFormApplicantTypes([...formApplicantTypes, ...newTypes])
    }

    const removeFormApplicantTypes = (types: EFormApplicantTypes[]) => {
      const newList = formApplicantTypes.filter((f) => !types.includes(f.type))
      saveApplicantTypes(formId, newList)
      setFormApplicantTypes(newList)
    }

    if (checked) {
      if (index === 0) {
        const template = applicantTypeTemplates.find(
          (at) => at.type === applicantTypes[index],
        )
        const newFormApplicantType: IFormApplicantType =
          createFormApplicantType(EFormApplicantTypes.einstaklingur, template)
        saveApplicantTypes(formId, [newFormApplicantType])
        setFormApplicantTypes([...formApplicantTypes, newFormApplicantType])
      } else if (index === 1) {
        const delegatorTemplate = applicantTypeTemplates.find(
          (at) => at.id === 2,
        )
        const delegateeTemplate = applicantTypeTemplates.find(
          (at) => at.id === 5,
        )
        const newFormApplicantTypes: IFormApplicantType[] = [
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
        const delegatorTemplate = applicantTypeTemplates.find(
          (at) => at.id === 6,
        )
        const delegateeTemplate = applicantTypeTemplates.find(
          (at) => at.id === 3,
        )
        const newFormApplicantTypes: IFormApplicantType[] = [
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
        const procurationHolder = applicantTypeTemplates.find(
          (at) => at.id === 4,
        )
        const legalEntity = applicantTypeTemplates.find((at) => at.id === 6)
        const newFormApplicantTypes: IFormApplicantType[] = [
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

  return (
    <Stack space={2}>
      <Box marginBottom={2}>
        <Text variant="h4">
          Veldu þá einstaklinga sem mega opna þessa umsókn
        </Text>
      </Box>
      <Box padding={2}>
        <Stack space={2}>
          {applicantTypeLabel.slice(0, 4).map((label, index) => (
            <Checkbox
              key={index}
              label={label}
              checked={formApplicantTypes.some(
                (f) => f.type === applicantTypes[index],
              )}
              onChange={(e) => handleCheckboxChange(e.target.checked, index)}
            />
          ))}
        </Stack>
      </Box>
      {formApplicantTypes.length > 0 && (
        <Box marginTop={1}>
          <Text variant="h3">Skilgreindu hlutaðeigandi aðila</Text>
        </Box>
      )}
      {formApplicantTypes.map((f, i) => (
        <FormApplicantType
          key={i}
          title={applicantTypeLabel[applicantTypes.indexOf(f.type)]}
          name={f.name}
          nameSuggestions={applicantTypeTemplates
            .find((at) => at.id === f.applicantTypeId)
            .nameSuggestions.map((ns) => ns.nameSuggestion)}
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

  function isOther(applicant: IFormApplicantType) {
    const template = applicantTypeTemplates.find(
      (at) => at.id === applicant.applicantTypeId,
    )
    if (
      template.nameSuggestions.some(
        (ns) => ns.nameSuggestion.is === applicant.name.is,
      )
    ) {
      return false
    }
    return true
  }

  function handleSelect(e: { label: string; value: string }, index) {
    const newApplicantTypes = formApplicantTypes.map((f, i) => {
      if (i === index) {
        return {
          ...f,
          name: {
            is: e.label,
            en: e.value,
          },
        }
      }
      return f
    })
    saveApplicantTypes(formId, newApplicantTypes)
    setFormApplicantTypes(newApplicantTypes)
  }

  function onFocus(value: string) {
    setOnFocus(value)
  }

  function blur(value: string) {
    if (focus !== value) {
      saveApplicantTypes(formId, formApplicantTypes)
    }
    setOnFocus('')
  }
}
