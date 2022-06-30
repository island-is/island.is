export function baseMapper<T>(entity: T): T {
  return {
    ...entity,
    initial: true,
  }
}
