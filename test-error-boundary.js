// 这是一个测试ErrorBoundary的示例脚本
// 你可以复制这个组件到App.jsx中替换某个部分来测试

const BuggyComponent = () => {
  const [hasError, setHasError] = React.useState(false);
  
  if (hasError) {
    throw new Error('我崩溃了！');
  }
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 my-4">
      <h3 className="font-bold text-yellow-800 mb-2">测试ErrorBoundary组件</h3>
      <p className="text-yellow-600 mb-3">这个组件会抛出一个错误来测试错误边界</p>
      <button
        onClick={() => setHasError(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        点击触发错误
      </button>
      <p className="text-yellow-500 text-sm mt-3">点击按钮后，ErrorBoundary会捕获错误并显示友好的错误页面</p>
    </div>
  );
};

// 如何使用：
// 1. 在App.jsx中导入BuggyComponent
// 2. 在App组件的JSX中合适的位置添加<BuggyComponent />
// 3. 点击按钮测试ErrorBoundary是否正常工作

// 注意：测试完成后请移除BuggyComponent，因为它会破坏应用功能