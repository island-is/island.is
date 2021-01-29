export class TimeUtils {
  public static delay(delay: number) {
    return new Promise((r) => {
      setTimeout(r, delay)
    })
  }
}
