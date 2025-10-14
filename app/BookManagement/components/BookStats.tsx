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
      color: 'bg-blue-500', 
      textColor: 'text-blue-600' 
    },
    { 
      name: 'Total Copies', 
      value: summary.totalCopies, 
      color: 'bg-purple-500', 
      textColor: 'text-purple-600' 
    },
    { 
      name: 'Available Copies', 
      value: summary.availableCopies, 
      color: 'bg-green-500', 
      textColor: 'text-green-600' 
    },
    { 
      name: 'Borrowed Copies', 
      value: summary.borrowedCopies, 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}