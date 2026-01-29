import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Search, CircleX, CircleCheck, ChevronLeft, ChevronRight } from 'lucide-react'
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
import type { Transaction, Category, PaginatedTransactions, TransactionFilterInput } from '@/types'

const ITEMS_PER_PAGE = 10

const MONTHS = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

export function Transactions() {
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const buildFilters = useCallback((): TransactionFilterInput => {
    const filters: TransactionFilterInput = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }

    if (debouncedSearch) {
      filters.search = debouncedSearch
    }

    if (filterType !== 'all') {
      filters.type = filterType as 'income' | 'expense'
    }

    if (filterCategory !== 'all') {
      filters.categoryId = filterCategory
    }

    if (filterMonth !== 'all') {
      filters.month = parseInt(filterMonth)
    }

    if (filterYear !== 'all') {
      filters.year = parseInt(filterYear)
    }

    return filters
  }, [currentPage, debouncedSearch, filterType, filterCategory, filterMonth, filterYear])

  const { data: transactionsData, loading, error, refetch } = useQuery<{ listTransactions: PaginatedTransactions }>(LIST_TRANSACTIONS, {
    variables: { filters: buildFilters() },
    fetchPolicy: 'cache-and-network',
  })

  const { data: categoriesData } = useQuery(LIST_CATEGORIES)

  const [deleteTransaction, { loading: deleting }] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => {
      toast.success('Transação excluída!')
      setDeleteOpen(false)
      setSelectedTransaction(null)
      refetch()
    },
    onError: (err) => toast.error(err.message),
  })

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value)
    setCurrentPage(1)
  }

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

  if (loading && !transactionsData) {
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

  const paginatedData = transactionsData?.listTransactions
  const transactions: Transaction[] = paginatedData?.transactions || []
  const totalPages = paginatedData?.totalPages || 1
  const total = paginatedData?.total || 0
  const categories: Category[] = (categoriesData as { listCategories: Category[] } | undefined)?.listCategories || []

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }))

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, total)

  const renderPaginationButtons = () => {
    const buttons: React.ReactNode[] = []
    const maxButtons = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxButtons - 1)

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? 'bg-[#1f6f43] hover:bg-[#1a5c37]' : ''}
        >
          {i}
        </Button>
      )
    }

    return buttons
  }

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
          <div className="grid grid-cols-5 gap-4">
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
              <Select value={filterType} onValueChange={handleFilterChange(setFilterType)}>
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
              <Select value={filterCategory} onValueChange={handleFilterChange(setFilterCategory)}>
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
              <Label className="text-sm font-medium text-[#4b5563] mb-2 block">Mês</Label>
              <Select value={filterMonth} onValueChange={handleFilterChange(setFilterMonth)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#4b5563] mb-2 block">Ano</Label>
              <Select value={filterYear} onValueChange={handleFilterChange(setFilterYear)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                  ))}
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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-[#6b7280]">Nenhuma transação encontrada</p>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
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

          {total > 0 && (
            <div className="border-t border-[#e5e7eb] px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-[#4b5563]">
                {startItem} a {endItem} | {total} resultados
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {renderPaginationButtons()}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
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
