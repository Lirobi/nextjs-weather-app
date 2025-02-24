import React from 'react'
import { Inter } from 'next/font/google'
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="fr" className={`${inter.className} h-full`}>
      <head>
        <link rel="icon" href="./logo.svg" type="image/svg+xml" />
        <title>
          Lilian Bischung's Weather
        </title>
      </head>
      <body className='cursor-default bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600 h-full w-full  '>
        {children}
      </body>
    </html>
  )
}

export default RootLayout