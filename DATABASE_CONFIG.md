# CloudBase 数据库配置指南

## 数据库集合：ledgers

### 集合字段
- `id` (string) - 账本唯一标识符（自动生成）
- `name` (string) - 账本名称
- `icon` (string) - 账本图标（emoji）
- `transactions` (array) - 交易记录列表
  - `id` (number) - 交易ID
  - `type` (string) - 类型：'income' 或 'expense'
  - `amount` (number) - 金额
  - `category` (string) - 分类
  - `date` (string) - 日期（YYYY-MM-DD）
  - `note` (string) - 备注（可选）
- `userId` (string) - 用户ID（从登录状态获取）
- `createdAt` (string) - 创建时间（ISO 8601）
- `updatedAt` (string) - 更新时间（ISO 8601）

## 权限规则配置

在 CloudBase 控制台 -> 数据库 -> ledgers 集合 -> 权限设置 中，配置以下规则：

### 读取权限（Read）
```json
{
  "read": "auth.uid == doc.userId"
}
```

### 写入权限（Write）
```json
{
  "write": "auth.uid == doc.userId"
}
```

或者更细粒度的控制：

```json
{
  "read": "auth.uid == doc.userId",
  "create": "auth.uid != null",
  "update": "auth.uid == doc.userId",
  "delete": "auth.uid == doc.userId"
}
```

## 配置步骤

1. 登录 [CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 选择环境：`river-test-5g9ny38h5b552538`
3. 进入"数据库"页面
4. 创建集合 `ledgers`（如果不存在）
5. 点击集合名称进入详情页
6. 点击"权限设置"
7. 切换到"自定义"模式
8. 粘贴上述权限规则
9. 点击"保存"

## 索引建议

为了提高查询性能，建议创建以下索引：

1. `userId` 字段索引
   - 类型：普通索引
   - 字段：`userId` (升序)
   - 用途：快速查询用户的账本列表

2. 复合索引（可选）
   - 类型：复合索引
   - 字段：`userId` (升序) + `createdAt` (降序)
   - 用途：按创建时间排序的账本列表

## 测试数据

创建测试数据示例：

```json
{
  "name": "日常开销",
  "icon": "💰",
  "transactions": [
    {
      "id": 1712345678000,
      "type": "expense",
      "amount": 100,
      "category": "餐饮",
      "date": "2026-03-12",
      "note": "午餐"
    }
  ],
  "userId": "your_user_id_here",
  "createdAt": "2026-03-12T00:00:00.000Z",
  "updatedAt": "2026-03-12T00:00:00.000Z"
}
```

## 注意事项

1. **用户ID获取**：应用中通过 `user?.uid` 获取当前登录用户的ID
2. **数据隔离**：权限规则确保每个用户只能访问自己的数据
3. **安全规则**：在生产环境中，建议添加更多安全验证
4. **备份**：定期备份数据库数据

## 常见问题

### Q: 创建账本后看不到数据？
A: 检查：
1. 权限规则是否正确配置
2. `userId` 字段是否正确设置
3. 数据库集合是否存在

### Q: 更新失败？
A: 检查：
1. 更新操作是否包含 `userId` 匹配
2. `updatedAt` 字段是否已添加
3. 网络连接是否正常

### Q: 查询返回空数据？
A: 检查：
1. 查询条件中的 `userId` 是否正确
2. 数据库中是否确实有该用户的数据
3. 权限规则是否允许读取
