export const generateFormHtml = (
  postUrl: string,
  scriptPath: string,
  verificationFields: { name: string; value: string }[],
): string => {
  const fieldsHtml = verificationFields
    .map(
      (field) =>
        `<input type="hidden" name="${field.name}" value="${field.value}">`,
    )
    .join('')
  return `
      <script src="${scriptPath}"></script>
      <form id="threeDSForm" action="${postUrl}" method="POST">
        ${fieldsHtml}
        <input type="submit" style="display: none;" />
      </form>
      <script>document.getElementById('threeDSForm').submit();</script>
    `
}
