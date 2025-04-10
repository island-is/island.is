import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import {
  getApplicantOverviewInformation,
  getAssigneeOverviewInformation,
  isContractor,
} from '../../utils'
import { getMachineTenureOverviewInformation } from '../../utils/getMachineTenureInformation'
import { TrainingLicenseOnAWorkMachineAnswers } from '../../shared/types'

export const reviewOverviewSection = buildSection({
  id: 'reviewOverviewSection',
  title: '',
  children: [
    buildMultiField({
      id: 'reviewOverviewSection.multiField',
      title: overview.general.pageTitleAssignee,
      description: overview.general.descriptionAssignee,
      children: [
        buildOverviewField({
          id: 'overviewApplicant',
          title: '',
          bottomLine: false,
          items: (answers, externalData, userNationalId) =>
            getApplicantOverviewInformation(
              answers,
              externalData,
              userNationalId,
              true,
            ),
        }),
        buildOverviewField({
          id: 'overviewMachineTenure',
          title: '',
          bottomLine: false,
          width: 'half',
          items: (answers, externalData, userNationalId) =>
            getMachineTenureOverviewInformation(
              answers,
              externalData,
              userNationalId,
              true,
            ),
        }),
        buildOverviewField({
          id: 'overviewAssignee',
          title: '',
          bottomLine: false,
          items: (answers, externalData, userNationalId) =>
            getAssigneeOverviewInformation(
              answers,
              externalData,
              userNationalId,
              true,
            ),
          condition: (answers) => !isContractor(answers),
        }),
        buildHiddenInput({
          id: 'rejected',
        }),
        // buildHiddenInput({
        //   id: 'approved',
        //   // defaultValue: (
        //   //   application: Application,
        //   //   _field: Field,
        //   //   userInfo: BffUser,
        //   // ) => {
        //   //   const approved =
        //   //     getValueViaPath<string[]>(application.answers, 'approved') ?? []
        //   //   const nationalId = userInfo.profile.nationalId
        //   //   if (!approved.includes(nationalId)) approved.push(nationalId)
        //   //   console.log(userInfo.profile.nationalId, approved)
        //   //   return ['bla']
        //   // },
        // }),
        // buildHiddenInputWithWatchedValue
        buildCustomField({
          id: 'reviewOverviewSection.handleReject',
          title: '',
          component: 'HandleReject',
        }),
        buildCustomField({
          id: 'reviewOverviewSection.handleApprove',
          title: '',
          component: 'HandleApprove',
        }),
        buildSubmitField({
          id: 'submitReview',
          placement: 'footer',
          title: overview.general.approveButton,
          refetchApplicationAfterSubmit: true,
          condition: (answers, _externalData, user) => {
            console.log(answers)
            const approved =
              getValueViaPath<string[]>(answers, 'approved') ?? []
            console.log(user?.profile.nationalId, approved)
            return !approved.includes(user?.profile.nationalId ?? '')
          },
          actions: [
            {
              event: DefaultEvents.REJECT,
              name: overview.general.rejectButton,
              type: 'reject',
            },
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.agreeButton,
              type: 'primary',
              condition: (answers) => {
                const approved =
                  getValueViaPath<string[]>(answers, 'approved') ?? []
                const companyAndAssignee =
                  getValueViaPath<
                    TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
                  >(answers, 'assigneeInformation')?.companyAndAssignee ?? []
                console.log(
                  approved,
                  companyAndAssignee,
                  approved.length === companyAndAssignee.length,
                )
                return approved.length === companyAndAssignee.length - 1
              },
            },
            {
              event: DefaultEvents.APPROVE,
              name: overview.general.agreeButton,
              type: 'primary',
              condition: (answers) => {
                const approved =
                  getValueViaPath<string[]>(answers, 'approved') ?? []
                const companyAndAssignee =
                  getValueViaPath<
                    TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
                  >(answers, 'assigneeInformation')?.companyAndAssignee ?? []
                console.log(
                  approved,
                  companyAndAssignee,
                  approved.length !== companyAndAssignee.length,
                )
                return approved.length !== companyAndAssignee.length - 1
              },
            },
          ],
        }),
      ],
    }),
  ],
})
