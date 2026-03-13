import React, { useState } from 'react'
import { LayoutDashboard, History, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse }) {
  const [showTooltip, setShowTooltip] = useState(null)

  const menuItems = [
    {
      id: 'dashboard',
      label: '账本管理',
      icon: LayoutDashboard
    },
    {
      id: 'logs',
      label: '操作日志',
      icon: History
    }
  ]

  return (
    <>
      <div
        className={`bg-white border-r border-slate-200 min-h-screen flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💰</span>
            {!collapsed && (
              <h1 className="text-2xl font-bold text-slate-800">
                记账本
              </h1>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    onMouseEnter={() => collapsed && setShowTooltip(item.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                    {!collapsed && <span className="font-medium">{item.label}</span>}

                    {/* Tooltip for collapsed state */}
                    {collapsed && showTooltip === item.id && (
                      <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
