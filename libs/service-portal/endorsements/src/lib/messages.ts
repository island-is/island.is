import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  endorsement: defineMessages({
    introTitle: {
      id: 'sp.endorsements:title',
      defaultMessage: 'Meðmælendalistar',
      description: 'Endorsement page title',
    },
    intro: {
      id: 'sp.endorsements:intro',
      defaultMessage:
        'Hér má finna lista yfir þau framboð og þá listabókstafi sem þú getur eða hefur mælt með. Hægt er að mæla með einum eða fleiri listabókstöfum en eingöngu einu framboði.',
      description: 'Endorsement intro text',
    },
    myEndorsements: {
      id: 'sp.endorsements:my-endorsements',
      defaultMessage: 'Mínar skráningar',
      description: 'Section title for your endorsements',
    },
    availablePartyApplicationEndorsements: {
      id: 'sp.endorsements:available-endorsements',
      defaultMessage: 'Framboðslistar sem þú getur stutt í þínu kjördæmi',
      description: 'Section title for available endorsements in your area',
    },
    availablePartyLetterEndorsements: {
      id: 'sp.endorsements:available-party-letter-endorsements',
      defaultMessage: 'Listabókstafir sem þú getur mælt með',
      description: 'Section title for available endorsements in your area',
    },
    actionCardButtonEndorse: {
      id: 'sp.endorsements:endorse-button',
      defaultMessage: 'Mæla með',
      description: 'Button to navigate to the application system',
    },
    actionCardButtonUnendorse: {
      id: 'sp.endorsements:un-endorse-button',
      defaultMessage: 'Afskrá meðmæli',
      description: 'Button to navigate to the application system',
    },
  }),
  petition: defineMessages({
    introTitle: {
      id: 'sp.petitions:title',
      defaultMessage: 'Meðmæli',
      description: 'Petitions page title',
    },
    intro: {
      id: 'sp.petitions:intro',
      defaultMessage: 'Hér má sjá yfirlit yfir:',
      description: 'Petitions intro text',
    },
    bullet1: {
      id: 'sp.petitions:intro-bullet1',
      defaultMessage:
        'Lista sem þú ert ábyrgðamaður á, hægt er að sjá yfirlit yfir meðmæli, breyta lokadagsetningu, og loka/opna lista.',
      description: 'Petitions intro text bullet',
    },
    bullet2: {
      id: 'sp.petitions:intro-bullet2',
      defaultMessage:
        'Opna meðmælendalista sem þú hefur mælt með, hægt er að afskrá meðmæli.',
      description: 'Petitions intro text bullet',
    },
    bullet3: {
      id: 'sp.petitions:intro-bullet3',
      defaultMessage:
        'Lokaða meðmælendalista sem þú hefur mælt með, ekki er hægt að afskrá sig af lokuðum lista.',
      description: 'Petitions intro text bullet',
    },
    bullet1Admin: {
      id: 'sp.petitions:intro-bullet1-admin',
      defaultMessage: 'Opna meðmælendalista',
      description: 'Petitions intro text bullet',
    },
    bullet2Admin: {
      id: 'sp.petitions:intro-bullet2-admin',
      defaultMessage: 'Lokaða meðmælendalista',
      description: 'Petitions intro text bullet',
    },
    petitionListsIown: {
      id: 'sp.petitions:petition-lists-i-own',
      defaultMessage: 'Listar stofnaðir af mér',
      description: 'Section title for your petition lists',
    },
    petitionListsOngoing: {
      id: 'sp.petitions:petition-lists-ongoing',
      defaultMessage: 'Virkir listar',
      description: 'Section title for ongoing petition lists',
    },
    petitionListsClosed: {
      id: 'sp.petitions:petition-lists-closed',
      defaultMessage: 'Lokaðir listar',
      description: 'Section title for closed petition lists',
    },
    petitionListsSignedByMe: {
      id: 'sp.petitions:petition-lists-signed-by-me',
      defaultMessage: 'Virkir listar sem ég hef mælt með',
      description: 'Section title for petitions you signed',
    },
    closedListsSignedByMe: {
      id: 'sp.petitions:closed-lists-signed-by-me',
      defaultMessage: 'Lokaðir listar sem ég hef mælt með',
      description: 'Section title for petitions you signed that are now closed',
    },
    listPeriod: {
      id: 'sp.petitions:list-period',
      defaultMessage: 'Tímabil lista:',
      description: 'Period when the petition list is open',
    },
    editList: {
      id: 'sp.petitions:edit-list',
      defaultMessage: 'Sýsla með lista',
      description: 'Edit list button label',
    },
    viewList: {
      id: 'sp.petitions:view-list',
      defaultMessage: 'Skoða nánar',
      description: 'View list button label',
    },
  }),
  viewPetition: defineMessages({
    numberSigned: {
      id: 'sp.petitions:number-signed',
      defaultMessage: 'Fjöldi skráðir',
      description: 'Number of petitions signed',
    },
    openTil: {
      id: 'sp.petitions:open-til',
      defaultMessage: 'Meðmælendalistinn er opinn:',
      description: 'List is open til',
    },
    listOwner: {
      id: 'sp.petitions:list-owner',
      defaultMessage: 'Ábyrgðarmaður:',
      description: 'List owner',
    },
    removeMyPetitionButton: {
      id: 'sp.petitions:remove-my-petition',
      defaultMessage: 'Taka nafn mitt af þessum lista',
      description: 'Remove my petition button label',
    },
    signPetitionButton: {
      id: 'sp.petitions:sign-petition',
      defaultMessage: 'Setja nafn mitt á lista',
      description: 'Sign petition button label',
    },
    dialogPromptRemoveNameTitle: {
      id: 'sp.petitions:dialog-prompt',
      defaultMessage: 'Ertu viss um að vilja taka nafn þitt af lista?',
      description: 'Dialog prompt title',
    },
    dialogPromptCloseListTitle: {
      id: 'sp.petitions:dialog-prompt-close',
      defaultMessage: 'Ertu viss um að vilja loka lista?',
      description: 'Dialog prompt title',
    },
    dialogPromptOpenListTitle: {
      id: 'sp.petitions:dialog-prompt-open',
      defaultMessage: 'Ertu viss um að vilja opna lista?',
      description: 'Dialog prompt title',
    },
    closeListButton: {
      id: 'sp.petitions:close-list',
      defaultMessage: 'Loka lista',
      description: 'Button label',
    },
    updateListButton: {
      id: 'sp.petitions:update-list',
      defaultMessage: 'Uppfæra lista',
      description: 'Button label',
    },
    dialogPromptConfirm: {
      id: 'sp.petitions:dialog-prompt-confirm',
      defaultMessage: 'Já',
      description: 'Dialog prompt confirm',
    },
    dialogPromptCancel: {
      id: 'sp.petitions:dialog-prompt-cancel',
      defaultMessage: 'Hætta við',
      description: 'Dialog prompt cancel',
    },
    dateSigned: {
      id: 'sp.petitions:date-signed',
      defaultMessage: 'Dags skráð',
      description: 'Table header',
    },
    name: {
      id: 'sp.petitions:name',
      defaultMessage: 'Nafn',
      description: 'Table header',
    },
    toastErrorOpenList: {
      id: 'sp.petitions:toast-error-message-open',
      defaultMessage: 'Ekki tókst að opna lista',
      description: 'Toast error message',
    },
    toastErrorCloseList: {
      id: 'sp.petitions:toast-error-message-close',
      defaultMessage: 'Ekki tókst að loka lista',
      description: 'Toast error message',
    },
    toastErrorSendList: {
      id: 'sp.petitions:toast-error-send-list',
      defaultMessage: 'Ekki tókst að senda lista á netfang',
      description: 'Toast error message',
    },
    toastSuccess: {
      id: 'sp.petitions:toast-success-message',
      defaultMessage: 'Nafn þitt er ekki lengur á þessum lista',
      description: 'Toast success message',
    },
    toastSuccessCloseList: {
      id: 'sp.petitions:toast-success-message-close-list',
      defaultMessage: 'Tókst að loka lista',
      description: 'Toast success message',
    },
    toastSuccessOpenList: {
      id: 'sp.petitions:toast-success-message-open-list',
      defaultMessage: 'Tókst að opna/uppfæra lista',
      description: 'Toast success message',
    },
    toastSuccessSendList: {
      id: 'sp.petitions:toast-send-list',
      defaultMessage: 'Listinn sendur á ',
      description: 'Toast success message',
    },
    closeListDescription: {
      id: 'sp.petitions:close-list-description',
      defaultMessage:
        'Hér getur þú lokað lista og verður hann þá ekki lengur aðgengilegur á ísland.is, hægt er að opna lista aftur.',
      description: 'Close list description text',
    },
    updateListTitle: {
      id: 'sp.petitions:update-list-title',
      defaultMessage: 'Breytingar á lista',
      description: 'Update list title',
    },
    updateListDescription: {
      id: 'sp.petitions:update-list-description',
      defaultMessage:
        'Hér geturðu breytt lokadagsetningu lista og þannig lengt/stytt líftíma hans.',
      description: 'Update list description text',
    },
    openListTitle: {
      id: 'sp.petitions:open-list-title',
      defaultMessage: 'Opna lista',
      description: 'Open list title',
    },
    openListDescription: {
      id: 'sp.petitions:open-list-description',
      defaultMessage:
        'Hér getur þú opnað lista og verður hann þá aftur aðgengilegur á ísland.is, hægt er að loka lista aftur.',
      description: 'Open list description',
    },
    enorsementsTableTitle: {
      id: 'sp.petitions:endorsements-table-title',
      defaultMessage: 'Yfirlit meðmæla',
      description: 'Endorsements table title',
    },
    alertForSelectingDate: {
      id: 'sp.petitions:alert-message',
      defaultMessage:
        'Til þess að virkja lista þarf að velja nýja lokadagsetningu',
      description: 'Alert message for opening list',
    },
    noNameLabel: {
      id: 'sp.petitions:no-name',
      defaultMessage: 'Nafn ótilgreint',
      description: 'Label when endorsers name is hidden',
    },
    listTitleHeader: {
      id: 'sp.petitions:list-title',
      defaultMessage: 'Heiti meðmælendalista',
      description: 'List title header',
    },
    aboutListHeader: {
      id: 'sp.petitions:about-list',
      defaultMessage: 'Um meðmælendalista',
      description: 'About list header',
    },
    adminLockedList: {
      id: 'sp.petitions:admin-locked-list',
      defaultMessage: 'Admin hefur lokað á lista',
      description: 'Error message when list is closed by admin',
    },
    sendListButton: {
      id: 'sp.petitions:send-list',
      defaultMessage: 'Senda lista',
      description: 'Button title',
    },
    sendListTitle: {
      id: 'sp.petitions:send-list-title',
      defaultMessage: 'Senda lista á netfang',
      description: 'Title',
    },
    sendListPlaceholder: {
      id: 'sp.petitions:send-list-placeholder',
      defaultMessage: 'Sláðu inn netfang',
      description: 'Input placeholder',
    },
  }),
}
