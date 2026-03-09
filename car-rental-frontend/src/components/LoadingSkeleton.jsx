const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="card-premium overflow-hidden animate-pulse">
            <div className="h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-y-2">
                  <div className="h-7 bg-gray-200 rounded-lg w-24"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-20"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl w-28"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(count || 3)].map((_, i) => (
          <div key={i} className="card-premium p-6 animate-pulse">
            <div className="flex space-x-4">
              <div className="h-24 w-32 bg-gray-200 rounded-xl flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="animate-pulse space-y-8">
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-xl w-3/4 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="card-premium overflow-hidden">
          <div className="h-96 bg-gray-200"></div>
          <div className="p-4 flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="card-premium p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="grid grid-cols-4 gap-4 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
    </div>
  );
};

export default LoadingSkeleton;
