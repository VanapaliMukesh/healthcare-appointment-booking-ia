"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Doctor, Appointment } from "@/types"
import { mockDoctors } from "@/data/mockData"

interface AppState {
  doctors: Doctor[]
  appointments: Appointment[]
  searchQuery: string
}

type AppAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "ADD_APPOINTMENT"; payload: Appointment }
  | { type: "UPDATE_DOCTOR_AVAILABILITY"; payload: { doctorId: string; slotId: string } }

const initialState: AppState = {
  doctors: mockDoctors,
  appointments: [],
  searchQuery: "",
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }

    case "ADD_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      }

    case "UPDATE_DOCTOR_AVAILABILITY":
      return {
        ...state,
        doctors: state.doctors.map((doctor) =>
          doctor.id === action.payload.doctorId
            ? {
                ...doctor,
                availableSlots: doctor.availableSlots.map((slot) =>
                  slot.id === action.payload.slotId ? { ...slot, isBooked: true } : slot,
                ),
              }
            : doctor,
        ),
      }

    default:
      return state
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
