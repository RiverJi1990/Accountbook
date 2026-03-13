import React, { useState, useEffect } from 'react'
import { Plus, Wallet, ChevronRight, PieChart as PieChartIcon, Calendar, User, LogOut, X } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import cloudbase from '@cloudbase/js-sdk'

import LoginModal from './components/LoginModal'
import TransactionModal from './components/TransactionModal'
import LedgerModal from './components/LedgerModal'
import LogsPanel from './components/LogsPanel'
import Sidebar from './components/Sidebar'
import LedgerDropdown from './components/LedgerDropdown'
import StatsCards from './components/StatsCards'
import TransactionItem from './components/TransactionItem'

const app = cloudbase.init({
  env: import.meta.env.VITE_CLOUDBASE_ENV_ID || 'river-test-5g9ny38h5b552538'
})

const auth = app.auth()
const db = app.database()
const collection = db.collection('ledgers')

function App() {
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({
    phone: '',
    code: ''
  })
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verificationInfo, setVerificationInfo] = useState(null)

  const [ledgers, setLedgers] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentLedgerId, setCurrentLedgerId] = useState(() => {
    const saved = localStorage.getItem('currentLedgerId')
    return saved || null
  })

  const [showLedgerModal, setShowLedgerModal] = useState(false)
  const [ledgerFormData, setLedgerFormData] = useState({
    name: '',
    icon: '💰'
  })

  const [showLedgerDropdown, setShowLedgerDropdown] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  })

  const [filterType, setFilterType] = useState('all')

  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [logs, setLogs] = useState([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const logsCollection = db.collection('operation_logs')

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    checkLoginState()
  }, [])

  useEffect(() => {
    if (user && currentPage === 'logs') {
      fetchLogs()
    }
  }, [user, currentPage])

  const checkLoginState = async () => {
    try {
      const loginState = await auth.getLoginState()
      if (loginState) {
        setUser(loginState.user)
        fetchLedgers()
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      setLoading(false)
    }
  }

  const fetchLogs = async () => {
    if (!user) {
      console.warn('用户未登录,跳过获取日志')
      return
    }

    setLoadingLogs(true)
    try {
      console.log('开始获取日志...')
      const res = await logsCollection.orderBy('timestamp', 'desc').limit(50).get()
      console.log('获取日志成功, 完整响应:', res)
      console.log('获取日志成功, 数据:', res.data)
      console.log('获取日志成功, 数量:', res.data?.length || 0)
      setLogs(res.data || [])
    } catch (error) {
      console.error('获取日志失败:', error)
      console.error('错误详情:', {
        code: error.code,
        message: error.message,
        requestId: error.requestId
      })
      // 如果集合不存在,设置为空数组
      if (error.message && error.message.includes('not exist')) {
        console.log('集合不存在,设置为空数组')
        setLogs([])
      } else {
        setLogs([])
      }
    } finally {
      setLoadingLogs(false)
    }
  }

  const addLog = async (action, ledgerName, details) => {
    if (!user) {
      console.warn('用户未登录,跳过记录日志')
      return
    }

    try {
      console.log('开始添加日志:', { action, ledgerName, details })
      const res = await logsCollection.add({
        action,
        ledgerName,
        details,
        timestamp: new Date().toISOString(),
        userId: user?.uid || '',
        userName: user?.name || user?.phone || '未知用户'
      })
      console.log('日志添加成功, 响应:', res)
      console.log('日志添加成功, ID:', res.id || res._id || '未知')
      if (currentPage === 'logs') {
        fetchLogs()
      }
    } catch (error) {
      console.error('添加日志失败:', error)
      console.error('错误详情:', {
        code: error.code,
        message: error.message,
        requestId: error.requestId
      })
      alert('记录操作日志失败: ' + error.message)
    }
  }

  const fetchLedgers = async () => {
    try {
      // 获取所有账本（不按用户过滤）
      const res = await collection.get()

      // 为每个账本添加 id 字段（CloudBase 使用 _id）
      const ledgersWithId = res.data.map(ledger => ({
        ...ledger,
        id: ledger._id || ledger.id
      }))

      setLedgers(ledgersWithId)

      // 如果当前没有选中的账本，选择第一个
      if (!currentLedgerId && ledgersWithId.length > 0) {
        setCurrentLedgerId(ledgersWithId[0].id)
      }
    } catch (error) {
      console.error('获取账本失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendCode = async () => {
    if (countdown > 0) return

    setSendingCode(true)
    try {
      const res = await auth.getVerification({ phone_number: `+86 ${loginForm.phone}` })
      setVerificationInfo(res)
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error('发送验证码失败:', error)
      alert('发送验证码失败: ' + error.message)
    } finally {
      setSendingCode(false)
    }
  }

  const handleLogin = async () => {
    try {
      await auth.signInWithSms({
        verificationInfo,
        verificationCode: loginForm.code,
        phoneNum: `+86 ${loginForm.phone}`
      })
      const loginState = await auth.getLoginState()
      setUser(loginState.user)
      setShowLoginModal(false)
      fetchLedgers()
    } catch (error) {
      console.error('登录失败:', error)
      alert('登录失败: ' + error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setUser(null)
      setLedgers([])
      setCurrentLedgerId(null)
      setShowUserMenu(false)
      setShowLogoutConfirm(false)
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  const handleLogoutClick = () => {
    setShowUserMenu(false)
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    handleLogout()
  }

  const currentLedger = ledgers.find(l => l.id === currentLedgerId) || ledgers[0] || { id: '', name: '', icon: '💰', transactions: [] }
  const transactions = currentLedger?.transactions || []

  const filteredTransactions = transactions.filter(t => {
    const typeMatch = filterType === 'all' || t.type === filterType

    let dateMatch = true
    if (dateRange.startDate) {
      dateMatch = dateMatch && t.date >= dateRange.startDate
    }
    if (dateRange.endDate) {
      dateMatch = dateMatch && t.date <= dateRange.endDate
    }

    return typeMatch && dateMatch
  }).sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  const [showChart, setShowChart] = useState(true)

  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16']

  const handleCreateLedger = async (e) => {
    e.preventDefault()
    if (!ledgerFormData.name.trim()) {
      alert('请输入账本名称')
      return
    }

    try {
      const newLedger = {
        name: ledgerFormData.name.trim(),
        icon: ledgerFormData.icon,
        transactions: [],
        createdAt: new Date().toISOString()
      }

      const res = await collection.add(newLedger)
      const createdLedger = { ...newLedger, id: res.id }

      setLedgers([...ledgers, createdLedger])
      setCurrentLedgerId(createdLedger.id)
      setLedgerFormData({ name: '', icon: '💰' })
      setShowLedgerModal(false)
      setShowLedgerDropdown(false)

      await addLog('create_ledger', createdLedger.name, {
        ledgerName: createdLedger.name,
        ledgerIcon: createdLedger.icon
      })
    } catch (error) {
      console.error('创建账本失败:', error)
      alert('创建账本失败: ' + error.message)
    }
  }

  const handleDeleteLedger = async (ledgerId) => {
    if (ledgers.length === 1) {
      alert('至少需要保留一个账本')
      return
    }

    if (window.confirm('确定要删除这个账本吗？所有记录将被删除。')) {
      try {
        const ledgerToDelete = ledgers.find(l => l.id === ledgerId)

        if (ledgerToDelete) {
          const docId = ledgerToDelete._id || ledgerToDelete.id

          if (!docId) {
            throw new Error('账本ID不存在')
          }

          await collection.doc(docId).remove()

          await addLog('delete_ledger', ledgerToDelete.name, {
            ledgerName: ledgerToDelete.name
          })
        }

        const newLedgers = ledgers.filter(l => l.id !== ledgerId)
        setLedgers(newLedgers)

        if (currentLedgerId === ledgerId) {
          setCurrentLedgerId(newLedgers[0].id)
        }

        setShowLedgerDropdown(false)
      } catch (error) {
        console.error('删除账本失败:', error)
        alert('删除账本失败: ' + error.message)
      }
    }
  }

  const handleUpdateLedgerTransactions = async (newTransactions) => {
    try {
      const ledger = ledgers.find(l => l.id === currentLedgerId)

      if (!ledger) {
        throw new Error('找不到当前账本')
      }

      if (currentLedgerId) {
        // 使用数据库的原始 _id 字段来更新
        const docId = ledger._id || ledger.id

        if (!docId) {
          throw new Error('账本ID不存在')
        }

        const updateData = {
          transactions: newTransactions,
          updatedAt: new Date().toISOString()
        }

        const result = await collection.doc(docId).update(updateData)

        if (result.updated === 0) {
          throw new Error('更新失败：没有找到文档')
        }
      }

      // 更新本地状态
      setLedgers(ledgers.map(l =>
        l.id === currentLedgerId
          ? { ...l, transactions: newTransactions }
          : l
      ))
    } catch (error) {
      console.error('更新账本失败:', error)
      throw error
    }
  }

  const getChartData = () => {
    const filteredData = filteredTransactions

    const grouped = filteredData.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {})

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value
    }))
  }

  const getChartTitle = () => {
    if (filterType === 'all') return '📊 收支分布'
    if (filterType === 'income') return '📈 收入分布'
    return '📉 支出分布'
  }

  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction)
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        note: transaction.note
      })
    } else {
      setEditingTransaction(null)
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTransaction(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.amount || !formData.category) {
      return
    }

    if (!currentLedgerId) {
      return
    }

    const transactionData = {
      ...formData,
      amount: Number(formData.amount),
    }

    try {
      if (editingTransaction) {
        const newTransactions = transactions.map(t =>
          t.id === editingTransaction.id
            ? { ...transactionData, id: editingTransaction.id }
            : t
        )
        await handleUpdateLedgerTransactions(newTransactions)

        await addLog('edit_transaction', currentLedger.name, {
          oldData: editingTransaction,
          newData: transactionData
        })
      } else {
        const newTransactions = [
          {
            ...transactionData,
            id: Date.now(),
            createdAt: new Date().toISOString()
          },
          ...transactions
        ]
        await handleUpdateLedgerTransactions(newTransactions)

        await addLog('add_transaction', currentLedger.name, {
          type: transactionData.type,
          amount: transactionData.amount,
          category: transactionData.category,
          date: transactionData.date,
          note: transactionData.note
        })
      }
      handleCloseModal()
    } catch (error) {
      console.error('保存记录失败:', error)
    }
  }

  const handleDelete = async (id) => {
    const transactionToDelete = transactions.find(t => t.id === id)
    if (window.confirm('确定要删除这条记录吗？')) {
      await handleUpdateLedgerTransactions(transactions.filter(t => t.id !== id))

      if (transactionToDelete) {
        await addLog('delete_transaction', currentLedger.name, {
          type: transactionToDelete.type,
          amount: transactionToDelete.amount,
          category: transactionToDelete.category,
          date: transactionToDelete.date,
          note: transactionToDelete.note
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        loginForm={loginForm}
        onLoginFormChange={setLoginForm}
        sendingCode={sendingCode}
        countdown={countdown}
        onSendCode={sendCode}
        onLogin={handleLogin}
      />

      {/* Main Content */}
      {!user ? (
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">记账本</h1>
            <p className="text-slate-500 mb-8">记录每一笔收支,掌控你的财务</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all"
            >
              登录开始使用
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500">加载中...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content Area */}
          <div className="flex-1 bg-slate-50 relative">
            {/* User Info - Top Right Corner */}
            <div className="absolute top-6 right-6 z-40">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-xl shadow-lg shadow-slate-200/50 transition-all"
                >
                  <User className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">
                    {user?.name || user?.phone || '用户'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 min-w-[160px] overflow-hidden">
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium text-sm">退出登录</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {currentPage === 'dashboard' ? (
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                  <div className="relative">
                    <button
                      onClick={() => setShowLedgerDropdown(!showLedgerDropdown)}
                      className="w-full flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all"
                    >
                      <span className="text-3xl">{currentLedger.icon}</span>
                      <div className="text-left flex-1">
                        <h1 className="text-xl font-bold text-slate-800">{currentLedger.name}</h1>
                        <p className="text-sm text-slate-500">{currentLedger.transactions.length} 条记录</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showLedgerDropdown ? 'rotate-90' : ''}`} />
                    </button>

                    <LedgerDropdown
                      show={showLedgerDropdown}
                      currentLedger={currentLedger}
                      ledgers={ledgers}
                      currentLedgerId={currentLedgerId}
                      onSelectLedger={(id) => {
                        setCurrentLedgerId(id)
                        setShowLedgerDropdown(false)
                      }}
                      onCreateLedger={() => setShowLedgerModal(true)}
                      onDeleteLedger={handleDeleteLedger}
                    />
                  </div>

                  <div className="flex items-center gap-10">
                    <p className="text-slate-500 text-sm">轻松管理您的收支</p>
                  </div>
                </div>

                <StatsCards
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                  balance={balance}
                />

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex gap-2 flex-wrap">
                    {['all', 'income', 'expense'].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filterType === type
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {type === 'all' ? '全部' : type === 'income' ? '收入' : '支出'}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setShowChart(!showChart)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${showChart
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      <PieChartIcon className="w-5 h-5" />
                      {showChart ? '隐藏图表' : '显示图表'}
                    </button>

                    <button
                      onClick={() => handleOpenModal()}
                      className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                    >
                      <Plus className="w-5 h-5" />
                      添加记录
                    </button>
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-slate-800">时间筛选</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        开始日期
                      </label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        结束日期
                      </label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setDateRange({ startDate: '', endDate: '' })}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                    >
                      清除筛选
                    </button>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          const today = new Date().toISOString().split('T')[0]
                          setDateRange({ startDate: today, endDate: today })
                        }}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                      >
                        今天
                      </button>

                      <button
                        onClick={() => {
                          const today = new Date()
                          const yesterday = new Date(today)
                          yesterday.setDate(yesterday.getDate() - 1)
                          setDateRange({
                            startDate: yesterday.toISOString().split('T')[0],
                            endDate: today.toISOString().split('T')[0]
                          })
                        }}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                      >
                        最近2天
                      </button>

                      <button
                        onClick={() => {
                          const today = new Date()
                          const weekAgo = new Date(today)
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          setDateRange({
                            startDate: weekAgo.toISOString().split('T')[0],
                            endDate: today.toISOString().split('T')[0]
                          })
                        }}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                      >
                        最近7天
                      </button>

                      <button
                        onClick={() => {
                          const today = new Date()
                          const monthAgo = new Date(today)
                          monthAgo.setDate(monthAgo.getDate() - 30)
                          setDateRange({
                            startDate: monthAgo.toISOString().split('T')[0],
                            endDate: today.toISOString().split('T')[0]
                          })
                        }}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                      >
                        最近30天
                      </button>

                      <button
                        onClick={() => {
                          const today = new Date()
                          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                          setDateRange({
                            startDate: firstDayOfMonth.toISOString().split('T')[0],
                            endDate: today.toISOString().split('T')[0]
                          })
                        }}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
                      >
                        本月
                      </button>
                    </div>
                  </div>

                  {(dateRange.startDate || dateRange.endDate) && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600">
                        筛选范围：{dateRange.startDate || '开始'} 至 {dateRange.endDate || '结束'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Chart Section */}
                {showChart && getChartData().length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">{getChartTitle()}</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `¥${value.toLocaleString()}`}
                            contentStyle={{
                              backgroundColor: 'white',
                              borderRadius: '12px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              border: 'none',
                              padding: '12px'
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-slate-600">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {filteredTransactions.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                      <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">暂无记录</p>
                      <p className="text-slate-300 text-sm mt-2">点击"添加记录"开始记账</p>
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={() => handleOpenModal(transaction)}
                        onDelete={() => handleDelete(transaction.id)}
                      />
                    ))
                  )}
                </div>

                <div className="mt-6 text-center text-slate-400 text-sm">
                  共 {filteredTransactions.length} 条记录
                </div>
              </div>
            ) : (
              <div className="p-6">
                <LogsPanel
                  show={true}
                  logs={logs}
                  loadingLogs={loadingLogs}
                  onClose={() => { }}
                  hideCloseButton={true}
                />
              </div>
            )}

            <TransactionModal
              show={showModal}
              onClose={handleCloseModal}
              editingTransaction={editingTransaction}
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
            />

            <LedgerModal
              show={showLedgerModal}
              onClose={() => setShowLedgerModal(false)}
              ledgerFormData={ledgerFormData}
              onLedgerFormChange={setLedgerFormData}
              onSubmit={handleCreateLedger}
            />

            {/* Logout Confirm Modal */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">确认退出</h3>
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-600 mb-6">
                    确定要退出登录吗？退出后需要重新登录才能使用。
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
                    >
                      取消
                    </button>
                    <button
                      onClick={confirmLogout}
                      className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App
