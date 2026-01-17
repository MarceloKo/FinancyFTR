import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { User, Mail, LogOut, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Layout } from '@/components/Layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import { UPDATE_PROFILE } from '@/lib/graphql/mutations/user'

export function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const setUser = useAuthStore((state) => state.setUser)

  const [name, setName] = useState(user?.name || '')

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data) => {
      setUser(data.updateProfile)
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
  }, [user?.name])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast.error('O nome não pode ficar vazio')
      return
    }
    updateProfile({
      variables: {
        data: { name },
      },
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Você saiu da sua conta')
  }

  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <Layout>
      <div className="flex items-center justify-center ">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#e5e7eb] flex items-center justify-center mb-3">
              <span className="text-xl font-semibold text-[#6b7280]">{initials}</span>
            </div>
            <h1 className="text-lg font-semibold text-[#111827] mb-1">{user?.name}</h1>
            <p className="text-sm text-[#6b7280]">{user?.email}</p>
          </div>
          <div className="border-t border-[#e5e7eb] my-6"></div>


          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm text-[#111827] mb-2 block">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm text-[#111827] mb-2 block">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-[#f8f9fa] cursor-not-allowed text-[#6b7280]"
                />
              </div>
              <p className="text-xs text-[#6b7280] mt-1">O e-mail não pode ser alterado</p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1f6f43] hover:bg-[#1a5c37] text-white"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar alterações
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full text-[#dc2626] border-transparent hover:bg-[#fef2f2]"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair da conta
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </Layout>
  )
}
