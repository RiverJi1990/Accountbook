import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // 这里可以记录错误到CloudBase日志或其他错误监控服务
    console.error('应用错误:', error);
    console.error('错误详情:', errorInfo);
    
    // 示例：可以发送错误到监控服务
    // sendErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md">
            <div className="w-20 h-20 mx-auto mb-6">
              <svg className="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.338 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">应用出错了</h2>
            <p className="text-slate-600 mb-6">抱歉，我们的应用遇到了些问题</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              刷新页面重试
            </button>
            <p className="text-slate-400 text-sm mt-6">如果问题持续存在，请联系技术支持</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}