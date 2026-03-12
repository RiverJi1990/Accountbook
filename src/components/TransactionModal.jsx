import React from 'react'
import { X } from 'lucide-react'

const categories = {
  income: ['工资', '投资', '兼职', '奖金', '其他'],
  expense: ['餐饮', '购物', '交通', '娱乐', '医疗', '教育', '住房', '其他']
}

export default function TransactionModal({ show, onClose, editingTransaction, formData, onFormDataChange, onSubmit }) {
  return (
    show && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {editingTransaction ? '编辑记录' : '添加记录'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Type Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onFormDataChange({ ...formData, type: 'expense' })}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'expense'
                    ? 'bg-danger text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                支出
              </button>
              <button
                type="button"
                onClick={() => onFormDataChange({ ...formData, type: 'income' })}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'income'
                    ? 'bg-success text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                收入
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                金额
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => onFormDataChange({ ...formData, amount: e.target.value })}
                placeholder="请输入金额"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                分类
              </label>
              <select
                value={formData.category}
                onChange={(e) => onFormDataChange({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">请选择分类</option>
                {categories[formData.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                日期
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => onFormDataChange({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                备注（可选）
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => onFormDataChange({ ...formData, note: e.target.value })}
                placeholder="添加备注..."
                rows={2}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
              {editingTransaction ? '保存修改' : '添加记录'}
            </button>
          </form>
        </div>
      </div>
    )
  )
}
