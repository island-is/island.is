import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { deceasedInfoFields } from '../Sections/deceasedInfoFields'
import { applicantOverviewFields } from './applicantInfo'
import { registrantOverviewFields } from './registrant'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { JA, NEI, YES } from '../../lib/constants'
import format from 'date-fns/format'

export const commonOverviewFields = [
  ...deceasedInfoFields,
  ...registrantOverviewFields,
  buildDividerField({}),
  ...applicantOverviewFields,
  buildDescriptionField({
    id: 'overviewEstateMembersHeader',
    title: m.estateMembersTitle,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      id: 'estateMembersCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        (
          (answers.estate as unknown as EstateInfo).estateMembers?.filter(
            (member) => member.enabled,
          ) ?? []
        ).map((member) => ({
          title: member.name,
          description: [
            typeof member.nationalId !== 'undefined' && member.nationalId !== ''
              ? formatNationalId(member.nationalId)
              : member.dateOfBirth
              ? format(new Date(member.dateOfBirth), 'dd.MM.yyyy')
              : '',
            member.relation,
            member.relationWithApplicant,
            formatPhoneNumber(member.phone || ''),
            member.email,

            /* Advocate */
            member.advocate
              ? [
                  [
                    m.inheritanceAdvocateLabel.defaultMessage +
                      ': ' +
                      member.advocate?.name,
                    formatPhoneNumber(member.advocate.phone || ''),
                    member.advocate.email,
                  ],
                ]
              : '',

            /* Advocate 2 */
            member.advocate2
              ? [
                  [
                    m.inheritanceAdvocateLabel.defaultMessage +
                      ': ' +
                      member.advocate2?.name,
                    formatPhoneNumber(member.advocate2.phone || ''),
                    member.advocate2.email,
                  ],
                ]
              : '',
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'space1',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.doesWillExist,
    value: ({ answers }) =>
      getValueViaPath(answers, 'estate.testament.wills') === YES ? JA : NEI,
    width: 'half',
  }),
  buildKeyValueField({
    label: m.doesAgreementExist,
    value: ({ answers }) =>
      getValueViaPath(answers, 'estate.testament.agreement') === YES ? JA : NEI,
    width: 'half',
  }),
  buildDescriptionField({
    id: 'space2',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'estate.testament.wills') === YES,
  }),
  buildKeyValueField({
    label: m.doesPermissionToPostponeExist,
    value: ({ answers }) =>
      getValueViaPath(answers, 'estate.testament.dividedEstate'),
    width: 'half',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'estate.testament.dividedEstate') ===
      YES,
  }),
  buildDescriptionField({
    id: 'space3',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.additionalInfo,
    value: ({ answers }) =>
      getValueViaPath(answers, 'estate.testament.additionalInfo'),
    condition: (answers) =>
      !!getValueViaPath<string>(answers, 'estate.testament.additionalInfo'),
  }),
  buildDescriptionField({
    id: 'space4',
    space: 'gutter',
  }),
  buildDividerField({}),
]
