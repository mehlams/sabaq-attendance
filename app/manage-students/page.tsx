"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { asbaaqList, getSabaqById } from "@/lib/data"
import { isBrowser } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ManageStudentsPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedSabaqId, setSelectedSabaqId] = useState("")
  const [newStudent, setNewStudent] = useState({ itsNumber: "", name: "", phoneNumber: "" })
  const [sabaq, setSabaq] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (selectedSabaqId && isBrowser()) {
      const selectedSabaq = getSabaqById(selectedSabaqId)
      setSabaq(selectedSabaq)
      if (selectedSabaq) {
        setStudents([...selectedSabaq.enrolledStudents])
      }
    }
  }, [selectedSabaqId])

  if (!mounted && !isBrowser()) {
    return null
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate ITS number format (8 digits)
    if (!/^\d{8}$/.test(newStudent.itsNumber)) {
      toast({
        title: "Invalid ITS Number",
        description: "Please enter a valid 8-digit ITS number",
        variant: "destructive",
      })
      return
    }

    // Validate name
    if (!newStudent.name.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name",
        variant: "destructive",
      })
      return
    }

    // Validate phone number (simple validation)
    if (!newStudent.phoneNumber.trim()) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    // Check if student already exists
    if (students.some((student) => student.itsNumber === newStudent.itsNumber)) {
      toast({
        title: "Student Already Exists",
        description: `A student with ITS Number ${newStudent.itsNumber} already exists in this Sabaq`,
        variant: "destructive",
      })
      return
    }

    // Add student to the list
    const updatedStudents = [...students, { ...newStudent }]
    setStudents(updatedStudents)

    // Update the sabaq in localStorage
    if (sabaq) {
      const updatedSabaq = { ...sabaq, enrolledStudents: updatedStudents }

      // Find the sabaq in the asbaaqList and update it
      const sabaqIndex = asbaaqList.findIndex((s) => s.id === sabaq.id)
      if (sabaqIndex !== -1) {
        asbaaqList[sabaqIndex] = updatedSabaq

        // Save to localStorage
        localStorage.setItem("asbaaq-list", JSON.stringify(asbaaqList))

        toast({
          title: "Student Added",
          description: `${newStudent.name} (${newStudent.itsNumber}) has been added to ${sabaq.name}`,
        })

        // Clear the form
        setNewStudent({ itsNumber: "", name: "", phoneNumber: "" })
      }
    }
  }

  const handleRemoveStudent = (itsNumber: string) => {
    if (!sabaq) return

    // Remove student from the list
    const updatedStudents = students.filter((student) => student.itsNumber !== itsNumber)
    setStudents(updatedStudents)

    // Update the sabaq in localStorage
    const updatedSabaq = { ...sabaq, enrolledStudents: updatedStudents }

    // Find the sabaq in the asbaaqList and update it
    const sabaqIndex = asbaaqList.findIndex((s) => s.id === sabaq.id)
    if (sabaqIndex !== -1) {
      asbaaqList[sabaqIndex] = updatedSabaq

      // Save to localStorage
      localStorage.setItem("asbaaq-list", JSON.stringify(asbaaqList))

      toast({
        title: "Student Removed",
        description: `Student with ITS Number ${itsNumber} has been removed from ${sabaq.name}`,
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Sabaq</CardTitle>
            <CardDescription>Choose a Sabaq to manage its students</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSabaqId} onValueChange={setSelectedSabaqId}>
              <SelectTrigger>
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
          </CardContent>
        </Card>

        {selectedSabaqId && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>Add a new student to {sabaq?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="itsNumber">ITS Number</Label>
                  <Input
                    id="itsNumber"
                    value={newStudent.itsNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, itsNumber: e.target.value })}
                    placeholder="Enter 8-digit ITS number"
                    pattern="[0-9]{8}"
                    maxLength={8}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name</Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Enter student name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={newStudent.phoneNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Student
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedSabaqId && students.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Enrolled Students in {sabaq?.name}</CardTitle>
            <CardDescription>{students.length} students enrolled</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ITS Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.itsNumber}>
                    <TableCell>{student.itsNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.phoneNumber}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveStudent(student.itsNumber)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Toaster />
    </div>
  )
}
