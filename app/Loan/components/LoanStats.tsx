import { Loan } from './loan';

interface LoanStatsProps {
  loans: Loan[];
}

export default function LoanStats({ loans }: LoanStatsProps) {
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => loan.status === 'ACTIVE').length;
  const overdueLoans = loans.filter(loan => {
    if (loan.status !== 'ACTIVE') return false;
    const dueDate = new Date(loan.dueDate);
    const today = new Date();
    return dueDate < today;
  }).length;
  
  const totalFines = loans.reduce((sum, loan) => sum + (loan.fineAmount - loan.finePaidAmount - loan.fineWaivedAmount), 0);

  const stats = [
    {
      name: 'Total Loans',
      value: totalLoans,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      name: 'Active Loans',
      value: activeLoans,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      name: 'Overdue Loans',
      value: overdueLoans,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
    {
      name: 'Outstanding Fines',
      value: `$${totalFines.toFixed(2)}`,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}