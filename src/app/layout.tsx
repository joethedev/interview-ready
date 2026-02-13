import "@/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{ theme: dark }}>
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
    </ClerkProvider>
  )
}


