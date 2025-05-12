"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSabaqById, saveAttendanceRecord, getAttendanceRecord, getStudentNameByItsNumber } from "@/lib/data"
import { isBrowser } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function TakeAttendancePage({
  params,
}: {
  params: { sabaqId: string; date: string }
}) {
  const router = useRouter()
  const { sabaqId, date } = params
  const [itsNumber, setItsNumber] = useState("")
  const [presentStudents, setPresentStudents] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [sabaq, setSabaq] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    if (isBrowser()) {
      const sabaqData = getSabaqById(sabaqId)
      setSabaq(sabaqData)

      // Check if attendance already exists for this sabaq and date
      const existingRecord = getAttendanceRecord(sabaqId, date)
      if (existingRecord) {
        setPresentStudents(existingRecord.presentStudents)
      }
    }
  }, [sabaqId, date])

  if (!mounted || !isBrowser() || !sabaq) {
    return <div className="container py-10">Loading...</div>
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate ITS number format (8 digits)
    if (!/^\d{8}$/.test(itsNumber)) {
      toast({
        title: "Invalid ITS Number",
        description: "Please enter a valid 8-digit ITS number",
        variant: "destructive",
      })
      return
    }

    // Check if student is enrolled in this sabaq
    const isEnrolled = sabaq.enrolledStudents.some((student: any) => student.itsNumber === itsNumber)
    if (!isEnrolled) {
      toast({
        title: "Student Not Enrolled",
        description: `ITS Number ${itsNumber} is not enrolled in this Sabaq`,
        variant: "destructive",
      })
      return
    }

    // Check if student is already marked present
    if (presentStudents.includes(itsNumber)) {
      toast({
        title: "Already Marked Present",
        description: `ITS Number ${itsNumber} is already marked present`,
        variant: "destructive",
      })
      return
    }

    // Add student to present list
    const updatedPresentStudents = [...presentStudents, itsNumber]
    setPresentStudents(updatedPresentStudents)

    // Save attendance record
    saveAttendanceRecord({
      sabaqId,
      date,
      presentStudents: updatedPresentStudents,
    })

    const studentName = getStudentNameByItsNumber(sabaq, itsNumber)
    toast({
      title: "Attendance Marked",
      description: `${studentName} (${itsNumber}) marked present successfully`,
    })

    // Clear input
    setItsNumber("")
  }

  const handleSaveAndExit = () => {
    // Save attendance record
    saveAttendanceRecord({
      sabaqId,
      date,
      presentStudents,
    })

    toast({
      title: "Attendance Saved",
      description: "Attendance record has been saved successfully",
    })

    // Redirect to home after a short delay
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{sabaq.name}</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveAndExit}>
            Save & Exit
          </Button>
          <Link href="/take-attendance">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Enter 8-digit ITS number to mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itsNumber">ITS Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="itsNumber"
                    value={itsNumber}
                    onChange={(e) => setItsNumber(e.target.value)}
                    placeholder="Enter 8-digit ITS number"
                    pattern="[0-9]{8}"
                    maxLength={8}
                    required
                  />
                  <Button type="submit">Mark Present</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Present Students</CardTitle>
            <CardDescription>
              {presentStudents.length} of {sabaq.enrolledStudents.length} students present
            </CardDescription>
          </CardHeader>
          <CardContent>
            {presentStudents.length > 0 ? (
              <ul className="space-y-2">
                {presentStudents.map((itsNum) => {
                  const studentName = getStudentNameByItsNumber(sabaq, itsNum)
                  return (
                    <li key={itsNum} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="font-medium">{studentName}</span>
                      <span className="text-sm text-muted-foreground">({itsNum})</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground">No students marked present yet</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
