import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Periskope Chat</h1>
        <p className="text-lg text-gray-600">A multi-user, multi-number WhatsApp inbox and automation platform</p>
        <div className="flex justify-center space-x-4">
          <Button asChild size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/chats">Demo Chat</Link>
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Note: This is a demo application. To use with a real Supabase backend, add your Supabase credentials to the
          environment variables.
        </p>
      </div>
    </div>
  )
}
