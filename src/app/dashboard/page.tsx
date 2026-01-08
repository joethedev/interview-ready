import { Navbar } from '@/components/navbar';
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  const user = await currentUser()

  return (
      <>
        <Navbar isAuthenticated={isAuthenticated} />
  
        <main className="mx-auto max-w-5xl px-6 pt-24 text-center">
          hello {user?.firstName} !
        </main>
      </>
    );
}
