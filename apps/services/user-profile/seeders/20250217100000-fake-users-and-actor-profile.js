'use strict'

const { v5: uuidV5 } = require('uuid')

const now = new Date()
const nextNudge = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000)

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
const uuidFor = (nationalId, kind) =>
  uuidV5(`user-profile-seed-${kind}-${nationalId}`, NAMESPACE)

const FAEREYJAR_NATIONAL_ID = '0101302399'
const FAEREYJAR_EMAIL_ID = uuidFor(FAEREYJAR_NATIONAL_ID, 'email')

const GERVIMENN = [
  { name: 'Gervimaður færeyjar', national_id: '0101302399', phone: '0102399' },
  { name: 'Gervimaður útlönd', national_id: '0101307789', phone: '0107789' },
  { name: 'Gervimaður Danmörk', national_id: '0101302479', phone: '0102479' },
  { name: 'Gervimaður Evrópa', national_id: '0101302719', phone: '0102719' },
  { name: 'Gervimaður Afríka', national_id: '0101303019', phone: '0103019' },
  { name: 'Gervimaður Ameríku', national_id: '0101302989', phone: '0102989' },
  {
    name: 'Gervimaður Bandaríkin',
    national_id: '0101305069',
    phone: '0105069',
  },
  { name: 'Gervimaður Finnland', national_id: '0101302209', phone: '0102209' },
  { name: 'Gervimaður Grænland', national_id: '0101302639', phone: '0102639' },
  { name: 'Gervimaður Noregur', national_id: '0101302129', phone: '0102129' },
]

const userProfiles = GERVIMENN.map(({ national_id, phone }) => ({
  id: uuidFor(national_id, 'user-profile'),
  national_id,
  mobile_phone_number: `+354-${phone}`,
  locale: 'is',
  mobile_phone_number_verified: true,
  document_notifications: true,
  mobile_status: 'VERIFIED',
  email_notifications: true,
  last_nudge: now,
  next_nudge: nextNudge,
  created: now,
  modified: now,
}))

const emails = GERVIMENN.map(({ national_id }) => ({
  id: uuidFor(national_id, 'email'),
  national_id,
  email_status: 'VERIFIED',
  primary: true,
  email: 'mockEmail@island.is',
  created: now,
  modified: now,
}))

const emailVerifications = GERVIMENN.map(({ national_id }) => ({
  id: uuidFor(national_id, 'email-verification'),
  national_id,
  hash: 'seed-verified',
  email: 'mockEmail@island.is',
  confirmed: true,
  tries: 0,
  created: now,
  modified: now,
}))

const actorProfiles = [
  {
    // Færeyjar delegated by 65 artic
    id: uuidFor(FAEREYJAR_NATIONAL_ID, 'actor-profile'),
    to_national_id: FAEREYJAR_NATIONAL_ID,
    from_national_id: '5005101370',
    email_notifications: true,
    emails_id: FAEREYJAR_EMAIL_ID,
    last_nudge: now,
    next_nudge: nextNudge,
    created: now,
    modified: now,
  },
]

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('user_profile', userProfiles, {})
    await queryInterface.bulkInsert('emails', emails, {})
    await queryInterface.bulkInsert(
      'email_verification',
      emailVerifications,
      {},
    )
    await queryInterface.bulkInsert('actor_profile', actorProfiles, {})
  },

  down: async (queryInterface) => {
    const { Op } = require('sequelize')
    const nationalIds = GERVIMENN.map((g) => g.national_id)
    await queryInterface.bulkDelete(
      'actor_profile',
      {
        to_national_id: FAEREYJAR_NATIONAL_ID,
        from_national_id: '5005101370',
      },
      {},
    )
    await queryInterface.bulkDelete(
      'email_verification',
      { national_id: { [Op.in]: nationalIds } },
      {},
    )
    await queryInterface.bulkDelete(
      'emails',
      { national_id: { [Op.in]: nationalIds } },
      {},
    )
    await queryInterface.bulkDelete(
      'user_profile',
      { national_id: { [Op.in]: nationalIds } },
      {},
    )
  },
}
