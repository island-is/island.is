import { defineMessage, defineMessages } from 'react-intl'

export const requests = {
  sections: {
    activeRequests: {
      table: {
        headers: {
          caseNumber: defineMessage({
            id:
              'judicial.system.core:requests.active_requests.table.headers.case_number',
            defaultMessage: 'Málsnr.',
            description:
              'Notaður sem titill fyrir málsnúmer dálk í lista yfir mál í vinnslu.',
          }),
          type: defineMessage({
            id:
              'judicial.system.core:requests.active_requests.table.headers.type',
            defaultMessage: 'Tegund',
            description:
              'Notaður sem titill fyrir tegund dálk í lista yfir mál í vinnslu.',
          }),
          state: defineMessage({
            id:
              'judicial.system.core:requests.active_requests.table.headers.state',
            defaultMessage: 'Staða',
            description:
              'Notaður sem titill fyrir staða dálk í lista yfir mál í vinnslu.',
          }),
          date: defineMessage({
            id:
              'judicial.system.core:requests.active_requests.table.headers.date',
            defaultMessage: 'Stofnað/Fyrirtaka',
            description:
              'Notaður sem titill fyrir dagsetningardálk í lista yfir óafgreidd mál í vinnslu.',
          }),
        },
      },
      title: defineMessage({
        id: 'judicial.system.core:requests.active_requests.title',
        defaultMessage: 'Mál í vinnslu',
        description: 'Notaður sem titill í fyrsta málalista á heimaskjá.',
      }),
      infoContainerTitle: defineMessage({
        id:
          'judicial.system.core:requests.active_requests.info_container_title',
        defaultMessage: 'Engin mál í vinnslu.',
        description:
          'Notaður sem titill í upplýsingasvæði sem segir að engin virk mál fundust á heimaskjá.',
      }),
      infoContainerText: defineMessage({
        id: 'judicial.system.core:requests.active_requests.info_container_text',
        defaultMessage: 'Öll mál hafa verið afgreidd.',
        description:
          'Notaður sem texti í upplýsingasvæði sem segir að engin virk mál fundust á heimaskjá fangelsisstarfsmanna.',
      }),
      prisonStaffUsers: defineMessages({
        title: {
          id:
            'judicial.system.core:requests.active_requests.prison_staff_users.title',
          defaultMessage: 'Virkt gæsluvarðhald',
          description:
            'Notaður sem titill í fyrsta málalista á heimaskjá fangelsisstarfsmanna.',
        },
        prisonAdminTitle: {
          id:
            'judicial.system.core:requests.active_requests.prison_staff_users.prison_admin_title',
          defaultMessage: 'Virkt gæsluvarðhald og farbann',
          description:
            'Notaður sem titill í fyrsta málalista á heimaskjá FMST.',
        },
        infoContainerTitle: {
          id:
            'judicial.system.core:requests.active_requests.prison_staff_users.info_container_title',
          defaultMessage: 'Engin mál fundust.',
          description:
            'Notaður sem titill í upplýsingasvæði sem segir að engin mál fundust á heimaskjá fangelsisstarfsmanna.',
        },
        infoContainerText: {
          id:
            'judicial.system.core:requests.active_requests.prison_staff_users.info_container_text',
          defaultMessage: 'Engar samþykktar kröfur fundust.',
          description:
            'Notaður sem texti í upplýsingasvæði sem segir að engin mál fundust á heimaskjá fangelsisstarfsmanna.',
        },
      }),
    },
    pastRequests: {
      table: {
        headers: {
          caseNumber: defineMessage({
            id:
              'judicial.system.core:requests.past_requests.table.headers.case_number',
            defaultMessage: 'Málsnr.',
            description:
              'Notaður sem titill fyrir málsnúmer dálk í lista yfir afgreidd mál.',
          }),
          type: defineMessage({
            id:
              'judicial.system.core:requests.past_requests.table.headers.type',
            defaultMessage: 'Tegund',
            description:
              'Notaður sem titill fyrir tegund dálk í lista yfir afgreidd mál.',
          }),
          state: defineMessage({
            id:
              'judicial.system.core:requests.past_requests.table.headers.state',
            defaultMessage: 'Staða',
            description:
              'Notaður sem titill fyrir staða dálk í lista yfir afgreidd mál.',
          }),
          duration: defineMessage({
            id:
              'judicial.system.core:requests.past_requests.table.headers.duration',
            defaultMessage: 'Gildistími',
            description:
              'Notaður sem titill fyrir gildistíma dálk í lista yfir afgreidd mál.',
          }),
        },
      },
      title: defineMessage({
        id: 'judicial.system.core:requests.past_requests.title',
        defaultMessage: 'Afgreidd mál',
        description: 'Notaður sem titill í seinni málalista á heimaskjá.',
      }),
      infoContainerTitle: defineMessage({
        id: 'judicial.system.core:requests.past_requests.info_container_title',
        defaultMessage: 'Engin mál hafa verið afgreidd.',
        description:
          'Notaður sem titill í upplýsingasvæði sem segir að engin afgreidd mál fundust á heimaskjá.',
      }),
      infoContainerText: defineMessage({
        id: 'judicial.system.core:requests.past_requests.info_container_text',
        defaultMessage: 'Öll mál eru í vinnslu.',
        description:
          'Notaður sem texti í upplýsingasvæði sem segir að engin afgreidd mál fundust á heimaskjá.',
      }),
      highCourtUsers: defineMessages({
        title: {
          id:
            'judicial.system.core:requests.past_requests.high_court_users.title',
          defaultMessage: 'Kærðir úrskurðir',
          description:
            'Notaður sem titill í seinni málalista á heimaskjá landsréttarnotanda.',
        },
      }),
      prisonStaffUsers: defineMessages({
        title: {
          id:
            'judicial.system.core:requests.past_requests.prison_staff_users.title',
          defaultMessage: 'Lokið gæsluvarðhald',
          description:
            'Notaður sem titill í seinni málalista á heimaskjá fangelsisstarfsmanna.',
        },
        prisonAdminTitle: {
          id:
            'judicial.system.core:requests.past_requests.prison_staff_users.prison_admin_title',
          defaultMessage: 'Lokið gæsluvarðhald og farbann',
          description:
            'Notaður sem titill í seinni málalista á heimaskjá FMST.',
        },
      }),
    },
  },
}
