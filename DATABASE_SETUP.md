# CloudBase 数据库配置指南

## 环境 ID
river-test-5g9ny38h5b552538

## 需要创建的集合

### 1. ledgers 集合（账本）
存储所有账本信息

**结构：**
```json
{
  "_id": "自动生成的ID",
  "name": "账本名称",
  "icon": "💰",
  "transactions": [
    {
      "id": 1,
      "type": "income/expense",
      "amount": 1000,
      "category": "工资",
      "date": "2026-03-01",
      "note": "备注"
    }
  ],
  "createdAt": "2026-03-11T00:00:00.000Z"
}
```

**操作步骤：**
1. 访问 CloudBase 控制台
2. 选择环境：river-test
3. 左侧菜单 → 数据库
4. 点击"添加集合"
5. 集合名称：`ledgers`
6. 权限设置：选择"所有用户可读，仅创建者可写"

---

## 快速创建步骤

1. 打开：https://console.cloud.tencent.com/tcb/database
2. 选择环境：river-test
3. 点击"新建集合"
4. 集合名称输入：`ledgers`
5. 点击"确定"

---

## 初始数据（可选）

创建完成后，可以添加一个初始账本：

```json
{
  "name": "公共账本",
  "icon": "💰",
  "transactions": []
}
```
