import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import Form from "@/pages/Form";
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Form/>
    </>
  )
}
