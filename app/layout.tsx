export const metadata = {
  title: 'Image Overlay API',
  description: 'Add text overlay to images',
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