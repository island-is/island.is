import { defineMessage, defineMessages } from 'react-intl'

export const requests = {
  sections: {
    activeRequests: {
      title: defineMessage({
        id: 'judicial.system.core:requests.active_requests.title',
        defaultMessage: 'Kröfur í vinnslu',
        description: 'Notaður sem titill í fyrsta málalista á heimaskjá.',
      }),
      infoContainerTitle: {
        id:
          'judicial.system.core:requests.active_requests.info_container_title',
        defaultMessage: 'Engar kröfur í vinnslu.',
        description:
          'Notaður sem titill í upplýsingasvæði sem segir að engin virk mál fundust á heimaskjá.',
      },
      infoContainerText: {
        id: 'judicial.system.core:requests.active_requests.info_container_text',
        defaultMessage: 'Allar kröfur hafa verið afgreiddar.',
        description:
          'Notaður sem texti í upplýsingasvæði sem segir að engin virk mál fundust á heimaskjá fangelsisstarfsmanna.',
      },
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
      title: defineMessage({
        id: 'judicial.system.core:requests.past_requests.title',
        defaultMessage: 'Afgreiddar kröfur',
        description: 'Notaður sem titill í seinni málalista á heimaskjá.',
      }),
      infoContainerTitle: {
        id: 'judicial.system.core:requests.past_requests.info_container_title',
        defaultMessage: 'Engar kröfur hafa verið afgreiddar.',
        description:
          'Notaður sem titill í upplýsingasvæði sem segir að engin afgreidd mál fundust á heimaskjá.',
      },
      infoContainerText: {
        id: 'judicial.system.core:requests.past_requests.info_container_text',
        defaultMessage: 'Allar kröfur eru í vinnslu.',
        description:
          'Notaður sem texti í upplýsingasvæði sem segir að engin afgreidd mál fundust á heimaskjá.',
      },
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
