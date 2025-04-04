interface CarbonEntry {
  date: string
  timestamp: number
  footprint: number
  activities: {
    energy: number
    carTravel: number
    food: number
    electricity: number
  }
}

const CARBON_STORAGE_KEY = 'eco-track-carbon-data'
const RECENT_INPUTS_KEY = 'eco-track-recent-inputs'

interface RecentInputs {
  energy: string
  carTravel: string
  food: string
  electricity: string
  timestamp: number
}

export function saveRecentInputs(inputs: Omit<RecentInputs, 'timestamp'>) {
  const data = {
    ...inputs,
    timestamp: Date.now()
  }
  localStorage.setItem(RECENT_INPUTS_KEY, JSON.stringify(data))
}

export function getRecentInputs(): RecentInputs | null {
  const data = localStorage.getItem(RECENT_INPUTS_KEY)
  return data ? JSON.parse(data) : null
}

export function saveCarbonData(date: Date, footprint: number, activities: any) {
  const entries = getCarbonData()
  // Use local date string instead of UTC
  const dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0]
  
  const existingIndex = entries.findIndex(e => e.date === dateStr)
  if (existingIndex >= 0) {
    entries[existingIndex] = { 
      date: dateStr, 
      timestamp: Date.now(),
      footprint, 
      activities 
    }
  } else {
    entries.push({ 
      date: dateStr, 
      timestamp: Date.now(),
      footprint, 
      activities 
    })
  }

  localStorage.setItem(CARBON_STORAGE_KEY, JSON.stringify(entries))
}

export function getRecentCarbonData(days: number = 7): CarbonEntry[] {
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000)
  return getCarbonData()
    .filter(entry => entry.timestamp >= cutoff)
    .sort((a, b) => b.timestamp - a.timestamp)
}

export function getCarbonData(): CarbonEntry[] {
  const data = localStorage.getItem(CARBON_STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function getCarbonDataForDate(date: Date): CarbonEntry | null {
  // Use same local date conversion for consistency
  const dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0]
  return getCarbonData().find(e => e.date === dateStr) || null
}
