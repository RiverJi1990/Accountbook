# 💰 记账本 - Expense Tracker

一个简洁美观的个人记账本 Web 应用，帮助您轻松管理日常收支。

## ✨ 功能特点

- 📊 **收支统计** - 实时查看总收入、总支出和余额
- ➕ **添加记录** - 快速添加收入或支出记录
- ✏️ **编辑删除** - 灵活管理所有记账记录
- 🔍 **分类筛选** - 按收入/支出类型筛选记录
- 📅 **日期筛选** - 支持自定义日期范围和快捷日期筛选
- 📈 **图表展示** - 饼图直观展示收支分布
- 👤 **用户认证** - 手机号登录，数据云端同步
- 📚 **多账本支持** - 支持创建多个账本，独立管理
- 📜 **操作日志** - 记录所有账本变更操作
- 💾 **云端存储** - 数据保存在腾讯云 CloudBase，安全可靠
- 📱 **响应式设计** - 完美适配手机、平板和电脑
- 🎨 **现代UI** - 采用 Tailwind CSS 设计，美观大方

## 🛠️ 技术栈

- React 18
- Vite
- Tailwind CSS
- Lucide React (图标)
- 腾讯云 CloudBase (云开发)
- Recharts (图表)

## 🌐 在线访问

**部署地址**: https://river-test-5g9ny38h5b552538-1410448083.tcloudbaseapp.com/

直接在浏览器中访问上述地址即可使用记账本！

## 📦 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 预览生产构建：
```bash
npm run preview
```

## 🚀 部署到云端

项目已部署到腾讯云 CloudBase 静态网站托管。

### 快速部署步骤：

1. **构建项目**：
```bash
npm run build
```

2. **上传到 CloudBase**：
```bash
cloudbase hosting deploy dist -e river-test-5g9ny38h5b552538
```

详细部署指南请参考 [DEPLOY.md](./DEPLOY.md)

## 📝 使用说明

1. **登录**：使用手机号登录，获取验证码完成认证
2. **切换账本**：点击顶部账本名称，切换或创建新账本
3. **查看统计**：页面顶部显示总收入、总支出和余额
4. **添加记录**：点击"添加记录"按钮，填写金额、分类、日期和备注
5. **筛选记录**：使用"全部"、"收入"、"支出"按钮筛选
6. **日期筛选**：自定义日期范围或使用快捷筛选（今天、最近7天、本月等）
7. **图表展示**：点击"显示图表"查看收支分布饼图
8. **编辑记录**：点击记录右侧的编辑图标进行修改
9. **删除记录**：点击记录右侧的删除图标移除记录
10. **查看日志**：点击用户菜单中的"修改日志"查看操作历史

## 🛡️ 应用稳定性

### 错误处理
- **Error Boundary**: 应用已集成 React Error Boundary，当组件抛出未处理的错误时，会显示友好的错误页面
- **优雅降级**: 用户可以通过"刷新页面重试"按钮恢复应用
- **错误日志**: 所有未捕获的错误都会记录到控制台，便于调试

### 性能优化
- **代码分割**: 应用代码按功能模块分割，减少首屏加载时间
- **生产优化**: 构建时自动移除console.log，压缩代码，关闭sourcemap
- **环境变量**: 敏感配置通过环境变量管理，避免硬编码
- **骨架屏加载**: 提供优雅的加载状态，改善用户感知性能

### 用户体验
- **骨架屏**: 数据加载时显示结构化的占位符，提升视觉连续性
- **平滑过渡**: 所有状态切换都有动画过渡效果
- **响应式设计**: 完美适配各种设备尺寸

## 📂 项目结构

```
Accountbook/
├── index.html                  # HTML 模板
├── package.json                # 项目配置
├── vite.config.js              # Vite 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── postcss.config.js           # PostCSS 配置
├── cloudbaserc.json            # CloudBase 配置
├── README.md                   # 项目说明
├── DEPLOY.md                   # 部署指南
├── REFACTOR_SUMMARY.md         # 重构总结
└── src/
    ├── main.jsx                # 应用入口
    ├── App.jsx                 # 主应用组件（状态管理）
    ├── index.css               # 全局样式
    └── components/             # UI 组件
        ├── LoginModal.jsx      # 登录弹窗
        ├── TransactionModal.jsx # 交易表单
        ├── LedgerModal.jsx     # 账本创建
        ├── LogsPanel.jsx       # 操作日志
        ├── UserMenu.jsx        # 用户菜单
        ├── LedgerDropdown.jsx  # 账本选择
        ├── StatsCards.jsx      # 统计卡片
        ├── TransactionItem.jsx # 交易条目
        ├── ErrorBoundary.jsx   # 错误边界组件
        └── Skeleton.jsx       # 骨架屏加载组件
```

## 🎯 分类说明

**收入分类：**
- 工资
- 投资
- 兼职
- 奖金
- 其他

**支出分类：**
- 餐饮
- 购物
- 交通
- 娱乐
- 医疗
- 教育
- 住房
- 其他

## 📄 许可证

MIT
