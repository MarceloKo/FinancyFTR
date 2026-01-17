import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import { Wallet, ArrowUpCircle, ArrowDownCircle, Briefcase, Utensils, CarFront, ShoppingCart, PiggyBank, ChevronRight, Plus, Loader2, AlertCircle } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Card } from '@/components/ui/card'
import { TransactionModal } from '@/components/TransactionModal'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/transactions'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/categories'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

const iconMap: Record<string, any> = {
  'briefcase-business': Briefcase,
  'utensils': Utensils,
  'car-front': CarFront,
  'shopping-cart': ShoppingCart,
  'piggy-bank': PiggyBank,
}

export function Dashboard() {
  const [createOpen, setCreateOpen] = useState(false)

  const { data: transactionsData, loading: transactionsLoading, error: transactionsError, refetch } = useQuery(LIST_TRANSACTIONS)
  const { data: categoriesData } = useQuery(LIST_CATEGORIES)

  if (transactionsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1f6f43]" />
        </div>
      </Layout>
    )
  }

  if (transactionsError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Erro ao carregar dados</h2>
          <p className="text-sm text-muted-foreground mb-4">{transactionsError.message}</p>
        </div>
      </Layout>
    )
  }

  const transactions: Transaction[] = (transactionsData as any)?.listTransactions || []
  const categories: Category[] = (categoriesData as any)?.listCategories || []

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = monthIncome - monthExpense

  const recentTransactions = transactions.slice(0, 5)

  const categoryStats = categories.map((cat) => {
    const catTransactions = transactions.filter((t) => t.categoryId === cat.id)
    const total = catTransactions.reduce((sum, t) => sum + t.amount, 0)
    return {
      ...cat,
      count: catTransactions.length,
      total,
    }
  }).slice(0, 5)

  return (
    <Layout>
      <div>
        <div className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-[#9333ea]" />
                <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Saldo total</span>
              </div>
              <h2 className="text-[28px] font-bold text-[#111827]">{formatCurrency(balance)}</h2>
            </Card>

            <Card className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <ArrowUpCircle className="h-5 w-5 text-[#1f6f43]" />
                <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Receitas do mês</span>
              </div>
              <h2 className="text-[28px] font-bold text-[#111827]">{formatCurrency(monthIncome)}</h2>
            </Card>
          </div>

          <Card className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ArrowDownCircle className="h-5 w-5 text-[#dc2626]" />
              <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Despesas do mês</span>
            </div>
            <h2 className="text-[28px] font-bold text-[#111827]">{formatCurrency(monthExpense)}</h2>
          </Card>
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-6">
          <Card className="overflow-hidden">
            <div className="border-b border-[#e5e7eb] px-6 py-5 flex items-center justify-between">
              <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Transações recentes</span>
              <Link to="/transactions" className="flex items-center gap-1 text-sm font-medium text-[#1f6f43] hover:underline">
                Ver todas
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div>
              {recentTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ArrowUpCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhuma transação encontrada</p>
                  <p className="text-sm text-muted-foreground">
                    Comece adicionando sua primeira transação
                  </p>
                </div>
              ) : (
                <>
                  {recentTransactions.map((transaction) => {
                    const Icon = transaction.type === 'income' ? Briefcase : Utensils
                    const bgColor = transaction.type === 'income' ? 'bg-[#e0fae9]' : 'bg-[#dbeafe]'
                    const iconColor = transaction.type === 'income' ? 'text-[#16a34a]' : 'text-[#2563eb]'

                    return (
                      <div key={transaction.id} className="border-b border-[#e5e7eb] flex items-center">
                        <div className="flex-1 flex items-center gap-4 px-6 py-5">
                          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', bgColor)}>
                            <Icon className={cn('h-4 w-4', iconColor)} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-[#111827]">{transaction.title}</h3>
                            <p className="text-sm text-[#4b5563]">{formatDate(transaction.date)}</p>
                          </div>
                        </div>

                        <div className="w-40 px-6 py-5 flex justify-center">
                          {transaction.category && (
                            <span
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                backgroundColor: transaction.category.color + '20',
                                color: transaction.category.color,
                              }}
                            >
                              {transaction.type === 'income' ? 'Receita' : transaction.category.name}
                            </span>
                          )}
                          {!transaction.category && transaction.type === 'income' && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#e0fae9] text-[#15803d]">
                              Receita
                            </span>
                          )}
                        </div>

                        <div className="w-40 px-6 py-5 flex items-center justify-end gap-2">
                          <span className="font-semibold text-sm text-[#111827]">
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </span>
                          {transaction.type === 'income' ? (
                            <ArrowUpCircle className="h-4 w-4 text-[#1f6f43]" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-[#dc2626]" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>

            <div className="border-t border-[#e5e7eb] px-6 py-5 flex items-center justify-center">
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-[#1f6f43] hover:underline"
              >
                <Plus className="h-5 w-5" />
                Nova transação
              </button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-[#e5e7eb] px-6 py-5 flex items-center justify-between">
              <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Categorias</span>
              <Link to="/categories" className="flex items-center gap-1 text-sm font-medium text-[#1f6f43] hover:underline">
                Gerenciar
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="p-6 space-y-5">
              {categoryStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma categoria encontrada
                  </p>
                </div>
              ) : (
                categoryStats.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium shrink-0"
                      style={{
                        backgroundColor: cat.color + '20',
                        color: cat.color,
                      }}
                    >
                      {cat.name}
                    </span>
                    <span className="flex-1 text-sm text-[#4b5563] text-right">
                      {cat.count} {cat.count === 1 ? 'item' : 'itens'}
                    </span>
                    <span className="w-[88px] text-sm font-semibold text-[#111827] text-right">
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <TransactionModal open={createOpen} onOpenChange={setCreateOpen} onSuccess={refetch} />
    </Layout>
  )
}
