export const metadata = {
  title: 'Ísland.is | Greiðslur',
  description: 'Greiðslulausn Ísland.is',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
