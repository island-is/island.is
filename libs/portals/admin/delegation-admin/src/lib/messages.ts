import { defineMessages } from 'react-intl'

export const m = defineMessages({
  delegationAdmin: {
    id: 'admin.delegationSystem:delegationAdmin',
    defaultMessage: 'Umboð',
  },
  delegationAdminDescription: {
    id: 'admin.delegationAdmin:delegationAdminDescription',
    defaultMessage: 'Flettu upp notanda til að birta upplýsingar um umboð.',
  },
  search: {
    id: 'admin.delegationAdmin:delegationAdminSearch',
    defaultMessage: 'Leita eftir kennitölu',
  },
  back: {
    id: 'admin.delegationAdmin:delegationAdminBack',
    defaultMessage: 'Til baka',
  },
  createNewDelegation: {
    id: 'admin.delegationAdmin:delegationAdminCreateNewDelegation',
    defaultMessage: 'Skrá nýtt umboð',
  },
  delegationFrom: {
    id: 'admin.delegationAdmin:delegationAdminDelegationFrom',
    defaultMessage: 'Umboð frá notanda',
  },
  delegationTo: {
    id: 'admin.delegationAdmin:delegationAdminDelegationT',
    defaultMessage: 'Umboð til notanda',
  },
  delegationFromNotFound: {
    id: 'admin.delegationAdmin:delegationAdminDelegationFromNotFound',
    defaultMessage: 'Engin umboð frá notanda fundust',
  },
  delegationToNotFound: {
    id: 'admin.delegationAdmin:delegationAdminDelegationToNotFound',
    defaultMessage: 'Engin umboð til notanda fundust',
  },
  nationalIdNotFound: {
    id: 'admin.delegationAdmin:nationalIdNotFound',
    defaultMessage: 'Kennitala fannst ekki',
  },
  delegationAdminCreateNewDelegationDescription: {
    id: 'admin.delegationAdmin:delegationAdminCreateNewDelegation',
    defaultMessage: 'Hér getur þú veitt umboð fyrir valinn notanda.',
  },
  fromNationalId: {
    id: 'admin.delegationAdmin:delegationFromNationalId',
    defaultMessage: 'Kennitala umboðsveitanda',
  },
  toNationalId: {
    id: 'admin.delegationAdmin:delegationToNationalId',
    defaultMessage: 'Kennitala umboðshafa',
  },
  cancel: {
    id: 'admin.delegationAdmin:cancel',
    defaultMessage: 'Hætta við',
  },
  create: {
    id: 'admin.delegationAdmin:create',
    defaultMessage: 'Skrá umboð',
  },
  delete: {
    id: 'admin.delegationAdmin:delete',
    defaultMessage: 'Eyða umboði',
  },
  noEndDate: {
    id: 'admin.delegationAdmin:noEndDate',
    defaultMessage: 'Gildistími óendanlegur',
  },
  validTo: {
    id: 'admin.delegationAdmin:validTo',
    defaultMessage: 'Gildistími',
  },
  type: {
    id: 'admin.delegationAdmin:type',
    defaultMessage: 'Aðgangstegund',
  },
  generalMandateLabel: {
    id: 'admin.delegationAdmin:generalMandateLabel',
    defaultMessage: 'Allsherjarumboð',
  },
  referenceId: {
    id: 'admin.delegationAdmin:referenceId',
    defaultMessage: 'Númer máls í Zendesk',
  },
  errorDefault: {
    id: 'admin.delegationAdmin:errorDefault',
    defaultMessage: 'Oops, an unknown error has occurred.',
  },
  errorValidTo: {
    id: 'admin.delegationAdmin:errorValidTo',
    defaultMessage: 'Dagsetningin verður að vera í framtíðinni',
  },
  errorNationalIdFromRequired: {
    id: 'admin.delegationAdmin:errorNationalIdFromRequired',
    defaultMessage: 'Kennitala umboðsveitanda er nauðsynleg',
  },
  errorNationalIdToRequired: {
    id: 'admin.delegationAdmin:errorNationalIdToRequired',
    defaultMessage: 'Kennitala umboðshafa er nauðsynleg',
  },
  errorNationalIdFromInvalid: {
    id: 'admin.delegationAdmin:errorNationalIdFromInvalid',
    defaultMessage: 'Kennitala umboðsveitanda er ekki gild',
  },
  errorNationalIdToInvalid: {
    id: 'admin.delegationAdmin:errorNationalIdToInvalid',
    defaultMessage: 'Kennitala umboðshafa er ekki gild',
  },
  errorReferenceIdRequired: {
    id: 'admin.delegationAdmin:errorReferenceIdRequired',
    defaultMessage: 'Númer máls í Zendesk er nauðsynlegt',
  },
  grantIdentityError: {
    id: 'admin.delegationAdmin:grantIdentityError',
    defaultMessage: 'Enginn notandi fannst með þessa kennitölu.',
  },
  createDelegationConfirmModalTitle: {
    id: 'admin.delegationAdmin:createDelegationConfirmModalTitle',
    defaultMessage: 'Þú ert að skrá nýtt umboð',
  },
  deleteDelegationModalTitle: {
    id: 'admin.delegationAdmin:deleteDelegationModalTitle',
    defaultMessage: 'Eyða umboði',
  },
  createDelegationSuccessToast: {
    id: 'admin.delegationAdmin:createDelegationSuccessToast',
    defaultMessage: 'Umboð var skráð',
  },
  nationalIdsMismatchError: {
    id: 'admin.delegationAdmin:nationalIdsMismatchError',
    defaultMessage:
      'Kennitölur á umboði stemma ekki við kennitölur í Zendesk máli',
  },
  zendeskCaseNotSolvedError: {
    id: 'admin.delegationAdmin:zendeskCaseNotSolvedError',
    defaultMessage: 'Zendesk málið er ekki í stöðunni leyst',
  },
  zendeskMissingTagError: {
    id: 'admin.delegationAdmin:zendeskMissingTagError',
    defaultMessage: 'Zendesk málið vantar nauðsynlegt tagg',
  },
  zendeskCustomFieldsMissingError: {
    id: 'admin.delegationAdmin:zendeskCustomFieldsMissingError',
    defaultMessage:
      'Zendesk málið vantar nauðsynlegar upplýsingar um kennitölur umboðsveitanda og umboðshafa',
  },
  sameNationalIdError: {
    id: 'admin.delegationAdmin:sameNationalIdError',
    defaultMessage: 'Kennitölur mega ekki vera eins',
  },
  validPersonError: {
    id: 'admin.delegationAdmin:validPersonError',
    defaultMessage: 'Kennitölur þurfa að vera gildar kennitölur',
  },
  invalidDateFormatError: {
    id: 'admin.delegationAdmin:invalidDateFormatError',
    defaultMessage: 'Dagsetning er ekki á réttu sniði',
  },
})
