export enum VmstApplicationStatus {
  approved = 'approved',
  approvedWithWaitTime = 'approvedWithWaitTime',
  applicantInProgress = 'applicantInProgress',
  automaticSuspension = 'automaticSuspension',
  monitoringSuspension = 'monitoringSuspension',
  suspensionMissingData = 'suspensionMissingData',
  suspensionMissingExplanation = 'suspensionMissingExplanation',
  sanctions = 'sanctions',
  review = 'review',
  newApplication = 'newApplication',
  rejected = 'rejected',
  deregistered = 'deregistered',
  closedInvalid = 'closedInvalid',
  previousStatus = 'previousStatus',
  unknown = 'unknown',
}

const statusMap: Record<string, VmstApplicationStatus> = {
  '116C6A68-B99F-4CE5-ED45-08D68A7CCD0A': VmstApplicationStatus.approved,
  '48FCEC50-D751-4EB9-ED46-08D68A7CCD0A':
    VmstApplicationStatus.approvedWithWaitTime,
  '36776DB2-8E84-46BC-014F-08D684B37226':
    VmstApplicationStatus.applicantInProgress,
  '1D3E3488-AB0E-47CD-77FA-08DE64049C13':
    VmstApplicationStatus.automaticSuspension,
  'C7CFD3FA-3B6C-40A8-ED47-08D68A7CCD0A':
    VmstApplicationStatus.monitoringSuspension,
  '0625270E-E65B-4F19-C437-08D6DD255789':
    VmstApplicationStatus.suspensionMissingData,
  '3AB2DB10-6FC4-4154-C438-08D6DD255789': VmstApplicationStatus.sanctions,
  '66613514-A8F8-47F9-C439-08D6DD255789': VmstApplicationStatus.review,
  '724EE394-E86A-4F08-D801-08D661A91A1E': VmstApplicationStatus.newApplication,
  '6C52C17C-1FD6-4288-ED4B-08D68A7CCD0A': VmstApplicationStatus.rejected,
  '698CD995-06E8-464E-AA2C-08D74E4B72AD': VmstApplicationStatus.deregistered,
  'DC21E229-126B-4D22-145A-08D69BC482B7': VmstApplicationStatus.closedInvalid,
  '1535420D-5EF6-4724-2848-08DD57DBC358': VmstApplicationStatus.approved,
  '5AE44D0D-73CA-4369-BD79-3FC5FC8DAE1D': VmstApplicationStatus.sanctions,
  '7BA0D70F-8088-4ECC-B1E0-58959B240483':
    VmstApplicationStatus.suspensionMissingData,
  '6D3CFC1E-1226-44BF-BD15-E52C02849DA2': VmstApplicationStatus.rejected,
  'C145D989-7013-41FA-8396-3A56FE91A8B1': VmstApplicationStatus.deregistered,
  'BA36BEEB-CF91-472B-41A4-08DDE08F305A': VmstApplicationStatus.previousStatus,
  '7AADC9DC-A940-4D8F-0E21-08DDF044DFC3':
    VmstApplicationStatus.suspensionMissingExplanation,
}

export const resolveApplicationStatus = (
  statusId?: string | null,
): VmstApplicationStatus =>
  statusMap[statusId?.toUpperCase() ?? ''] ?? VmstApplicationStatus.unknown
