import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

/**
 * One definition of "the same child", shared by the children provider (dedupe
 * and linking to existing leaves) and the template (resolving the selected and
 * follow-up child). VMST has no shared key for a child, so outside a VMST
 * application id a child is identified by its dates.
 */

/**
 * How far a due date may move between a registered pregnancy and the leave
 * already applied for it and still be the same pregnancy. A new pregnancy
 * cannot be due within this window of an earlier one.
 */
export const DUE_DATE_DRIFT_DAYS = 60

export interface ChildDates {
  expectedDateOfBirth?: string | null
  dateOfBirth?: string | null
  adoptionDate?: string | null
}

export interface ChildIdentity extends ChildDates {
  key?: string
  vmstApplicationId?: string
}

/**
 * The `yyyy-mm-dd` part of a date, or '' when there is none. VMST sends dates
 * with and without a time part; placeholders such as 'N/A' are not dates.
 */
export const toDay = (date?: string | null): string => {
  const day = (date ?? '').slice(0, 10)

  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : ''
}

const sameDay = (a?: string | null, b?: string | null) => {
  const dayA = toDay(a)

  return !!dayA && dayA === toDay(b)
}

/** True when both describe the same child: any one of their dates agrees. */
export const isSameChild = (a: ChildDates, b: ChildDates): boolean =>
  sameDay(a.expectedDateOfBirth, b.expectedDateOfBirth) ||
  sameDay(a.dateOfBirth, b.dateOfBirth) ||
  sameDay(a.adoptionDate, b.adoptionDate)

/**
 * True when a registered pregnancy is the unborn child an existing leave or
 * application was made for, even though the due date has since moved.
 */
export const isSamePregnancy = (
  pregnancyDueDate: string,
  existing: ChildDates,
): boolean => {
  if (toDay(existing.dateOfBirth) || toDay(existing.adoptionDate)) {
    return false
  }

  const dueDate = toDay(pregnancyDueDate)
  const expected = toDay(existing.expectedDateOfBirth)

  if (!dueDate || !expected) {
    return false
  }

  return (
    Math.abs(differenceInCalendarDays(new Date(dueDate), new Date(expected))) <=
    DUE_DATE_DRIFT_DAYS
  )
}

/**
 * The child's stable key, the value the select-child screen stores. The VMST
 * application id survives due-date changes and the birth; dates are the
 * fallback for a child VMST has no leave for. `undefined` when the child has
 * neither (e.g. a secondary parent without consent to see the child's dates).
 */
export const getChildKey = (child: ChildIdentity): string | undefined => {
  if (child.key) {
    return child.key
  }

  if (child.vmstApplicationId) {
    return `vmst:${child.vmstApplicationId}`
  }

  const adoptionDate = toDay(child.adoptionDate)
  if (adoptionDate) {
    return `adoption:${adoptionDate}`
  }

  const dateOfBirth = toDay(child.dateOfBirth)
  if (dateOfBirth) {
    return `dob:${dateOfBirth}`
  }

  const expectedDateOfBirth = toDay(child.expectedDateOfBirth)
  if (expectedDateOfBirth) {
    return `edd:${expectedDateOfBirth}`
  }

  return undefined
}

/** The value the select-child screen stores for the child at `index`. */
export const getChildSelectionValue = (child: ChildIdentity, index: number) =>
  getChildKey(child) ?? `${index}`

/**
 * The child a `selectedChild` answer points at. Answers store the child's key;
 * applications started before keys were introduced store its index, which is
 * still honoured.
 */
export const findChildBySelection = <T extends ChildIdentity>(
  children: T[],
  selection?: string | number | null,
): T | null => {
  if (selection === undefined || selection === null || selection === '') {
    return null
  }

  const value = String(selection)
  const byKey = children.find(
    (child, index) => getChildSelectionValue(child, index) === value,
  )
  if (byKey) {
    return byKey
  }

  if (/^\d+$/.test(value)) {
    return children[Number(value)] ?? null
  }

  return null
}

/**
 * Gives every child a unique `key`. Two children can only collide on a date key
 * when the data itself is ambiguous; a suffix keeps their selections apart.
 */
export const assignChildKeys = <T extends ChildIdentity>(
  children: T[],
): Array<T & { key: string }> => {
  const used = new Set<string>()

  return children.map((child, index) => {
    const base = getChildKey({ ...child, key: undefined }) ?? `child:${index}`
    let key = base
    let suffix = 2

    while (used.has(key)) {
      key = `${base}#${suffix++}`
    }

    used.add(key)

    return { ...child, key }
  })
}
