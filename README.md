# 💰 记账本 - Expense Tracker

一个简洁美观的个人记账本 Web 应用，帮助您轻松管理日常收支。

## ✨ 功能特点

- 📊 **收支统计** - 实时查看总收入、总支出和余额
- ➕ **添加记录** - 快速添加收入或支出记录
- ✏️ **编辑删除** - 灵活管理所有记账记录
- 🔍 **分类筛选** - 按收入/支出类型筛选记录
- 💾 **数据持久化** - 数据自动保存到浏览器本地存储
- 📱 **响应式设计** - 完美适配手机、平板和电脑
- 🎨 **现代UI** - 采用 Tailwind CSS 设计，美观大方

## 🛠️ 技术栈

- React 18
- Vite
- Tailwind CSS
- Lucide React (图标)
- localStorage

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

## 📝 使用说明

1. **查看统计**：页面顶部显示总收入、总支出和余额
2. **添加记录**：点击"添加记录"按钮，填写金额、分类、日期和备注
3. **筛选记录**：使用"全部"、"收入"、"支出"按钮筛选
4. **编辑记录**：点击记录右侧的编辑图标进行修改
5. **删除记录**：点击记录右侧的删除图标移除记录

## 📂 项目结构

```
notebook/
├── index.html          # HTML 模板
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
├── tailwind.config.js  # Tailwind CSS 配置
├── postcss.config.js   # PostCSS 配置
└── src/
    ├── main.jsx        # 应用入口
    ├── App.jsx         # 主应用组件
    └── index.css       # 全局样式
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
