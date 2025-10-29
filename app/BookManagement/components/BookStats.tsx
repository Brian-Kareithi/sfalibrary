interface BookStatsProps {
  summary: {
    totalBooks: number;
    totalCopies: number;
    availableCopies: number;
    borrowedCopies: number;
  };
}

export default function BookStats({ summary }: BookStatsProps) {
  const stats = [
    { 
      name: 'Total Books', 
      value: summary.totalBooks, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: '📚',
      description: 'Unique book titles'
    },
    { 
      name: 'Total Copies', 
      value: summary.totalCopies, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: '📖',
      description: 'Physical & digital copies'
    },
    { 
      name: 'Available Copies', 
      value: summary.availableCopies, 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: '✅',
      description: 'Ready for borrowing'
    },
    { 
      name: 'Borrowed Copies', 
      value: summary.borrowedCopies, 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      icon: '📑',
      description: 'Currently on loan'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div 
          key={stat.name} 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white text-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </div>
          </div>
          {/* Progress bar for borrowed/available ratio */}
          {(stat.name === 'Borrowed Copies' || stat.name === 'Available Copies') && summary.totalCopies > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{stat.name === 'Borrowed Copies' ? 'Borrowed' : 'Available'}</span>
                <span>{Math.round((stat.value / summary.totalCopies) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${stat.color.split(' ')[0]} transition-all duration-500`}
                  style={{ width: `${(stat.value / summary.totalCopies) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}