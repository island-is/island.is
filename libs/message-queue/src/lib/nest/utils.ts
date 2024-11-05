const TOKEN_PREFIX = 'IslandIsMessageQueue'
const WORK_STARTING_HOUR = 8 // 8 AM
const WORK_ENDING_HOUR = 23 // 11 PM

export const getQueueServiceToken = (name: string): string =>
  `${TOKEN_PREFIX}/QueueService/${name}`

export const getWorkerServiceToken = (name: string): string =>
  `${TOKEN_PREFIX}/WorkerService/${name}`

export const getClientServiceToken = (name: string): string =>
  `${TOKEN_PREFIX}/ClientService/${name}`

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v))

export const isOutsideWorkingHours = (): boolean => {
  const now = new Date()
  const currentHour = now.getHours()

  return currentHour < WORK_STARTING_HOUR || currentHour >= WORK_ENDING_HOUR
}

export const calculateSleepDurationUntilMorning = (): number => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const sleepHours = (24 - currentHour + WORK_STARTING_HOUR) % 24;
  return (sleepHours * 3600 - currentMinutes * 60 - currentSeconds) * 1000;
};

export const sleepUntilMorning = (): Promise<void> => {
  const ms = calculateSleepDurationUntilMorning()

  return new Promise((resolve) => setTimeout(resolve, ms))
}
