"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { asbaaqList } from "@/lib/data"
import { isBrowser } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AsbaaqListPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted && !isBrowser()) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Asbaaq List</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {asbaaqList.map((sabaq) => (
          <Card key={sabaq.id}>
            <CardHeader>
              <CardTitle>{sabaq.name}</CardTitle>
              <CardDescription>{sabaq.enrolledStudents.length} students enrolled</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ITS Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sabaq.enrolledStudents.map((student) => (
                    <TableRow key={student.itsNumber}>
                      <TableCell>{student.itsNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.phoneNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
