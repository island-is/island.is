// type Messages = { [key: string]: string }
type Nully = undefined | null
type NamespaceValues = string | ReadonlyArray<string>
export type NamespaceMessages = Readonly<
  Record<string, NamespaceValues | undefined | null>
>

type RetVal<Value, Fallback> = Value extends Nully
  ? Fallback
  : Value extends Exclude<Value, Nully>
  ? Value
  : Exclude<Value, Nully> | Fallback

export type NamespaceGetter<M extends NamespaceMessages> = {
  <K extends keyof M>(key: K, fallback?: Nully): RetVal<M[K], K>
  <K extends keyof M, F extends NamespaceValues>(key: K, fallback: F): RetVal<
    M[K],
    F
  >
  /** @deprecated
   * Sloppy fallback version (based on the assumption that this is somehow desirable/practical)
   */
  (key: string, fallback?: any): any
}

// NOTE: Typesafe/clever/strict signature to provide nice auto-complete for cases
// where `namespace`'s type is fully described
export function useNamespaceStrict<M extends NamespaceMessages>(
  namespace: M = {} as M,
): NamespaceGetter<M> {
  return (key: string, fallback?: any) => {
    return namespace[key] ?? fallback ?? key
  }
}

// NOTE: Dumb signature that accepts arbitrary `key` values and returns any
// (The "clever" signature above is entirely opt-in)
// TODO: mark this as @deprecated
export function useNamespace(namespace = {}) {
  return (key: string, fallback?: any) => {
    return namespace[key as keyof typeof namespace] ?? fallback ?? key
  }
}
