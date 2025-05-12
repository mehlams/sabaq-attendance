"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getAllAttendanceRecords, getSabaqById, formatDate } from "@/lib/data"
import { isBrowser } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ViewAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [sabaqGroups, setSabaqGroups] = useState<any>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isBrowser()) {
      const records = getAllAttendanceRecords()

      // Enhance records with sabaq name
      const enhancedRecords = records.map((record) => {
        const sabaq = getSabaqById(record.sabaqId)
        return {
          ...record,
          sabaqName: sabaq ? sabaq.name : "Unknown Sabaq",
        }
      })

      // Sort by date (newest first)
      enhancedRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setAttendanceRecords(enhancedRecords)

      // Group records by sabaqId
      const groups = enhancedRecords.reduce((acc: any, record) => {
        if (!acc[record.sabaqId]) {
          acc[record.sabaqId] = {
            id: record.sabaqId,
            name: record.sabaqName,
            records: [],
          }
        }
        acc[record.sabaqId].records.push(record)
        return acc
      }, {})

      setSabaqGroups(groups)
    }
  }, [])

  if (!mounted && !isBrowser()) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">View Attendance</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {attendanceRecords.length > 0 ? (
        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Records</TabsTrigger>
              {Object.values(sabaqGroups).map((group: any) => (
                <TabsTrigger key={group.id} value={group.id}>
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {attendanceRecords.map((record, index) => (
                  <Link
                    href={`/view-attendance/${record.sabaqId}/${record.date}`}
                    key={`${record.sabaqId}-${record.date}-${index}`}
                  >
                    <Card className="h-full cursor-pointer transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle>{record.sabaqName}</CardTitle>
                        <CardDescription>{formatDate(record.date)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {record.presentStudents.length} students present
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {Object.values(sabaqGroups).map((group: any) => (
              <TabsContent key={group.id} value={group.id}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{group.name}</h2>
                  <Link href={`/view-attendance/cumulative/${group.id}`}>
                    <Button>View Cumulative Attendance</Button>
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.records.map((record: any, index: number) => (
                    <Link
                      href={`/view-attendance/${record.sabaqId}/${record.date}`}
                      key={`${record.sabaqId}-${record.date}-${index}`}
                    >
                      <Card className="h-full cursor-pointer transition-all hover:shadow-md">
                        <CardHeader>
                          <CardTitle>{record.sabaqName}</CardTitle>
                          <CardDescription>{formatDate(record.date)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {record.presentStudents.length} students present
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No attendance records found</p>
            <Link href="/take-attendance" className="mt-4 inline-block">
              <Button>Take Attendance</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
