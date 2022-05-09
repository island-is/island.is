import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '@island.is/web/components'

export const liveChatIncConfig: Record<string, LiveChatIncChatPanelProps> = {
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7i92Z9s9HQeYlpGReYQVX
  // Information for Ukrainian citizens
  '7i92Z9s9HQeYlpGReYQVX': {
    license: 13822368,
    version: '2.0',
  },
  // Residence permit for humanitarian reasons
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/301ReR2lZkROl4Y5szgtpW
  '301ReR2lZkROl4Y5szgtpW': {
    license: 13822368,
    version: '2.0',
  },
}

const syslumennLanguagePack = {
  input_placeholder: 'Senda spurningu...',
  homeScreen_returnToAssistant: 'Til baka',
  suggestions_title: 'Tillögur',
  suggestions_sectionTitleStarters: 'Þetta er það sem fólk hefur leitað að',
  options_select: 'Veldu valmöguleika',
  agent_chatTitle: 'Þjónustufulltrúi',
  agent_startChat: 'Óska eftir aðstoð',
  agent_chatRequested: 'Þjónustufulltrúi kemur innan skamms...',
  agent_viewConversation: 'Sjá samtal við þjónustufulltrúa',
  agent_connecting: 'Þjónustufulltrúi kemur innan skamms...',
  agent_agentNoNameTitle: 'Þjónustufulltrúi',
  agent_agentJoinedName: '{personName} hefur tekið þátt í samtali',
  agent_agentJoinedNoName: 'Þjónustufulltrúi hefur tekið þátt í samtali',
  agent_youConnectedWarning:
    'Ef þú endurhleður eða ferð af síðunni, verður þú að óska eftir nýjum þjónustufulltrúa.',
  agent_connectingMinutes:
    'Þjónustufulltrúi kemur innan skamms...<br></br>Biðtími er <b>{time, number} {time, plural, one {minute} other {minutes}}</b>.',
  agent_connectingQueue:
    'Þjónustufulltrúi kemur innan skamms...<br></br>Þú ert númer <b>{position, number}</b> í röðinni.',
  agent_ariaAgentConnected: 'Þessi þjónustufulltrúi er tengdur',
  agent_ariaAgentNotConnected: 'Þessi þjónustufulltrúi er ekki tengdur',
  agent_youEndedChat: 'Þú hefur lokið samtali',
  agent_conversationWasEnded: 'Samtali hefur verið lokið',
  agent_disconnected:
    'Eitthvað hefur farið úrskeiðis og tenging þín við þjónustufulltrúa slitnaði. Athugaðu nettenginguna þína og reyndu að tengjast þjónustufulltrúa aftur.',
  agent_reconnected: 'Þjónustufulltrúi hefur tengst aftur',
  agent_agentLeftChat: '{personName} fór úr samtalinu',
  agent_agentLeftChatNoName: 'Þjónustufulltrúinn fór úr samtalinu',
  agent_agentEndedChat: '{personName} lauk samtalinu',
  agent_agentEndedChatNoName: 'Þjónustufulltrúinn lauk samtalinu',
  agent_transferring: 'Verið er að flytja samtal þitt til {personName}',
  agent_transferringNoName:
    'Verið er að flytja samtal þitt yfir á nýjan þjónustufulltrúa',
  agent_endChat: 'Ljúka samtali við þjónustufulltrúa',
  agent_confirmEndChat: 'Ertu viss um að þú viljir ljúka samtali?',
  agent_confirmEndChatNo: 'Nei',
  agent_confirmEndChatYes: 'Já',
  agent_returnToAgent: 'Til baka til þjónustufulltrúa',
  sessionHistory_expired:
    'Spjallota er óvirk. Sendu skilaboð til þess að halda áfram. Ef þú endurhleður síðuna þarftu að byrja á nýju spjalli',
  suggestions_sectionTitleAlternateResponses:
    'Sendu eitthvað af eftirfarandi skilaboðum',
}

export const watsonConfig: Record<string, WatsonChatPanelProps> = {
  // Um hjónaband
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1ABPqOQMsYrqBu7zyP7itc
  '1ABPqOQMsYrqBu7zyP7itc': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    languagePack: syslumennLanguagePack,
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'hjonaband') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'hjonaband')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_hjonaband = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Skilnaður
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/73z3JiTrAuOQgPlsVfqD1V
  '73z3JiTrAuOQgPlsVfqD1V': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    languagePack: syslumennLanguagePack,
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'skilnadur') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'skilnadur')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_skilnadur = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Endurnýjun ökuskírteina
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1vYhvJKy4TqxkAtPDIhaPx
  '1vYhvJKy4TqxkAtPDIhaPx': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    languagePack: syslumennLanguagePack,
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'endokuskirteini') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'endokuskirteini')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_endokuskirteini = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Þinglýsing skjala
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2evftN0gIe78zSEYLMB0aX
  '2evftN0gIe78zSEYLMB0aX': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    languagePack: syslumennLanguagePack,
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'thinglysing') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'thinglysing')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_thinglysing = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Vegabréf, almennar upplýsingar
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7Egh4yMfC48dDgceeBrWSB
  '7Egh4yMfC48dDgceeBrWSB': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    languagePack: syslumennLanguagePack,
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'vegabref') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'vegabref')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_vegabref = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Sakavottorð til einstaklinga
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/gzKeBtRl57SzRmgUzHR3u
  gzKeBtRl57SzRmgUzHR3u: {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    languagePack: syslumennLanguagePack,
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'sakavottord') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'sakavottord')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_sakavottord = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
  // Erfðamál, upplýsingar um réttindi og skyldur erfingja
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2YsIiF44ECgUUlPkr9SqOh
  '2YsIiF44ECgUUlPkr9SqOh': {
    integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    cssVariables: {
      'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
    },
    languagePack: syslumennLanguagePack,
    onLoad: (instance) => {
      const category = sessionStorage.getItem('syslumennChatPanelCategory')
      if (category !== 'erfdamal') {
        sessionStorage.clear()
      }
      sessionStorage.setItem('syslumennChatPanelCategory', 'erfdamal')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preSendhandler = (event: any) => {
        event.data.context.skills[
          'main skill'
        ].user_defined.category_erfdamal = true
      }

      instance.on({ type: 'pre:send', handler: preSendhandler })

      instance.updateHomeScreenConfig({
        is_on: false,
      })
    },
  },
}

export const syslumennWatsonConfig = {
  integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
  region: 'eu-gb',
  serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
  showLauncher: false,
  carbonTheme: 'g10',
  cssVariables: {
    'BASE-font-family': '"IBM Plex Sans", "Open Sans", Arial, sans-serif',
  },
  languagePack: {
    input_placeholder: 'Senda spurningu...',
    homeScreen_returnToAssistant: 'Til baka',
    suggestions_title: 'Tillögur',
    suggestions_sectionTitleStarters: 'Þetta er það sem fólk hefur leitað að',
    options_select: 'Veldu valmöguleika',
    agent_chatTitle: 'Þjónustufulltrúi',
    agent_startChat: 'Óska eftir aðstoð',
    agent_chatRequested: 'Þjónustufulltrúi kemur innan skamms...',
    agent_viewConversation: 'Sjá samtal við þjónustufulltrúa',
    agent_connecting: 'Þjónustufulltrúi kemur innan skamms...',
    agent_agentNoNameTitle: 'Þjónustufulltrúi',
    agent_agentJoinedName: '{personName} hefur tekið þátt í samtali',
    agent_agentJoinedNoName: 'Þjónustufulltrúi hefur tekið þátt í samtali',
    agent_youConnectedWarning:
      'Ef þú endurhleður eða ferð af síðunni, verður þú að óska eftir nýjum þjónustufulltrúa.',
    agent_connectingMinutes:
      'Þjónustufulltrúi kemur innan skamms...<br></br>Biðtími er <b>{time, number} {time, plural, one {minute} other {minutes}}</b>.',
    agent_connectingQueue:
      'Þjónustufulltrúi kemur innan skamms...<br></br>Þú ert númer <b>{position, number}</b> í röðinni.',
    agent_ariaAgentConnected: 'Þessi þjónustufulltrúi er tengdur',
    agent_ariaAgentNotConnected: 'Þessi þjónustufulltrúi er ekki tengdur',
    agent_youEndedChat: 'Þú hefur lokið samtali',
    agent_conversationWasEnded: 'Samtali hefur verið lokið',
    agent_disconnected:
      'Eitthvað hefur farið úrskeiðis og tenging þín við þjónustufulltrúa slitnaði. Athugaðu nettenginguna þína og reyndu að tengjast þjónustufulltrúa aftur.',
    agent_reconnected: 'Þjónustufulltrúi hefur tengst aftur',
    agent_agentLeftChat: '{personName} fór úr samtalinu',
    agent_agentLeftChatNoName: 'Þjónustufulltrúinn fór úr samtalinu',
    agent_agentEndedChat: '{personName} lauk samtalinu',
    agent_agentEndedChatNoName: 'Þjónustufulltrúinn lauk samtalinu',
    agent_transferring: 'Verið er að flytja samtal þitt til {personName}',
    agent_transferringNoName:
      'Verið er að flytja samtal þitt yfir á nýjan þjónustufulltrúa',
    agent_endChat: 'Ljúka samtali við þjónustufulltrúa',
    agent_confirmEndChat: 'Ertu viss um að þú viljir ljúka samtali?',
    agent_confirmEndChatNo: 'Nei',
    agent_confirmEndChatYes: 'Já',
    agent_returnToAgent: 'Til baka til þjónustufulltrúa',
    sessionHistory_expired:
      'Spjallota er óvirk. Sendu skilaboð til þess að halda áfram. Ef þú endurhleður síðuna þarftu að byrja á nýju spjalli',
    suggestions_sectionTitleAlternateResponses:
      'Sendu eitthvað af eftirfarandi skilaboðum',
  },
}
