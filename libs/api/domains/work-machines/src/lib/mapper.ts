import {
  Action,
  ExternalLink,
  LinkCategory,
  LinkType,
} from './workMachines.types'

export const mapRelationToLink = (
  rel?: string,
): { type: LinkType; category: LinkCategory } | null => {
  if (!rel) {
    return null
  }

  switch (rel) {
    case 'self':
      return {
        type: LinkType.SELF,
        category: LinkCategory.META,
      }
    case 'nextPage':
      return {
        type: LinkType.NEXT_PAGE,
        category: LinkCategory.META,
      }
    case 'csv':
      return {
        type: LinkType.CSV,
        category: LinkCategory.DOWNLOAD,
      }
    case 'excel':
      return {
        type: LinkType.EXCEL,
        category: LinkCategory.DOWNLOAD,
      }
    case 'requestInspection':
      return {
        type: LinkType.REQUEST_INSPECTION,
        category: LinkCategory.ACTION,
      }
    case 'changeStatus':
      return { type: LinkType.CHANGE_STATUS, category: LinkCategory.ACTION }
    case 'ownerChange':
      return { type: LinkType.OWNER_CHANGE, category: LinkCategory.ACTION }
    case 'supervisorChange':
      return {
        type: LinkType.SUPERVISOR_CHANGE,
        category: LinkCategory.ACTION,
      }
    case 'registerForTraffic':
      return {
        type: LinkType.REGISTER_FOR_TRAFFIC,
        category: LinkCategory.ACTION,
      }
  }

  return null
}

//DEPRECATED BELOW

export const mapRelToAction = (rel?: string) => {
  switch (rel) {
    case 'requestInspection':
      return Action.REQUEST_INSPECTION
    case 'changeStatus':
      return Action.CHANGE_STATUS
    case 'ownerChange':
      return Action.OWNER_CHANGE
    case 'supervisorChange':
      return Action.SUPERVISOR_CHANGE
    case 'registerForTraffic':
      return Action.REGISTER_FOR_TRAFFIC
    default:
      return null
  }
}

export const mapRelToCollectionLink = (rel?: string) => {
  switch (rel) {
    case 'self':
      return ExternalLink.SELF
    case 'nextPage':
      return ExternalLink.NEXT_PAGE
    case 'excel':
      return ExternalLink.EXCEL
    case 'csv':
      return ExternalLink.CSV
    default:
      return null
  }
}
