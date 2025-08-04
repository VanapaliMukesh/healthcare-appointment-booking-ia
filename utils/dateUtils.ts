export function getDateString(daysFromToday: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split("T")[0]
}

export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function isDateInPast(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function getNextAvailableDates(count = 14): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = 1; i <= count; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    // Skip Sundays (0) for medical appointments
    if (date.getDay() !== 0) {
      dates.push(date.toISOString().split("T")[0])
    }
  }

  return dates
}

export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export function getCurrentMonth(): string {
  return new Date().toLocaleDateString("en-US", { month: "long" })
}
