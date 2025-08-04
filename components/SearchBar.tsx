"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useApp } from "@/context/AppContext"

export function SearchBar() {
  const { state, dispatch } = useApp()

  const handleSearch = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })
  }

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder="Search doctors by name or specialization..."
        value={state.searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
