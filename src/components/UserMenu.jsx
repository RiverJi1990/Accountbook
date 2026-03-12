import React from 'react'
import { User, LogOut, History } from 'lucide-react'

export default function UserMenu({ show, user, onLogout, onShowLogs }) {
  return (
    show && (
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-30">
        <div className="px-4 py-2 border-b border-slate-100">
          <p className="text-xs text-slate-500">当前账号</p>
          <p className="text-sm font-medium text-slate-800">{user?.name || '用户'}</p>
        </div>
        <button
          onClick={onShowLogs}
          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <History className="w-4 h-4" />
          修改日志
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          退出登录
        </button>
      </div>
    )
  )
}
