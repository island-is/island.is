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
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { JA, NEI, YES } from '../../lib/constants'

export const commonOverviewFields = [
  ...deceasedInfoFields,
  buildDescriptionField({
    id: 'space0',
    title: '',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewEstateMembersHeader',
    title: m.estateMembersTitle,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
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
            member.nationalId !== ''
              ? formatNationalId(member.nationalId)
              : member.dateOfBirth,
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
                  ],
                ]
              : '',
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'space1',
    title: '',
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
    title: '',
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
      getValueViaPath<string>(answers, 'estate.testament.wills') === YES,
  }),
  buildDescriptionField({
    id: 'space3',
    title: '',
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
    title: '',
    space: 'gutter',
  }),
  buildDividerField({}),
]
