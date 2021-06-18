// TODO: add link to original DOC/PDF file in Stjórnartíðindi's data store.
/** Regulations are roughly classified based on whether they contain
 * any original text/stipulations, or whether they **only**  prescribe
 * changes to other regulations.
 *
 * `base` = Stofnreglugerð
 * `amending` = Breytingareglugerð
 */
export type RegulationType = 'base' | 'amending'

// TODO: add link to original DOC/PDF file in Stjórnartíðindi's data store.
/** Regulations are roughly classified based on whether they contain
 * any original text/stipulations, or whether they **only**  prescribe
 * changes to other regulations.
 *
 * `draft` = The regulation is still being drafted. Do NOT edit and/or publish!
 * `proposal` = The regulation is ready for a final review/tweaking by an editor.
 * `shipped` = The regulation has been sent to Stjórnartíðindi and is awaiting formal publication.
 */
export type DraftingStatus = 'draft' | 'proposal' | 'shipped'

// ---------------------------------------------------------------------------

export type UserRole = 'author' | 'editor'

// ---------------------------------------------------------------------------

declare const _Kennitala__Brand: unique symbol
/** Icelandic national census id number  */
export type Kennitala = string & { [_Kennitala__Brand]: true }
