import { IsOwner } from './isOwner.decorator'
import { CurrentSignee, getCurrentSignee } from './signee.decorator'
import { AllowDelegation } from './allowDelegation.decorator'
import {
  AllowManager,
  RestrictGuarantor,
} from './parliamentaryUserTypes.decorator'
import { CurrentAdmin, getCurrentAdmin } from './admin.decorator'

export {
  AllowDelegation,
  CurrentSignee,
  IsOwner,
  getCurrentSignee,
  AllowManager,
  RestrictGuarantor,
  CurrentAdmin,
  getCurrentAdmin,
}
