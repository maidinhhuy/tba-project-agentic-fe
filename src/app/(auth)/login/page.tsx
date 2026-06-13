import LoginForm from './_components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-teal-600">TBA</h1>
        <p className="text-center text-gray-500 mb-8">Sign in to your account</p>
        <LoginForm />
      </div>
    </div>
  )
}
