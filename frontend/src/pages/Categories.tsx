import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, TagIcon, Utensils, Car, ShoppingCart, Briefcase, Gift, Home, Heart, Plane, Gamepad2, Film, Music, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/categories'
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '@/lib/graphql/mutations/categories'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

const ICONS = [
  { name: 'utensils', Icon: Utensils },
  { name: 'car', Icon: Car },
  { name: 'shopping-cart', Icon: ShoppingCart },
  { name: 'briefcase', Icon: Briefcase },
  { name: 'gift', Icon: Gift },
  { name: 'home', Icon: Home },
  { name: 'heart', Icon: Heart },
  { name: 'plane', Icon: Plane },
  { name: 'gamepad', Icon: Gamepad2 },
  { name: 'film', Icon: Film },
  { name: 'music', Icon: Music },
  { name: 'graduation-cap', Icon: GraduationCap },
]

const COLORS = [
  '#16a34a',
  '#2563eb',
  '#9333ea',
  '#ec4899',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
]

export function Categories() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#16a34a')
  const [iconName, setIconName] = useState('utensils')

  const { data, loading, error, refetch } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      toast.success('Categoria criada!')
      setCreateOpen(false)
      resetForm()
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      toast.success('Categoria atualizada!')
      setEditOpen(false)
      resetForm()
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success('Categoria excluída!')
      setDeleteOpen(false)
      setSelectedCategory(null)
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  const resetForm = () => {
    setName('')
    setDescription('')
    setColor('#16a34a')
    setIconName('utensils')
    setSelectedCategory(null)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast.error('Digite o nome da categoria')
      return
    }

    createCategory({
      variables: {
        data: { name, color },
      },
    })
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setName(category.name)
    setColor(category.color || '#16a34a')
    setEditOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !name) return

    updateCategory({
      variables: {
        id: selectedCategory.id,
        data: { name, color },
      },
    })
  }

  const handleDelete = () => {
    if (!selectedCategory) return
    deleteCategory({ variables: { id: selectedCategory.id } })
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1f6f43]" />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Erro ao carregar categorias</h2>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        </div>
      </Layout>
    )
  }

  const categories: Category[] = data?.listCategories || []

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">Categorias</h1>
            <p className="text-[#4b5563]">Organize suas transações por categorias</p>
          </div>

          <Button onClick={() => { resetForm(); setCreateOpen(true) }} className="bg-[#1f6f43] hover:bg-[#1a5c37]">
            <Plus className="h-4 w-4 mr-2" />
            Nova categoria
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center">
                <TagIcon className="h-6 w-6 text-[#6b7280]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#111827]">{categories.length}</h2>
                <p className="text-xs text-[#6b7280] uppercase tracking-wider">Total de categorias</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-[#9333ea]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#111827]">27</h2>
                <p className="text-xs text-[#6b7280] uppercase tracking-wider">Total de transações</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center">
                <Utensils className="h-6 w-6 text-[#2563eb]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">Alimentação</h2>
                <p className="text-xs text-[#6b7280] uppercase tracking-wider">Categoria mais utilizada</p>
              </div>
            </div>
          </Card>
        </div>

        {categories.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <TagIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhuma categoria encontrada</p>
              <p className="text-sm text-muted-foreground mb-4">
                Comece criando sua primeira categoria
              </p>
              <Button onClick={() => setCreateOpen(true)} className="bg-[#1f6f43] hover:bg-[#1a5c37]">
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = ICONS[0].Icon
              return (
                <Card key={category.id} className="p-6 relative">
                  <div className="absolute top-4 right-4 flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => { setSelectedCategory(category); setDeleteOpen(true) }}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-col items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center')} style={{ backgroundColor: category.color + '20' }}>
                      <IconComponent className="h-6 w-6" style={{ color: category.color }} />
                    </div>

                    <div className="w-full">
                      <h3 className="font-medium text-[#111827] mb-1">{category.name}</h3>
                      <p className="text-sm text-[#4b5563] mb-3">Restaurantes, delivery e refeições</p>

                      <div className="flex items-center justify-between">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: category.color + '20',
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                        <span className="text-sm text-[#4b5563]">12 itens</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
            <p className="text-sm text-[#6b7280]">Organize suas transações com categorias</p>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="name">Título</Label>
              <Input
                id="name"
                placeholder="Ex. Alimentação"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Descrição da categoria"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-[#6b7280] mt-1">Opcional</p>
            </div>

            <div>
              <Label className="mb-2 block">Ícone</Label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    className={cn(
                      'h-12 rounded-lg border-2 flex items-center justify-center transition-all hover:bg-gray-50',
                      iconName === name ? 'border-[#1f6f43] bg-[#e0fae9]' : 'border-[#e5e7eb]'
                    )}
                    onClick={() => setIconName(name)}
                  >
                    <Icon className="h-5 w-5 text-[#6b7280]" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Cor</Label>
              <div className="flex gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      'flex-1 h-10 rounded-lg flex items-center justify-center p-1 transition-all',
                      color === c ? 'border border-[#1F6F43] bg-[#F8F9FA]' : 'border border-transparent'
                    )}
                    onClick={() => setColor(c)}
                  >
                    <div className="w-full h-full rounded" style={{ backgroundColor: c }} />
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={creating} className="w-full bg-[#1f6f43] hover:bg-[#1a5c37]">
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>
            <p className="text-sm text-[#6b7280]">Atualize os dados da categoria</p>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Título</Label>
              <Input
                id="edit-name"
                placeholder="Ex. Alimentação"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                placeholder="Descrição da categoria"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block">Ícone</Label>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    className={cn(
                      'h-12 rounded-lg border-2 flex items-center justify-center transition-all hover:bg-gray-50',
                      iconName === name ? 'border-[#1f6f43] bg-[#e0fae9]' : 'border-[#e5e7eb]'
                    )}
                    onClick={() => setIconName(name)}
                  >
                    <Icon className="h-5 w-5 text-[#6b7280]" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Cor</Label>
              <div className="flex gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      'flex-1 h-10 rounded-lg flex items-center justify-center p-1 transition-all',
                      color === c ? 'border border-[#1F6F43] bg-[#F8F9FA]' : 'border border-transparent'
                    )}
                    onClick={() => setColor(c)}
                  >
                    <div className="w-full h-full rounded" style={{ backgroundColor: c }} />
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={updating} className="w-full bg-[#1f6f43] hover:bg-[#1a5c37]">
                {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Categoria</DialogTitle>
            <p className="text-sm text-[#6b7280]">
              Tem certeza que deseja excluir "{selectedCategory?.name}"?
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
