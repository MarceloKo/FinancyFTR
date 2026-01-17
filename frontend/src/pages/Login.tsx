import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth'
import { LOGIN } from '@/lib/graphql/mutations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data: any) => {
      setAuth(data.login.user, data.login.token)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao fazer login')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    login({
      variables: {
        data: { email, password },
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1f6f43] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-2xl font-bold text-[#1f6f43]">FINANCY</span>
      </div>

      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#111827] mb-2">Fazer login</h1>
          <p className="text-sm text-[#6b7280]">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-[#111827] mb-2 block">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
              <Input
                id="email"
                type="email"
                placeholder="mail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-[#111827] mb-2 block">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-[#6b7280] cursor-pointer font-normal"
              >
                Lembrar-me
              </Label>
            </div>
            <Link to="/forgot-password" className="text-sm text-[#1f6f43] hover:underline">
              Recuperar senha
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1f6f43] hover:bg-[#1a5c37] text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e7eb]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#6b7280]">ou</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-[#6b7280] mb-4">Ainda não tem uma conta?</p>
            <Link to="/signup">
              <Button
                type="button"
                variant="outline"
                className="w-full border-[#e5e7eb] text-[#111827] hover:bg-[#f8f9fa]"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar conta
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
