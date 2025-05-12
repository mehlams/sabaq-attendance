"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { calculateAttendanceStats } from "@/lib/data"
import { isBrowser } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Phone } from "lucide-react"

export default function CumulativeAttendancePage({
  params,
}: {
  params: { sabaqId: string }
}) {
  const { sabaqId } = params
  const [stats, setStats] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isBrowser()) {
      const attendanceStats = calculateAttendanceStats(sabaqId)
      setStats(attendanceStats)
    }
  }, [sabaqId])

  if (!mounted || !isBrowser()) {
    return <div className="container py-10">Loading...</div>
  }

  if (!stats) {
    return (
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">No Attendance Records</h1>
          <Link href="/view-attendance">
            <Button variant="outline">Back to Attendance Records</Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No attendance records found for this Sabaq</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{stats.sabaqName}</h1>
          <p className="text-muted-foreground">Cumulative Attendance Statistics</p>
        </div>
        <Link href="/view-attendance">
          <Button variant="outline">Back to Attendance Records</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
          <CardDescription>Total Classes: {stats.totalClasses}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>ITS Number</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Classes Attended</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.studentStats.map((student: any) => (
                <TableRow key={student.itsNumber}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.itsNumber}</TableCell>
                  <TableCell>
                    <a
                      href={`tel:${student.phoneNumber}`}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                    >
                      <Phone className="h-3 w-3" />
                      {student.phoneNumber}
                    </a>
                  </TableCell>
                  <TableCell>
                    {student.classesAttended} of {student.totalClasses}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            student.attendancePercentage >= 75
                              ? "bg-green-500"
                              : student.attendancePercentage >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${student.attendancePercentage}%` }}
                        ></div>
                      </div>
                      <span>{student.attendancePercentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        student.attendancePercentage >= 75
                          ? "bg-green-100 text-green-800"
                          : student.attendancePercentage >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.attendancePercentage >= 75
                        ? "Good"
                        : student.attendancePercentage >= 50
                          ? "Average"
                          : "Poor"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
