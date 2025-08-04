"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, Calendar, ArrowLeft } from "lucide-react"
import { formatDateForDisplay } from "@/utils/dateUtils"

export default function DoctorProfilePage() {
  const params = useParams()
  const { state } = useApp()
  const doctorId = params.id as string

  const doctor = state.doctors.find((d) => d.id === doctorId)

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-32 h-32 mx-auto sm:mx-0">
                  <Image
                    src={doctor.profileImage || "/placeholder.svg"}
                    alt={doctor.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                  <Badge variant="secondary" className="mb-4">
                    {doctor.specialization}
                  </Badge>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{doctor.location}</span>
                    </div>

                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{doctor.rating} rating</span>
                      <span className="text-gray-500">• {doctor.experience} years experience</span>
                    </div>

                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Badge variant={doctor.isAvailable ? "default" : "destructive"}>
                        {doctor.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Available Appointments
              </CardTitle>
            </CardHeader>

            <CardContent>
              {doctor.isAvailable && availableSlots.length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedSlots).map(([date, slots]) => (
                    <div key={date}>
                      <h4 className="font-medium text-gray-900 mb-2">{formatDateForDisplay(date)}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot) => (
                          <Link key={slot.id} href={`/book/${doctor.id}?slot=${slot.id}`}>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              {slot.time}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <Link href={`/book/${doctor.id}`}>
                      <Button className="w-full">Book Appointment</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">
                    {doctor.isAvailable ? "No available slots at the moment" : "Doctor is currently unavailable"}
                  </p>
                  <Button disabled className="w-full">
                    Book Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
