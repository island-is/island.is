import React, { FC } from 'react'
import {
  FormStepper as CoreFormStepper,
  FormStepperThemes,
  Tag,
} from '@island.is/island-ui/core'
import {
  Application,
  FormModes,
  Section,
  SectionChildren,
  formatText,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { FormScreen } from '../types'

interface FormStepperProps {
  application: Application
  form: {
    title: MessageDescriptor | string
    icon?: string
  }
  mode: FormModes
  showTag: boolean
  sections: Section[]
  screen: FormScreen
}

const FormStepper: FC<FormStepperProps> = ({
  application,
  form,
  mode,
  showTag,
  sections,
  screen,
}) => {
  const { formatMessage } = useLocale()

  const progressTheme: Record<FormModes, FormStepperThemes> = {
    [FormModes.APPLYING]: FormStepperThemes.PURPLE,
    [FormModes.EDITING]: FormStepperThemes.PURPLE,
    [FormModes.APPROVED]: FormStepperThemes.GREEN,
    [FormModes.REVIEW]: FormStepperThemes.BLUE,
    [FormModes.PENDING]: FormStepperThemes.BLUE,
    [FormModes.REJECTED]: FormStepperThemes.RED,
  }

  // Cannot infers type because of circular loop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedChildren = (child: SectionChildren): any => ({
    name: formatText(child.title, application, formatMessage),
    type: child.type,
    children: (child.children ?? []).map((c) => formattedChildren(c)),
  })

  const formattedSections = sections.map((section: Section) => ({
    name: formatText(section.title, application, formatMessage),
    type: section.type,
    children: section.children.map((child) => formattedChildren(child)),
  }))

  const ProgressTag: FC = () => {
    switch (mode) {
      case FormModes.REVIEW:
      case FormModes.PENDING:
        return (
          <Tag variant="darkerBlue" outlined>
            Status: In Review
          </Tag>
        )

      case FormModes.APPROVED:
        return (
          <Tag variant="blueberry" outlined>
            Status: Approved
          </Tag>
        )

      case FormModes.REJECTED:
        return (
          <Tag variant="red" outlined>
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
      formName={formatMessage(form.title)}
      formIcon={form.icon}
      sections={formattedSections}
      activeSection={screen.sectionIndex}
      activeSubSection={screen.subSectionIndex}
    />
  )
}

export default FormStepper
