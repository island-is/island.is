import { HealthDirectoratePrescriptionRenewalBlockedReason } from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { messages } from '../lib/messages'

export const mapBlockedStatus = (
  reason: string,
  formatMessage: FormatMessage,
): { status: string; description: string; showReason: boolean } => {
  switch (reason) {
    case HealthDirectoratePrescriptionRenewalBlockedReason.IsRegiment:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedIsRegiment),
        showReason: true,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.NoMedCard:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedNoMedCard),
        showReason: true,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.NoHealthClinic:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedNoHealthClinic),
        showReason: true,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.NotFullyDispensed:
      return {
        status: formatMessage(messages.valid),
        description: formatMessage(
          messages.prescriptionBlockedNotFullyDispensed,
        ),
        showReason: false,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.PendingRequest:
      return {
        status: formatMessage(messages.medicineIsProcessedCertificate),
        description: formatMessage(messages.prescriptionBlockedPendingRequest),
        showReason: false,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.RejectedRequest:
      return {
        status: formatMessage(messages.vaccineDeclined),
        description: formatMessage(messages.prescriptionBlockedRejectedRequest),
        showReason: false,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.DismissedRequest:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(
          messages.prescriptionBlockedDismissedRequest,
        ),
        showReason: true,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.AlreadyRequested:
      return {
        status: formatMessage(messages.medicineIsProcessedCertificate),
        description: formatMessage(
          messages.prescriptionBlockedAlreadyRequested,
        ),
        showReason: false,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.MoreRecentPrescriptionExists:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(
          messages.prescriptionBlockedMoreRecentExists,
        ),
        showReason: true,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.SpecialistOnlyPrescription:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(
          messages.prescriptionBlockedSpecialistOnlyPrescription,
        ),
        showReason: true,
      }
    case HealthDirectoratePrescriptionRenewalBlockedReason.Unknown:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedOther),
        showReason: true,
      }
    default:
      return {
        status: formatMessage(messages.notAvailable),
        description: formatMessage(messages.prescriptionBlockedOther),
        showReason: true,
      }
  }
}

export const mapWeekday = (weekday: string, formatMessage: FormatMessage) => {
  switch (weekday.toLowerCase()) {
    case 'monday':
      return formatMessage(messages.weekdayMondayAcc)
    case 'tuesday':
      return formatMessage(messages.weekdayTuesdayAcc)
    case 'wednesday':
      return formatMessage(messages.weekdayWednesdayAcc)
    case 'thursday':
      return formatMessage(messages.weekdayThursdayAcc)
    case 'friday':
      return formatMessage(messages.weekdayFridayAcc)
    case 'saturday':
      return formatMessage(messages.weekdaySaturdayAcc)
    case 'sunday':
      return formatMessage(messages.weekdaySundayAcc)
    default:
      return weekday
  }
}
