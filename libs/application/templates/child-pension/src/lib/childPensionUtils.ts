import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  ApplicantChildCustodyInformation,
  Option,
  YesOrNo,
} from '@island.is/application/types'
import { ChildPensionRow } from '../types'
import { ChildPensionReason, NO, YES, AttachmentLabel } from './constants'
import { childPensionFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

interface FileType {
  key: string
  name: string
}

interface ChildPensionAttachments {
  maintenance?: FileType[]
  notLivesWithApplicant?: FileType[]
}

enum AttachmentTypes {
  MAINTENANCE = 'maintenance',
  NOT_LIVES_WITH_APPLICANT = 'notLivesWithApplicant',
}

interface Attachments {
  attachments: FileType[]
  label: MessageDescriptor
}

export function getApplicationAnswers(answers: Application['answers']) {
  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  const registeredChildren = getValueViaPath(
    answers,
    'registerChildRepeater',
    [],
  ) as ChildPensionRow[]

  const selectedCustodyKids = getValueViaPath(
    answers,
    'chooseChildren.custodyKids',
    [],
  ) as []

  const selectedChildrenInCustody = getValueViaPath(
    answers,
    'chooseChildren.selectedChildrenInCustody',
    [],
  ) as ChildPensionRow[]

  const childPensionAddChild = getValueViaPath(
    answers,
    'childPensionAddChild',
    YES,
  ) as YesOrNo

  return {
    applicantEmail,
    applicantPhonenumber,
    registeredChildren,
    selectedCustodyKids,
    selectedChildrenInCustody,
    childPensionAddChild,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  const custodyInformation = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  return {
    applicantName,
    applicantNationalId,
    custodyInformation,
  }
}

export function getChildPensionReasonOptions() {
  const options: Option[] = [
    {
      value: ChildPensionReason.PARENT_HAS_PENSION_OR_DISABILITY_ALLOWANCE,
      label:
        childPensionFormMessage.info
          .childPensionReasonParentHasPensionOrDisabilityAllowance,
    },
    {
      value: ChildPensionReason.PARENT_IS_DEAD,
      label: childPensionFormMessage.info.childPensionReasonParentIsDead,
    },
    {
      value: ChildPensionReason.CHILD_IS_FATHERLESS,
      label: childPensionFormMessage.info.childPensionReasonChildIsFatherless,
    },
    {
      value: ChildPensionReason.PARENTS_PENITENTIARY,
      label: childPensionFormMessage.info.childPensionReasonParentsPenitentiary,
    },
  ]
  return options
}

export function getAttachments(application: Application) {
  const getAttachmentDetails = (
    attachmentsArr: FileType[] | undefined,
    attachmentType: AttachmentTypes,
  ) => {
    if (attachmentsArr && attachmentsArr.length > 0) {
      attachments.push({
        attachments: attachmentsArr,
        label: AttachmentLabel[attachmentType],
      })
    }
  }

  const { answers, externalData } = application
  const { registeredChildren, childPensionAddChild } =
    getApplicationAnswers(answers)
  const attachments: Attachments[] = []

  const childPensionAttachments = answers.fileUpload as ChildPensionAttachments

  if (registeredChildren.length > 0 && childPensionAddChild !== NO) {
    getAttachmentDetails(
      childPensionAttachments?.maintenance,
      AttachmentTypes.MAINTENANCE,
    )
  }

  if (childCustodyLivesWithApplicant(answers, externalData)) {
    getAttachmentDetails(
      childPensionAttachments?.notLivesWithApplicant,
      AttachmentTypes.NOT_LIVES_WITH_APPLICANT,
    )
  }

  return attachments
}

// returns true if selected child DOES NOT live with applicant
export function childCustodyLivesWithApplicant(
  answers: Application['answers'],
  externalData: Application['externalData'],
) {
  let returnStatus = false
  const { selectedCustodyKids } = getApplicationAnswers(answers)
  const { custodyInformation } = getApplicationExternalData(externalData)

  selectedCustodyKids.map((i) =>
    custodyInformation.map((j) =>
      i === j.nationalId && !j.livesWithApplicant
        ? (returnStatus = true)
        : (returnStatus = false),
    ),
  )

  return returnStatus
}
