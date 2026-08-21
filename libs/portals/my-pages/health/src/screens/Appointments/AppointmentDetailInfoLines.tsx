import { MessageDescriptor } from 'react-intl'

import { HealthDirectorateAppointmentLinkType } from '@island.is/api/schema'
import { IconMapIcon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InfoLine, InfoLineStack } from '@island.is/portals/my-pages/core'

import { messages } from '../../lib/messages'
import { mapAssigneeType } from '../../utils/mappers'
import { AppointmentDetailFieldsFragment } from './AppointmentDetail.generated'

interface InfoLine {
  label: string
  content?: string
  button?: {
    type: 'link'
    to: string
    label: MessageDescriptor
    icon: IconMapIcon
  }
}

interface AppointmentDetailInfoLinesProps {
  appointment: AppointmentDetailFieldsFragment
}

export const AppointmentDetailInfoLines = ({
  appointment,
}: AppointmentDetailInfoLinesProps) => {
  const { formatMessage } = useLocale()

  const findLink = (type: HealthDirectorateAppointmentLinkType) =>
    appointment.links?.find((l) => l.type === type)?.url

  const preparationLink = findLink(
    HealthDirectorateAppointmentLinkType.PREPARATION,
  )
  const patientInstructionsLink = findLink(
    HealthDirectorateAppointmentLinkType.PATIENT_INSTRUCTIONS,
  )
  const organizationInfoLink = findLink(
    HealthDirectorateAppointmentLinkType.ORGANIZATION_INFO,
  )

  const infoLines: InfoLine[] = []

  if ((appointment.practitioners?.length ?? 0) > 0) {
    infoLines.push({
      label: formatMessage(messages.appointmentAtSimple),
      content: appointment.practitioners.join(', '),
    })
  }

  infoLines.push(
    ...(appointment.assignees ?? []).map((assignee) => ({
      label: mapAssigneeType(assignee.type, formatMessage),
      content: assignee.name,
    })),
  )

  if (appointment.instruction) {
    infoLines.push({
      label: formatMessage(messages.instructions),
      content: appointment.instruction,
      button: patientInstructionsLink
        ? {
            type: 'link',
            to: patientInstructionsLink,
            label: messages.seeMore,
            icon: 'open',
          }
        : undefined,
    })
  }

  if (preparationLink) {
    infoLines.push({
      label: formatMessage(messages.appointmentPreparation),
      button: {
        type: 'link',
        to: preparationLink,
        label: messages.seeMore,
        icon: 'open',
      },
    })
  }

  const locationLines: InfoLine[] = [
    {
      label: formatMessage(messages.appointmentLocationDepartment),
      content: appointment.location?.department ?? undefined,
    },
    {
      label: formatMessage(messages.appointmentLocationWing),
      content: appointment.location?.wing ?? undefined,
    },
    {
      label: formatMessage(messages.appointmentLocationFloor),
      content: appointment.location?.floor ?? undefined,
    },
    {
      label: formatMessage(messages.appointmentLocationRoom),
      content: appointment.location?.room ?? undefined,
    },
    {
      label: formatMessage(messages.phoneNumber),
      content: appointment.location?.phoneNumber ?? undefined,
    },
    {
      label: formatMessage(messages.openingHours),
      content: appointment.location?.openingHoursText ?? undefined,
    },
    {
      label: formatMessage(messages.organization),
      content: appointment.location?.organization ?? undefined,
      button: organizationInfoLink
        ? {
            type: 'link',
            to: organizationInfoLink,
            label: messages.seeMore,
            icon: 'open',
          }
        : undefined,
    },
  ]

  infoLines.push(...locationLines.filter((line) => line.content || line.button))

  if (infoLines.length === 0) {
    return null
  }

  return (
    <InfoLineStack
      label={formatMessage(messages.appointmentMoreInfo)}
      space={1}
    >
      {infoLines.map((line, index) => (
        <InfoLine key={index} {...line} />
      ))}
    </InfoLineStack>
  )
}
