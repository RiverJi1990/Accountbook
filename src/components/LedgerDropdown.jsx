import React from 'react'
import { Plus, Trash2, ChevronRight } from 'lucide-react'

export default function LedgerDropdown({ show, currentLedger, ledgers, currentLedgerId, onSelectLedger, onCreateLedger, onDeleteLedger }) {
  return (
    show && (
      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl z-20 overflow-hidden">
        <div className="p-3 border-b border-slate-100">
          <button
            onClick={onCreateLedger}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            新建账本
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {ledgers.map(ledger => (
            <LedgerItem
              key={ledger.id}
              ledger={ledger}
              isSelected={currentLedgerId === ledger.id}
              showDelete={ledgers.length > 1}
              onSelect={() => onSelectLedger(ledger.id)}
              onDelete={() => onDeleteLedger(ledger.id)}
            />
          ))}
        </div>
      </div>
    )
  )
}

function LedgerItem({ ledger, isSelected, showDelete, onSelect, onDelete }) {
  return (
    <div className="relative group pr-8">
      <button
        onClick={onSelect}
        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${
          isSelected ? 'bg-primary/5' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ledger.icon}</span>
          <div className="text-left">
            <div className={`font-medium ${isSelected ? 'text-primary' : 'text-slate-800'}`}>
              {ledger.name}
            </div>
            <div className="text-xs text-slate-400">
              {ledger.transactions.length} 条记录
            </div>
          </div>
        </div>
      </button>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500" />
        </button>
      )}
    </div>
  )
}
