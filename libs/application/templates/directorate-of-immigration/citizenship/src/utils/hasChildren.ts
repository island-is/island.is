export const hasChildren = (externalData: any) => {
  const children = externalData.childrenCustodyInformation?.data
  return children && children.length > 0
}
