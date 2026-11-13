import { AdStaffSource } from './types'

export const TEAM_MEMBER_CONTENT_TYPE = 'teamMember'

/** Synced entries get ids like `adstaff-<source key>-<Entra ID object id>` */
export const ENTRY_ID_PREFIX = 'adstaff'

/** Never remove more than this share of the synced members in one run */
export const MAX_REMOVAL_RATIO = 0.5

export const AD_STAFF_SOURCES: Array<AdStaffSource> = [
  {
    // Ráðgjafar- og greiningarstöð
    key: 'rgr',
    // TODO: this is the example staff list, swap for the real one before go-live
    teamListId: '5sq3W6pM9LezTjdUiKZb8i',
    contentfulTagId: 'ownerRgr',
    // The organization logo
    placeholderPhotoAssetId: '1IS33w9YpAo5Bx6aaRb7YF',
    // TODO: confirm the department names used in RGR's Entra ID
    departmentTagIds: {
      Greiningarsvið: '5vxnEC4ER5maL0ziDvzsbz',
      Ráðgjafarsvið: '1n8xzAFpgxLX6KkteN1WU9',
      'Skrifstofa forstjóra': '5EFgvsDsF2sWnDrdfQVhWO',
    },
  },
]
