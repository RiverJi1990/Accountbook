import React from 'react'
import { History } from 'lucide-react'

export default function LogsPanel({ show, logs, loadingLogs, onClose, hideCloseButton = false }) {
  return (
    show && (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-slate-800">操作日志</h3>
          </div>
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
            >
              关闭
            </button>
          )}
        </div>

        {loadingLogs ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg shadow-slate-200/50">
            <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">暂无操作日志</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <LogItem key={index} log={log} />
            ))}
          </div>
        )}
      </div>
    )
  )
}

function LogItem({ log }) {
  const getActionLabel = (action) => {
    const labels = {
      add_transaction: '添加记录',
      delete_transaction: '删除记录',
      edit_transaction: '编辑记录',
      create_ledger: '创建账本',
      delete_ledger: '删除账本'
    }
    return labels[action] || action
  }

  const getActionStyle = (action) => {
    const styles = {
      add_transaction: 'bg-success/10 text-success',
      delete_transaction: 'bg-danger/10 text-danger',
      edit_transaction: 'bg-blue-100 text-blue-600',
      create_ledger: 'bg-purple-100 text-purple-600',
      delete_ledger: 'bg-orange-100 text-orange-600'
    }
    return styles[action] || 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionStyle(log.action)}`}>
              {getActionLabel(log.action)}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(log.timestamp).toLocaleString('zh-CN')}
            </span>
          </div>

          {log.userName && (
            <p className="text-sm text-slate-600 mb-2">
              操作人：{log.userName}
            </p>
          )}

          {log.ledgerName && (
            <p className="text-sm text-slate-600 mb-2">
              账本：{log.ledgerName}
            </p>
          )}

          <div className="text-sm text-slate-700 space-y-1">
            {log.action === 'add_transaction' && (
              <>
                <p>类型：{log.details.type === 'income' ? '收入' : '支出'}</p>
                <p>金额：¥{log.details.amount?.toLocaleString()}</p>
                <p>分类：{log.details.category}</p>
                <p>日期：{log.details.date}</p>
              </>
            )}
            {log.action === 'delete_transaction' && (
              <>
                <p>类型：{log.details.type === 'income' ? '收入' : '支出'}</p>
                <p>金额：¥{log.details.amount?.toLocaleString()}</p>
                <p>分类：{log.details.category}</p>
                <p>日期：{log.details.date}</p>
              </>
            )}
            {log.action === 'edit_transaction' && (
              <>
                <p>分类：{log.details.newData.category}</p>
                <p>金额：¥{log.details.newData.amount?.toLocaleString()}</p>
              </>
            )}
            {log.action === 'create_ledger' && (
              <>
                <p>账本名称：{log.details.ledgerName}</p>
                <p>图标：{log.details.ledgerIcon}</p>
              </>
            )}
            {log.action === 'delete_ledger' && (
              <>
                <p>账本名称：{log.details.ledgerName}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
