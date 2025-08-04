import Link from "next/link"
import { Stethoscope } from "lucide-react"
import { CurrentDateTime } from "./CurrentDateTime"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HealthCare Booking</h1>
          </Link>
          <CurrentDateTime />
        </div>
      </div>
    </header>
  )
}
