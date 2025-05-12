"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { asbaaqList } from "@/lib/data"
import { isBrowser } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TakeAttendancePage() {
  const router = useRouter()
  const [selectedSabaq, setSelectedSabaq] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [mounted, setMounted] = useState(false)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    setMounted(true)
    setSelectedDate(today)
  }, [])

  if (!mounted && !isBrowser()) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSabaq && selectedDate) {
      router.push(`/take-attendance/${selectedSabaq}/${selectedDate}`)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Take Attendance</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Select Sabaq and Date</CardTitle>
          <CardDescription>Choose a Sabaq and date to take attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sabaq">Select Sabaq</Label>
              <Select value={selectedSabaq} onValueChange={setSelectedSabaq} required>
                <SelectTrigger id="sabaq">
                  <SelectValue placeholder="Select a Sabaq" />
                </SelectTrigger>
                <SelectContent>
                  {asbaaqList.map((sabaq) => (
                    <SelectItem key={sabaq.id} value={sabaq.id}>
                      {sabaq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={today}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedSabaq || !selectedDate}>
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
