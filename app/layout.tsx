import "./globals.css"
import "../public/css/styles.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ALCAS DIGITAL MARKETING AGENCY | Nothing to Something",
  description: "Complete Digital Transformation. Website Development, CRM, Social Media & Digital Marketing Services.",
  icons: {
    icon: "/images/alcas.jpg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
