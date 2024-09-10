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
    defaultMessage: 'Stofna nýtt umboð',
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
  delegationAdminCreateNewDelegation: {
    id: 'admin.delegationAdmin:delegationAdminCreateNewDelegation',
    defaultMessage: 'Stofna nýtt umboð',
  },
  delegationAdminCreateNewDelegationDescription: {
    id: 'admin.delegationAdmin:delegationAdminCreateNewDelegation',
    defaultMessage: 'Hér getur þú veitt umboð fyrir valinn notanda.',
  },
  delegationAdminCreateNewDelegationAction: {
    id: 'admin.delegationAdmin:delegationAdminCreateNewDelegation',
    defaultMessage: 'Stofna nýtt umboð',
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
  validInfinite: {
    id: 'admin.delegationAdmin:validInfinite',
    defaultMessage: 'Gildis tími óendanlegur',
  },
  validTo: {
    id: 'admin.delegationAdmin:validTo',
    defaultMessage: 'Gildistími',
  },
  type: {
    id: 'admin.delegationAdmin:type',
    defaultMessage: 'Aðgangstegund',
  },
  typeGeneral: {
    id: 'admin.delegationAdmin:typeGeneral',
    defaultMessage: 'Allsherjarumboð',
  },
  referenceId: {
    id: 'admin.delegationAdmin:referenceId',
    defaultMessage: 'Númer mála í Zendesk',
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
})
