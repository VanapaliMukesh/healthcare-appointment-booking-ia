export interface Doctor {
  id: string
  name: string
  specialization: string
  profileImage: string
  isAvailable: boolean
  experience: number
  rating: number
  location: string
  bio: string
  availableSlots: TimeSlot[]
}

export interface TimeSlot {
  id: string
  date: string
  time: string
  isBooked: boolean
}

export interface Appointment {
  id: string
  doctorId: string
  patientName: string
  patientEmail: string
  date: string
  time: string
  status: "confirmed" | "pending" | "cancelled"
}

export interface BookingFormData {
  patientName: string
  patientEmail: string
  selectedDate: string
  selectedTime: string
}
