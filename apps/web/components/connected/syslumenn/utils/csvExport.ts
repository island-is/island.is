const DEFAULT_CSV_COLUMN_SEPARATOR = ','
const DEFAULT_CSV_LINE_SEPARATOR = '\n'

/**
 * Used for handling the case if the value it self contains the CSV column separator.
 * E.g. in many cases, an address field contains ',' (e.g. "Street X, 101 Reykjavik").
 * @param value The original value for the CSV value
 * @param columnSeparator CSV column separator
 * @returns The value in a format that safely contains the CSV column separator, i.e. that does not interfer with the column separation of the CSV.
 */
const csvColumnSeparatorSafeValue = (
  value: string,
  columnSeparator: string,
): string => {
  return value?.includes(columnSeparator) ? `"${value}"` : value
}

/**
 * Prepares a CSV string using the provided Header, Values and (optional) separators
 * @param headerRow A list of column headers for the CSV.
 * @param dataRows A list containing all data rows, where each data row is a list of CSV column values.
 * @param columnSeparator Optionally provide a column separator for the CSV.
 * @param lineSeparator Optionally provide a line separator for the CSV.
 * @returns
 */
export const prepareCsvString = (
  headerRow: string[],
  dataRows: string[][],
  columnSeparator = DEFAULT_CSV_COLUMN_SEPARATOR,
  lineSeparator = DEFAULT_CSV_LINE_SEPARATOR,
): string => {
  // CSV Header Line
  const headerLine = headerRow.join(columnSeparator)
  const csvLines = [headerLine]

  // CSV Data Lines
  for (const dataRow of dataRows) {
    const columnValues = dataRow.map((columnValue) =>
      csvColumnSeparatorSafeValue(columnValue, columnSeparator),
    )
    csvLines.push(columnValues.join(columnSeparator))
  }

  return csvLines.join(lineSeparator)
}
