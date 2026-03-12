import React from 'react'
import { X } from 'lucide-react'

export default function LoginModal({ show, onClose, loginForm, onLoginFormChange, sendingCode, countdown, onSendCode, onLogin }) {
  return (
    show && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">手机号登录</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">手机号</label>
              <input
                type="tel"
                value={loginForm.phone}
                onChange={(e) => onLoginFormChange({ ...loginForm, phone: e.target.value })}
                placeholder="13800138000"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">验证码</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={loginForm.code}
                  onChange={(e) => onLoginFormChange({ ...loginForm, code: e.target.value })}
                  placeholder="请输入验证码"
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
                <button
                  onClick={onSendCode}
                  disabled={sendingCode || countdown > 0}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
                >
                  {countdown > 0 ? `${countdown}s` : sendingCode ? '发送中...' : '获取验证码'}
                </button>
              </div>
            </div>

            <button
              onClick={onLogin}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all"
            >
              登录
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-slate-500 hover:text-slate-700"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    )
  )
}
