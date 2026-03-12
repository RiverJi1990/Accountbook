import React from 'react'
import { X } from 'lucide-react'

const availableIcons = ['💰', '🏠', '🎯', '💼', '📈', '🎨', '🎮', '📚', '🌟', '🎁', '🔔', '💡', '🎪', '🚀', '🌈']

export default function LedgerModal({ show, onClose, ledgerFormData, onLedgerFormChange, onSubmit }) {
  return (
    show && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">新建账本</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                账本名称
              </label>
              <input
                type="text"
                value={ledgerFormData.name}
                onChange={(e) => onLedgerFormChange({ ...ledgerFormData, name: e.target.value })}
                placeholder="例如：日常开销"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                选择图标
              </label>
              <div className="grid grid-cols-8 gap-2">
                {availableIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => onLedgerFormChange({ ...ledgerFormData, icon })}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      ledgerFormData.icon === icon
                        ? 'bg-primary text-white scale-110'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
              创建账本
            </button>
          </form>
        </div>
      </div>
    )
  )
}
