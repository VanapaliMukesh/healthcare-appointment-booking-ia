import Image from "next/image"
import Link from "next/link"
import type { Doctor } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MapPin, Star, Clock } from "lucide-react"

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={doctor.profileImage || "/placeholder.svg"}
            alt={doctor.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold">{doctor.name}</h3>
        <Badge variant="secondary" className="w-fit mx-auto">
          {doctor.specialization}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{doctor.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{doctor.rating}</span>
          <span className="text-muted-foreground">({doctor.experience} years exp.)</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          <Badge variant={doctor.isAvailable ? "default" : "destructive"}>
            {doctor.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/doctor/${doctor.id}`} className="w-full">
          <Button className="w-full">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
