import React, { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2, Edit2, X, PieChart as PieChartIcon, Calendar, ChevronLeft, ChevronRight, BookOpen, MoreVertical, LogOut, User } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: 'river-test-5g9ny38h5b552538'
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
  const [showUserMenu, setShowUserMenu] = useState(false)

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

  const [showLedgerMenu, setShowLedgerMenu] = useState(null)
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

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    checkLoginState()
  }, [])

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
      alert('验证码已发送到手机')
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
    } catch (error) {
      console.error('退出登录失败:', error)
    }
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

  const categories = {
    income: ['工资', '投资', '兼职', '奖金', '其他'],
    expense: ['餐饮', '购物', '交通', '娱乐', '医疗', '教育', '住房', '其他']
  }

  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16']

  const availableIcons = ['💰', '🏠', '🎯', '💼', '📈', '🎨', '🎮', '📚', '🌟', '🎁', '🔔', '💡', '🎪', '🚀', '🌈']

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
      alert('账本创建成功')
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
          // 使用数据库的原始 _id 字段来删除
          const docId = ledgerToDelete._id || ledgerToDelete.id

          if (!docId) {
            throw new Error('账本ID不存在')
          }

          await collection.doc(docId).remove()
        }

        const newLedgers = ledgers.filter(l => l.id !== ledgerId)
        setLedgers(newLedgers)

        if (currentLedgerId === ledgerId) {
          setCurrentLedgerId(newLedgers[0].id)
        }

        setShowLedgerMenu(null)
        alert('账本删除成功')
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
        await handleUpdateLedgerTransactions(transactions.map(t =>
          t.id === editingTransaction.id
            ? { ...transactionData, id: editingTransaction.id }
            : t
        ))
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
      }
      handleCloseModal()
    } catch (error) {
      console.error('保存记录失败:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      await handleUpdateLedgerTransactions(transactions.filter(t => t.id !== id))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">手机号登录</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">手机号</label>
                <input
                  type="tel"
                  value={loginForm.phone}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, phone: e.target.value }))}
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
                    onChange={(e) => setLoginForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="请输入验证码"
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                  <button
                    onClick={sendCode}
                    disabled={sendingCode || countdown > 0}
                    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
                  >
                    {countdown > 0 ? `${countdown}s` : sendingCode ? '发送中...' : '获取验证码'}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all"
              >
                登录
              </button>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 text-slate-500 hover:text-slate-700"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b border-slate-200 px-4 py-3">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">记账本</h1>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">
                  {user?.name || '用户'}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-30">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">当前账号</p>
                    <p className="text-sm font-medium text-slate-800">{user?.name || '用户'}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-slate-50 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 font-medium transition-all text-sm"
            >
              登录
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {!user ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
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
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500">加载中...</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header with Ledger Dropdown */}
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

              {/* Dropdown Menu */}
              {showLedgerDropdown && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl z-20 overflow-hidden">
                  <div className="p-3 border-b border-slate-100">
                    <button
                      onClick={() => setShowLedgerModal(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      新建账本
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {ledgers.map(ledger => (
                    <div key={ledger.id} className="relative group pr-8">
                      <button
                        onClick={() => {
                          setCurrentLedgerId(ledger.id)
                          setShowLedgerDropdown(false)
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${
                          currentLedgerId === ledger.id ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{ledger.icon}</span>
                          <div className="text-left">
                            <div className={`font-medium ${currentLedgerId === ledger.id ? 'text-primary' : 'text-slate-800'}`}>
                              {ledger.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {ledger.transactions.length} 条记录
                            </div>
                          </div>
                        </div>

                        <div className="relative w-8 h-8 flex items-center justify-center">
                          {currentLedgerId === ledger.id && (
                            <div className={`absolute w-2 h-2 rounded-full bg-primary transition-opacity duration-200 ${
                              ledgers.length > 1 ? 'group-hover:opacity-0' : ''
                            }`}></div>
                          )}
                        </div>
                      </button>

                      {ledgers.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteLedger(ledger.id)
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="text-slate-500 text-sm">轻松管理您的收支</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">总收入</span>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-success">
              ¥{totalIncome.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">总支出</span>
              <TrendingDown className="w-5 h-5 text-danger" />
            </div>
            <div className="text-3xl font-bold text-danger">
              ¥{totalExpense.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">余额</span>
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className={`text-3xl font-bold ${balance >= 0 ? 'text-primary' : 'text-danger'}`}>
              ¥{balance.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'income', 'expense'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterType === type
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showChart
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

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">暂无记录</p>
              <p className="text-slate-300 text-sm mt-2">点击"添加记录"开始记账</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all"
              >
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
                        onClick={() => handleOpenModal(transaction)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-danger" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Transaction Count */}
        <div className="mt-6 text-center text-slate-400 text-sm">
          共 {filteredTransactions.length} 条记录
        </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingTransaction ? '编辑记录' : '添加记录'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
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
                  onClick={() => setFormData({ ...formData, type: 'income' })}
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
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
      )}

      {/* Create Ledger Modal */}
      {showLedgerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">新建账本</h2>
              <button
                onClick={() => setShowLedgerModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateLedger} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  账本名称
                </label>
                <input
                  type="text"
                  value={ledgerFormData.name}
                  onChange={(e) => setLedgerFormData({ ...ledgerFormData, name: e.target.value })}
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
                      onClick={() => setLedgerFormData({ ...ledgerFormData, icon })}
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
      )}
        </div>
      )}
    </div>
  )
}

export default App
