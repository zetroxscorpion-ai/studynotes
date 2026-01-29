import './globals.css'

export const metadata = {
  title: 'StudyNotes',
  description: 'A simple note-taking app for students',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}