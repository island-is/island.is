import React, { FC } from 'react'
import {
  FormStepper as CoreFormStepper,
  FormStepperThemes,
  Hidden,
  Tag,
} from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import {
  Application,
  FormModes,
  Section,
  SectionChildren,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { m } from '../lib/messages'

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

const FormStepper: FC<React.PropsWithChildren<FormStepperProps>> = ({
  application,
  form,
  mode,
  showTag,
  sections,
  screen,
}) => {
  const { formatMessage } = useLocale()

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

  const ProgressTag: FC<React.PropsWithChildren<unknown>> = () => {
    switch (mode) {
      case FormModes.IN_PROGRESS:
        return (
          <Tag variant="darkerBlue" outlined>
            {formatMessage(m.progressTag.inProgress)}
          </Tag>
        )

      case FormModes.APPROVED:
        return (
          <Tag variant="blueberry" outlined>
            {formatMessage(m.progressTag.approved)}
          </Tag>
        )

      case FormModes.REJECTED:
        return (
          <Tag variant="red" outlined>
            {formatMessage(m.progressTag.rejected)}
          </Tag>
        )

      case FormModes.COMPLETED:
        return (
          <Tag variant="blueberry" outlined>
            {formatMessage(m.progressTag.completed)}
          </Tag>
        )

      case FormModes.DRAFT:
        return (
          <Tag variant="purple" outlined>
            {formatMessage(m.progressTag.draft)}
          </Tag>
        )

      default:
        return null
    }
  }

  return (
    <CoreFormStepper
      formName={formatMessage(form.title)}
      formIcon={form.icon}
      sections={formattedSections}
      activeSection={screen.sectionIndex}
      activeSubSection={screen.subSectionIndex}
      tag={
        showTag && (
          <Hidden below="md">
            <ProgressTag />
          </Hidden>
        )
      }
    />
  )
}

export default FormStepper
