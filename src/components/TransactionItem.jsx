import React from 'react'
import { TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react'

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              transaction.type === 'income'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
            }`}>
              {transaction.type === 'income' ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{transaction.category}</h3>
              <p className="text-sm text-slate-400">{transaction.date}</p>
            </div>
          </div>
          {transaction.note && (
            <p className="text-slate-500 text-sm ml-13">{transaction.note}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className={`text-2xl font-bold ${
            transaction.type === 'income' ? 'text-success' : 'text-danger'
          }`}>
            {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toLocaleString()}
          </div>

          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="编辑"
            >
              <Edit2 className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 className="w-4 h-4 text-slate-400 hover:text-danger" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
