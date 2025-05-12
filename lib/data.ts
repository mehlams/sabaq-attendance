// Update the data structure to include student names and phone numbers
// This file contains the pre-fed data for Asbaaq and enrolled students
// You can easily modify this data to add or remove Asbaaq or students

// Define the type for a student
export type Student = {
  itsNumber: string // 8-digit ITS number
  name: string // Student name
  phoneNumber: string // Student phone number
}

// Define the type for a Sabaq (class)
export type Sabaq = {
  id: string
  name: string
  enrolledStudents: Student[] // Array of students with ITS numbers, names, and phone numbers
}

// Define the type for attendance record
export type AttendanceRecord = {
  sabaqId: string
  date: string
  presentStudents: string[] // Array of 8-digit ITS numbers of present students
}

// Pre-fed list of Asbaaq (classes)
export const asbaaqList: Sabaq[] = [
  {
    id: "sabaq-1",
    name: "Islamic History",
    enrolledStudents: [
      { itsNumber: "12345678", name: "Ahmed Ali", phoneNumber: "+1234567890" },
      { itsNumber: "23456789", name: "Fatima Khan", phoneNumber: "+2345678901" },
      { itsNumber: "34567890", name: "Zainab Hussein", phoneNumber: "+3456789012" },
      { itsNumber: "45678901", name: "Ibrahim Patel", phoneNumber: "+4567890123" },
      { itsNumber: "56789012", name: "Maryam Sheikh", phoneNumber: "+5678901234" },
    ],
  },
  {
    id: "sabaq-2",
    name: "Quranic Studies",
    enrolledStudents: [
      { itsNumber: "12345678", name: "Ahmed Ali", phoneNumber: "+1234567890" },
      { itsNumber: "23456789", name: "Fatima Khan", phoneNumber: "+2345678901" },
      { itsNumber: "34567890", name: "Zainab Hussein", phoneNumber: "+3456789012" },
      { itsNumber: "67890123", name: "Yusuf Rahman", phoneNumber: "+6789012345" },
      { itsNumber: "78901234", name: "Aisha Malik", phoneNumber: "+7890123456" },
    ],
  },
  {
    id: "sabaq-3",
    name: "Arabic Language",
    enrolledStudents: [
      { itsNumber: "45678901", name: "Ibrahim Patel", phoneNumber: "+4567890123" },
      { itsNumber: "56789012", name: "Maryam Sheikh", phoneNumber: "+5678901234" },
      { itsNumber: "67890123", name: "Yusuf Rahman", phoneNumber: "+6789012345" },
      { itsNumber: "78901234", name: "Aisha Malik", phoneNumber: "+7890123456" },
      { itsNumber: "89012345", name: "Hassan Ahmed", phoneNumber: "+8901234567" },
    ],
  },
  {
    id: "sabaq-4",
    name: "Islamic Ethics",
    enrolledStudents: [
      { itsNumber: "12345678", name: "Ahmed Ali", phoneNumber: "+1234567890" },
      { itsNumber: "56789012", name: "Maryam Sheikh", phoneNumber: "+5678901234" },
      { itsNumber: "67890123", name: "Yusuf Rahman", phoneNumber: "+6789012345" },
      { itsNumber: "89012345", name: "Hassan Ahmed", phoneNumber: "+8901234567" },
      { itsNumber: "90123456", name: "Khadija Omar", phoneNumber: "+9012345678" },
    ],
  },
]

// Helper function to get student by ITS number from a Sabaq
export function getStudentByItsNumber(sabaq: Sabaq, itsNumber: string): Student | undefined {
  return sabaq.enrolledStudents.find((student) => student.itsNumber === itsNumber)
}

// Helper function to get student name by ITS number from a Sabaq
export function getStudentNameByItsNumber(sabaq: Sabaq, itsNumber: string): string {
  const student = getStudentByItsNumber(sabaq, itsNumber)
  return student ? student.name : "Unknown Student"
}

// Helper function to get student phone number by ITS number from a Sabaq
export function getStudentPhoneByItsNumber(sabaq: Sabaq, itsNumber: string): string {
  const student = getStudentByItsNumber(sabaq, itsNumber)
  return student ? student.phoneNumber : ""
}

// Function to get a Sabaq by ID
export function getSabaqById(id: string): Sabaq | undefined {
  return asbaaqList.find((sabaq) => sabaq.id === id)
}

// Function to get a Sabaq by name
export function getSabaqByName(name: string): Sabaq | undefined {
  return asbaaqList.find((sabaq) => sabaq.name === name)
}

// Local storage keys
export const ATTENDANCE_STORAGE_KEY = "attendance-records"

// Function to save attendance record
export function saveAttendanceRecord(record: AttendanceRecord): void {
  // Get existing records from localStorage
  const existingRecordsJSON = localStorage.getItem(ATTENDANCE_STORAGE_KEY)
  const existingRecords: AttendanceRecord[] = existingRecordsJSON ? JSON.parse(existingRecordsJSON) : []

  // Check if record for this sabaq and date already exists
  const existingRecordIndex = existingRecords.findIndex((r) => r.sabaqId === record.sabaqId && r.date === record.date)

  if (existingRecordIndex !== -1) {
    // Update existing record
    existingRecords[existingRecordIndex] = record
  } else {
    // Add new record
    existingRecords.push(record)
  }

  // Save back to localStorage
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(existingRecords))
}

// Function to get all attendance records
export function getAllAttendanceRecords(): AttendanceRecord[] {
  const recordsJSON = localStorage.getItem(ATTENDANCE_STORAGE_KEY)
  return recordsJSON ? JSON.parse(recordsJSON) : []
}

// Function to get attendance record for a specific sabaq and date
export function getAttendanceRecord(sabaqId: string, date: string): AttendanceRecord | undefined {
  const records = getAllAttendanceRecords()
  return records.find((r) => r.sabaqId === sabaqId && r.date === date)
}

// Function to get all attendance records for a specific sabaq
export function getAttendanceRecordsForSabaq(sabaqId: string): AttendanceRecord[] {
  const records = getAllAttendanceRecords()
  return records.filter((r) => r.sabaqId === sabaqId)
}

// Function to calculate attendance statistics for a sabaq
export function calculateAttendanceStats(sabaqId: string) {
  const sabaq = getSabaqById(sabaqId)
  if (!sabaq) return null

  const records = getAttendanceRecordsForSabaq(sabaqId)
  const totalClasses = records.length

  if (totalClasses === 0) return null

  const studentStats = sabaq.enrolledStudents.map((student) => {
    // Count how many classes this student attended
    const classesAttended = records.filter((record) => record.presentStudents.includes(student.itsNumber)).length

    // Calculate attendance percentage
    const attendancePercentage = totalClasses > 0 ? Math.round((classesAttended / totalClasses) * 100) : 0

    return {
      itsNumber: student.itsNumber,
      name: student.name,
      phoneNumber: student.phoneNumber,
      classesAttended,
      totalClasses,
      attendancePercentage,
    }
  })

  // Sort by attendance percentage (descending)
  studentStats.sort((a, b) => b.attendancePercentage - a.attendancePercentage)

  return {
    sabaqName: sabaq.name,
    totalClasses,
    studentStats,
  }
}

// Function to format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
