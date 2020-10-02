import React, { FC } from 'react'
import {
  FormStepper as CoreFormStepper,
  FormStepperThemes,
  Tag,
} from '@island.is/island-ui/core'
import { FormMode, Section, SectionChildren } from '@island.is/application/core'
import { FormModes } from '@island.is/application/ui-shell'
import { useLocale } from '@island.is/localization'

interface FormStepperProps {
  form: {
    name: string
    icon?: string
  }
  mode: FormMode
  showTag: boolean
  sections: Section[]
  activeSection: number
  activeSubSection: number
}

const FormStepper: FC<FormStepperProps> = ({
  form,
  mode,
  showTag,
  sections,
  activeSection,
  activeSubSection,
}) => {
  const { formatMessage } = useLocale()

  const progressTheme: Record<FormModes, FormStepperThemes> = {
    [FormModes.APPLYING]: FormStepperThemes.PURPLE,
    [FormModes.APPROVED]: FormStepperThemes.GREEN,
    [FormModes.REVIEW]: FormStepperThemes.BLUE,
    [FormModes.PENDING]: FormStepperThemes.BLUE,
    [FormModes.REJECTED]: FormStepperThemes.RED,
  }

  // Cannot infers type because of circular loop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedChildren = (child: SectionChildren): any => ({
    name: formatMessage(child.name),
    type: child.type,
    children: (child.children ?? []).map((c) => formattedChildren(c)),
  })

  const formattedSections = sections.map((section: Section) => ({
    name: formatMessage(section.name),
    type: section.type,
    children: section.children.map((child) => formattedChildren(child)),
  }))

  const ProgressTag: FC = () => {
    switch (mode) {
      case FormModes.REVIEW:
      case FormModes.PENDING:
        return (
          <Tag variant="darkerBlue" label bordered>
            Status: In Review
          </Tag>
        )

      case FormModes.APPROVED:
        return (
          <Tag variant="darkerMint" label bordered>
            Status: Approved
          </Tag>
        )

      case FormModes.REJECTED:
        return (
          <Tag variant="red" label bordered>
            Status: Rejected
          </Tag>
        )

      default:
        return null
    }
  }

  return (
    <CoreFormStepper
      theme={progressTheme[mode]}
      tag={showTag && <ProgressTag />}
      formName={form.name}
      formIcon={form.icon}
      sections={formattedSections}
      activeSection={activeSection}
      activeSubSection={activeSubSection}
    />
  )
}

export default FormStepper
