import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      <div className='h-full lg:flex flex-col items-center justify-center px-4'>
        <div className='text-center space-y-4 pt-16'>
          <h1 className='font-bold text-3xl text-[#2E2A47]'>
            Bem vindo a HealthHub
          </h1>
          <p className=' text-base text-[#6B7280]'>
            Crie uma conta para acessar nossa plataforma
          </p>
          <div className='flex items-center justify-center mt-8'>
            <SignUp />
          </div>
        </div>
      </div>
      <div className='h-full bg-blue-200 hidden lg:flex items-center justify-center'>
        <Image src="/logo.svg" alt="Logo" width={100} height={100} />
        <span className='text-white font-bold text-2xl ml-4'>HealthHub</span>
      </div>
    </div>
  )

}