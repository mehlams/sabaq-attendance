"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSabaqById, getAttendanceRecord, formatDate, getStudentByItsNumber } from "@/lib/data"
import { isBrowser } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"

export default function ViewAttendanceDetailPage({
  params,
}: {
  params: { sabaqId: string; date: string }
}) {
  const { sabaqId, date } = params
  const [sabaq, setSabaq] = useState<any>(null)
  const [attendanceRecord, setAttendanceRecord] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isBrowser()) {
      const sabaqData = getSabaqById(sabaqId)
      setSabaq(sabaqData)

      const record = getAttendanceRecord(sabaqId, date)
      setAttendanceRecord(record)
    }
  }, [sabaqId, date])

  if (!mounted || !isBrowser()) {
    return <div className="container py-10">Loading...</div>
  }

  if (!sabaq || !attendanceRecord) {
    return (
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Attendance Record Not Found</h1>
          <Link href="/view-attendance">
            <Button variant="outline">Back to Attendance Records</Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">The attendance record you are looking for does not exist</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate absent students
  const absentStudents = sabaq.enrolledStudents
    .filter((student: any) => !attendanceRecord.presentStudents.includes(student.itsNumber))
    .map((student: any) => student)

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{sabaq.name}</h1>
          <p className="text-muted-foreground">{formatDate(date)}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/view-attendance/cumulative/${sabaqId}`}>
            <Button variant="outline">View Cumulative Attendance</Button>
          </Link>
          <Link href="/view-attendance">
            <Button variant="outline">Back to Attendance Records</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>
              {attendanceRecord.presentStudents.length} of {sabaq.enrolledStudents.length} students present
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Present: {attendanceRecord.presentStudents.length}</h3>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{
                      width: `${(attendanceRecord.presentStudents.length / sabaq.enrolledStudents.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Absent: {absentStudents.length}</h3>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${(absentStudents.length / sabaq.enrolledStudents.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Present Students</CardTitle>
              <CardDescription>{attendanceRecord.presentStudents.length} students</CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceRecord.presentStudents.length > 0 ? (
                <ul className="max-h-[200px] space-y-2 overflow-y-auto">
                  {attendanceRecord.presentStudents.map((itsNum: string) => {
                    const student = getStudentByItsNumber(sabaq, itsNum)
                    return (
                      <li key={itsNum} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="font-medium">{student?.name}</span>
                        <span className="text-sm text-muted-foreground">({itsNum})</span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground">No students present</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Absent Students</CardTitle>
              <CardDescription>{absentStudents.length} students</CardDescription>
            </CardHeader>
            <CardContent>
              {absentStudents.length > 0 ? (
                <ul className="max-h-[200px] space-y-2 overflow-y-auto">
                  {absentStudents.map((student: any) => (
                    <li key={student.itsNumber} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        <span className="font-medium">{student.name}</span>
                        <span className="text-sm text-muted-foreground">({student.itsNumber})</span>
                      </div>
                      <a
                        href={`tel:${student.phoneNumber}`}
                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                      >
                        <Phone className="h-3 w-3" />
                        {student.phoneNumber}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No students absent</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
