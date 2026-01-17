import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Search, CircleX, CircleCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Layout } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TransactionModal } from '@/components/TransactionModal'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/transactions'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/categories'
import { DELETE_TRANSACTION } from '@/lib/graphql/mutations/transactions'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

export function Transactions() {
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const { data: transactionsData, loading, error, refetch } = useQuery(LIST_TRANSACTIONS)
  const { data: categoriesData } = useQuery(LIST_CATEGORIES)

  const [deleteTransaction, { loading: deleting }] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => {
      toast.success('Transação excluída!')
      setDeleteOpen(false)
      setSelectedTransaction(null)
      refetch()
    },
    onError: (error) => toast.error(error.message),
  })

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setTransactionModalOpen(true)
  }

  const handleDelete = () => {
    if (!selectedTransaction) return
    deleteTransaction({ variables: { id: selectedTransaction.id } })
  }

  const handleModalClose = () => {
    setTransactionModalOpen(false)
    setSelectedTransaction(null)
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
          <h2 className="text-lg font-semibold mb-2">Erro ao carregar transações</h2>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        </div>
      </Layout>
    )
  }

  const transactions: Transaction[] = (transactionsData as any)?.listTransactions || []
  const categories: Category[] = (categoriesData as any)?.listCategories || []

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">Transações</h1>
            <p className="text-[#4b5563]">Gerencie todas as suas transações financeiras</p>
          </div>

          <Button onClick={() => setTransactionModalOpen(true)} className="bg-[#1f6f43] hover:bg-[#1a5c37]">
            <Plus className="h-4 w-4 mr-2" />
            Nova transação
          </Button>
        </div>

        <Card className="mb-6 p-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#4b5563] mb-2 block">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
                <Input
                  placeholder="Buscar por descrição"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#4b5563] mb-2 block">Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#4b5563] mb-2 block">Categoria</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#4b5563] mb-2 block">Período</Label>
              <Select defaultValue="november-2025">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="november-2025">Novembro / 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f8f9fa]">
              <tr className="border-b border-[#e5e7eb]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6b7280] uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6b7280] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#e5e7eb]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-[#6b7280]">Nenhuma transação encontrada</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-[#f8f9fa]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">
                      {transaction.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4b5563]">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.category ? (
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: transaction.category.color + '20',
                            color: transaction.category.color,
                          }}
                        >
                          {transaction.category.name}
                        </span>
                      ) : (
                        <span className="text-[#6b7280]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.type === 'income' ? (
                        <span className="flex items-center gap-1 text-[#16a34a]">
                          <CircleCheck className="h-4 w-4" />
                          Entrada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#dc2626]">
                          <CircleX className="h-4 w-4" />
                          Saída
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right text-[#111827]">
                      {transaction.type === 'income' ? '+ ' : '- '}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transaction)}
                        className="text-[#6b7280] hover:text-[#1f6f43]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSelectedTransaction(transaction); setDeleteOpen(true) }}
                        className="text-[#6b7280] hover:text-[#dc2626]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {filteredTransactions.length > 0 && (
            <div className="border-t border-[#e5e7eb] px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-[#4b5563]">
                1 a {Math.min(10, filteredTransactions.length)} | {filteredTransactions.length} resultados
              </span>
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="bg-[#1f6f43] hover:bg-[#1a5c37]">1</Button>
                <Button variant="ghost" size="sm">2</Button>
                <Button variant="ghost" size="sm">3</Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <TransactionModal
        open={transactionModalOpen}
        onOpenChange={handleModalClose}
        transaction={selectedTransaction}
        onSuccess={refetch}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Transação</DialogTitle>
            <p className="text-sm text-[#6b7280]">
              Tem certeza que deseja excluir "{selectedTransaction?.title}"?
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
