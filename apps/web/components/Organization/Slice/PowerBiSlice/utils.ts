export const DEFAULT_ASPECT_RATIO = '16/9'
export const DEFAULT_MOBILE_ASPECT_RATIO = '9/16'

type StyleConfig = Record<string, string | undefined | null>

type PageSize = { width?: number; height?: number }

export const hasDimensions = (size?: PageSize) =>
  (size?.width ?? 0) > 0 && (size?.height ?? 0) > 0

/**
 * Returns a css aspect-ratio value for a Power BI page size,
 * or the fallback if the report doesn't provide usable dimensions.
 */
export const getAspectRatio = (size: PageSize | undefined, fallback: string) =>
  hasDimensions(size) ? `${size?.width}/${size?.height}` : fallback

/** True if the CMS config decides the height of the report by itself */
export const hasConfiguredSize = (style?: StyleConfig | null) =>
  Boolean(style?.height || style?.aspectRatio)

export const applyStyles = (
  element: HTMLElement,
  style?: StyleConfig | null,
) => {
  for (const [key, value] of Object.entries(style ?? {})) {
    if (value) {
      Object.assign(element.style, { [key]: value })
    }
  }
}
