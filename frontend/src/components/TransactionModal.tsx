import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Loader2, CircleX, CircleCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/categories'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/lib/graphql/mutations/transactions'
import { cn } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

interface TransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  onSuccess?: () => void
}

export function TransactionModal({ open, onOpenChange, transaction, onSuccess }: TransactionModalProps) {
  const isEditing = !!transaction

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [categoryId, setCategoryId] = useState('')

  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
  const categories: Category[] = categoriesData?.listCategories || []

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      toast.success('Transação criada!')
      onOpenChange(false)
      resetForm()
      onSuccess?.()
    },
    onError: (error) => toast.error(error.message),
  })

  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    onCompleted: () => {
      toast.success('Transação atualizada!')
      onOpenChange(false)
      resetForm()
      onSuccess?.()
    },
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title)
      setAmount(transaction.amount.toString())
      setType(transaction.type)
      setDate(new Date(transaction.date).toISOString().split('T')[0])
      setCategoryId(transaction.categoryId || '')
    }
  }, [transaction])

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setType('expense')
    setDate(new Date().toISOString().split('T')[0])
    setCategoryId('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) {
      toast.error('Preencha todos os campos')
      return
    }

    const data = {
      title,
      amount: parseFloat(amount),
      type,
      date: new Date(date).toISOString(),
      categoryId: categoryId || undefined,
    }

    if (isEditing && transaction) {
      updateTransaction({
        variables: {
          id: transaction.id,
          data,
        },
      })
    } else {
      createTransaction({
        variables: { data },
      })
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    if (!isEditing) {
      resetForm()
    }
  }

  const loading = creating || updating

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#111827]">
            {isEditing ? 'Editar transação' : 'Nova transação'}
          </DialogTitle>
          <p className="text-sm text-[#6b7280]">
            {isEditing ? 'Atualize os dados da transação' : 'Registre sua despesa ou receita'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="flex gap-3 border-2 rounded-xl p-2">
            <button
              type="button"
              className={cn(
                'flex-1 h-12 rounded-xl  flex items-center justify-center gap-2 text-sm font-medium transition-all border-2 border-transparent',
                type === 'expense'
                  ? ' border-[#dc2626] text-[#dc2626] bg-white'
                  : 'text-[#6b7280] hover:border-[#dc2626] hover:text-[#dc2626] hover:border-2'
              )}
              onClick={() => setType('expense')}
            >
              <CircleX className="h-4 w-4" />
              Despesa
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium  border-2 border-transparent ',
                type === 'income'
                  ? 'border-[#16a34a] text-[#16a34a] bg-white'
                  : ' text-[#6b7280] hover:border-[#16a34a] hover:text-[#16a34a] '
              )}
              onClick={() => setType('income')}
            >
              <CircleCheck className="h-4 w-4" />
              Receita
            </button>
          </div>

          <div>
            <Label htmlFor="title" className="text-sm font-medium text-[#111827] mb-2 block">
              Descrição
            </Label>
            <Input
              id="title"
              placeholder="Ex. Almoço no restaurante"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-[#111827] mb-2 block">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-[#111827] mb-2 block">
                Valor
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] text-sm">
                  R$
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-[#111827] mb-2 block">
              Categoria
            </Label>
            <Select value={categoryId || 'none'} onValueChange={(v) => setCategoryId(v === 'none' ? '' : v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Selecione</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1f6f43] hover:bg-[#1a5c37] text-white rounded-xl font-medium mt-6"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
