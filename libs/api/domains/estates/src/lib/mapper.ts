import type { Estate, EstateCase, LocalizedText, EstateAction } from '@island.is/clients/estates'
import { isDefined } from '@island.is/shared/utils'
import { LocaleEnum } from '@island.is/nest/graphql'
import { Estate as EstateModel } from './models/estate.model'
import { EstateCase as EstateCaseModel } from './models/case.model'
import { Action } from './models/action.model'

export const mapToEstate = (e: Estate): EstateModel | undefined => {
  if (!e.caseId || !e.deceased?.name || !e.deceased?.sid) {
    return undefined
  }

  return {
    id: e.caseId,
    nameOfDeceased: e.deceased.name,
    nationalIdOfDeceased: e.deceased.sid,
    dateOfDeath: e.dateOfDeath ?? undefined,
    isFinished: e.status?.isOpen !== undefined ? !e.status.isOpen : undefined,
    representative:
      e.representative?.name && e.representative?.sid
        ? { name: e.representative.name, nationalId: e.representative.sid }
        : undefined,
  }
}

export const mapToEstateCollection = (estates: Estate[]): EstateModel[] => {
  return estates.map(mapToEstate).filter(isDefined)
}

const resolveText = (
  t: LocalizedText | null | undefined,
  locale: LocaleEnum,
): string | undefined => {
  if (!t) return undefined
  return (locale === LocaleEnum.En ? t.en : t.is) ?? undefined
}

const mapAction = (
  a: EstateAction | null | undefined,
  locale: LocaleEnum,
): Action | undefined => {
  if (!a) return undefined
  return {
    type: a.type ?? undefined,
    label: resolveText(a.label, locale),
    url: a.url ?? undefined,
    method: a.method ?? undefined,
  }
}

export const mapToEstatesCase = (
  c: EstateCase,
  locale: LocaleEnum,
): EstateCaseModel => {
  const caseId = c.caseId?.value ?? undefined

  const deceased = (() => {
    const d = c.deceased
    if (!d?.name?.value) return undefined
    return {
      title: resolveText(d.title, locale),
      name: d.name.value ?? undefined,
      nationalId: d.sid?.value ?? undefined,
      dateOfDeath: d.dateOfDeath?.value ?? undefined,
    }
  })()

  const representative = (() => {
    const r = c.representative
    if (!r?.name || !r?.sid) return undefined
    return {
      name: r.name,
      nationalId: r.sid,
      text: resolveText(r.text, locale),
    }
  })()

  const estateManager = (() => {
    const m = c.estateManager
    if (!m?.name) return undefined
    return {
      name: m.name ?? undefined,
      nationalId: m.sid ?? undefined,
    }
  })()

  return {
    id: caseId ? `${caseId}-${locale}` : undefined,
    caseId,
    deceased,
    representative,
    estateManager,
    status: c.status
      ? {
          code: c.status.code ?? undefined,
          text: resolveText(c.status.text, locale),
          isOpen: c.status.isOpen,
        }
      : undefined,
    nextSteps: c.nextSteps
      ?.map((s) => ({
        code: s.code ?? undefined,
        description: resolveText(s.description, locale),
        detailedDescription: resolveText(s.detailedDescription, locale),
        stepStatus: s.stepStatus
          ? {
              code: s.stepStatus.code ?? undefined,
              text: resolveText(s.stepStatus.text, locale),
            }
          : undefined,
        action: mapAction(s.action, locale),
      }))
      .filter(isDefined),
    deadline: c.deadline
      ? {
          description: resolveText(c.deadline.description, locale),
          detailedDescription: resolveText(
            c.deadline.detailedDescription,
            locale,
          ),
          dueDate: c.deadline.dueDate ?? undefined,
          daysRemaining: c.deadline.daysRemaining ?? undefined,
        }
      : undefined,
    progress: c.progress
      ? {
          title: resolveText(c.progress.title, locale),
          steps: c.progress.steps
            ?.map((s) => ({
              order: s.order ?? undefined,
              code: s.code ?? undefined,
              state: s.state ?? undefined,
              completedDate: s.completedDate ?? undefined,
              description: resolveText(s.description, locale),
              information: resolveText(s.information, locale),
              action: mapAction(s.action, locale),
            }))
            .filter(isDefined),
        }
      : undefined,
    inheritors: c.inheritors
      ?.map((i) => ({
        name: i.person?.name ?? undefined,
        nationalId: i.person?.sid ?? undefined,
        relation: i.relation
          ? {
              code: i.relation.code ?? undefined,
              text: resolveText(i.relation.text, locale),
            }
          : undefined,
      }))
      .filter(isDefined),
    documents: c.documents
      ?.map((d) => ({
        name: d.name ?? undefined,
        documentTypeDescription: resolveText(d.documentTypeDescription, locale),
        documentDate: d.documentDate ?? undefined,
        availability: d.availability ?? undefined,
        islandIsDocumentId: d.islandIsDocumentId ?? undefined,
        requestAction: mapAction(d.requestAction, locale),
      }))
      .filter(isDefined),
  }
}
