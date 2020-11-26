export function createFakeNavigatorAPI() {
  return {
    openEntry(entryId: string) {
      window.alert(`Open entry ${entryId}`)
    },
    openAsset(assetId: string) {
      window.alert(`Open asset ${assetId}`)
    },
  }
}
