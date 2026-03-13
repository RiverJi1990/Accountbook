export default function Skeleton({ className = '', lines = 3, type = 'text' }) {
  const renderContent = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-5 bg-slate-200 rounded w-1/3"></div>
          </div>
        );

      case 'stats':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          </div>
        );

      case 'chart':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="h-80 bg-slate-200 rounded-xl"></div>
          </div>
        );

      case 'transaction':
        return (
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
              <div className="h-5 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
        );

      case 'header':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="flex gap-10">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`h-4 bg-slate-200 rounded ${
                  index === lines - 1 ? 'w-2/3' : 'w-full'
                }`}
              ></div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {renderContent()}
    </div>
  );
}

// 辅助组件：统计卡片骨架屏
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Skeleton type="stats" />
      <Skeleton type="stats" />
      <Skeleton type="stats" />
    </div>
  );
}

// 辅助组件：交易列表骨架屏
export function TransactionListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} type="transaction" />
      ))}
    </div>
  );
}

// 辅助组件：完整页面骨架屏
export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Skeleton type="header" className="mb-8" />
      <StatsSkeleton />
      <Skeleton type="chart" className="mb-6" />
      <TransactionListSkeleton count={5} />
    </div>
  );
}