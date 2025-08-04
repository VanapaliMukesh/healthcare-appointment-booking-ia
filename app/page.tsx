"use client"

import { useMemo } from "react"
import { DoctorCard } from "@/components/DoctorCard"
import { SearchBar } from "@/components/SearchBar"
import { useApp } from "@/context/AppContext"

export default function HomePage() {
  const { state } = useApp()

  const filteredDoctors = useMemo(() => {
    if (!state.searchQuery) return state.doctors

    return state.doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(state.searchQuery.toLowerCase()),
    )
  }, [state.doctors, state.searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Healthcare Professional</h1>
        <p className="text-lg text-gray-600 mb-8">Book appointments with qualified doctors in your area</p>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
