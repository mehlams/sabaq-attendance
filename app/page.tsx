import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12">
      <div className="mb-8 text-center">
        {/* Logo placeholder - Replace with your actual logo */}
        <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
          <Image
            src="/logo.png"
            alt="Attendance App Logo"
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold">Attendance Application</h1>
        <p className="text-muted-foreground">Manage attendance for Asbaaq</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Main Menu</CardTitle>
          <CardDescription>Select an option to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/take-attendance" className="w-full">
            <Button className="w-full" size="lg">
              Take Attendance
            </Button>
          </Link>
          <Link href="/view-attendance" className="w-full">
            <Button className="w-full" size="lg">
              View Attendance
            </Button>
          </Link>
          <Link href="/asbaaq" className="w-full">
            <Button className="w-full" size="lg">
              View Asbaaq List
            </Button>
          </Link>
          <Link href="/manage-students" className="w-full">
            <Button className="w-full" size="lg" variant="outline">
              Manage Students
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
