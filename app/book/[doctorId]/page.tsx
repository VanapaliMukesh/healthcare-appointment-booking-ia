"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle } from "lucide-react"
import type { BookingFormData } from "@/types"
import { isDateInPast, formatDateForDisplay } from "@/utils/dateUtils"

export default function BookAppointmentPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { state, dispatch } = useApp()

  const doctorId = params.doctorId as string
  const preselectedSlotId = searchParams.get("slot")

  const doctor = state.doctors.find((d) => d.id === doctorId)
  const preselectedSlot = doctor?.availableSlots.find((s) => s.id === preselectedSlotId)

  const [formData, setFormData] = useState<BookingFormData>({
    patientName: "",
    patientEmail: "",
    selectedDate: preselectedSlot?.date || "",
    selectedTime: preselectedSlot?.time || "",
  })

  const [errors, setErrors] = useState<Partial<BookingFormData>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const availableSlots = doctor.availableSlots.filter((slot) => !slot.isBooked)
  const groupedSlots = availableSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = []
      }
      acc[slot.date].push(slot)
      return acc
    },
    {} as Record<string, typeof availableSlots>,
  )

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {}

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required"
    }

    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.patientEmail)) {
      newErrors.patientEmail = "Please enter a valid email address"
    }

    if (!formData.selectedDate) {
      newErrors.selectedDate = "Please select a date"
    } else if (isDateInPast(formData.selectedDate)) {
      newErrors.selectedDate = "Cannot book appointments in the past"
    }

    if (!formData.selectedTime) {
      newErrors.selectedTime = "Please select a time"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const selectedSlot = availableSlots.find(
      (slot) => slot.date === formData.selectedDate && slot.time === formData.selectedTime,
    )

    if (selectedSlot) {
      // Add appointment
      dispatch({
        type: "ADD_APPOINTMENT",
        payload: {
          id: Date.now().toString(),
          doctorId: doctor.id,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          date: formData.selectedDate,
          time: formData.selectedTime,
          status: "confirmed",
        },
      })

      // Update slot availability
      dispatch({
        type: "UPDATE_DOCTOR_AVAILABILITY",
        payload: {
          doctorId: doctor.id,
          slotId: selectedSlot.id,
        },
      })
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Your appointment with {doctor.name} has been successfully booked for{" "}
                {new Date(formData.selectedDate).toLocaleDateString()} at {formData.selectedTime}.
              </p>
              <div className="space-y-3">
                <Link href={`/doctor/${doctor.id}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Doctor Profile
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/doctor/${doctor.id}`}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {doctor.name}
      </Link>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Book Appointment with {doctor.name}</CardTitle>
            <p className="text-muted-foreground">{doctor.specialization}</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                    className={errors.patientName ? "border-red-500" : ""}
                  />
                  {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>}
                </div>

                <div>
                  <Label htmlFor="patientEmail">Email Address *</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, patientEmail: e.target.value }))}
                    className={errors.patientEmail ? "border-red-500" : ""}
                  />
                  {errors.patientEmail && <p className="text-red-500 text-sm mt-1">{errors.patientEmail}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="selectedDate">Select Date *</Label>
                  <Select
                    value={formData.selectedDate}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, selectedDate: value, selectedTime: "" }))
                    }}
                  >
                    <SelectTrigger className={errors.selectedDate ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(groupedSlots).map((date) => (
                        <SelectItem key={date} value={date}>
                          {formatDateForDisplay(date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedDate && <p className="text-red-500 text-sm mt-1">{errors.selectedDate}</p>}
                </div>

                <div>
                  <Label htmlFor="selectedTime">Select Time *</Label>
                  <Select
                    value={formData.selectedTime}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, selectedTime: value }))}
                    disabled={!formData.selectedDate}
                  >
                    <SelectTrigger className={errors.selectedTime ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.selectedDate &&
                        groupedSlots[formData.selectedDate]?.map((slot) => (
                          <SelectItem key={slot.id} value={slot.time}>
                            {slot.time}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedTime && <p className="text-red-500 text-sm mt-1">{errors.selectedTime}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <Link href={`/doctor/${doctor.id}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
