import React from 'react'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export default function StatsCards({ totalIncome, totalExpense, balance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="总收入"
        value={`¥${totalIncome.toLocaleString()}`}
        icon={<TrendingUp className="w-5 h-5 text-success" />}
        valueClass="text-success"
      />
      <StatCard
        title="总支出"
        value={`¥${totalExpense.toLocaleString()}`}
        icon={<TrendingDown className="w-5 h-5 text-danger" />}
        valueClass="text-danger"
      />
      <StatCard
        title="余额"
        value={`¥${balance.toLocaleString()}`}
        icon={<Wallet className="w-5 h-5 text-primary" />}
        valueClass={balance >= 0 ? 'text-primary' : 'text-danger'}
      />
    </div>
  )
}

function StatCard({ title, value, icon, valueClass }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-sm">{title}</span>
        {icon}
      </div>
      <div className={`text-3xl font-bold ${valueClass}`}>
        {value}
      </div>
    </div>
  )
}
