// This file contains utility functions for formatting and displaying data
// No mock data is generated here - all data comes from the API

export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('ko-KR').format(num) + '원';
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return '어제';
  } else {
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  }
};

export const getTransactionIcon = (type: string): string => {
  switch (type) {
    case 'send':
      return 'arrow-up';
    case 'receive':
      return 'arrow-down';
    case 'payment':
      return 'coffee';
    default:
      return 'exchange-alt';
  }
};

export const getTransactionColor = (type: string): string => {
  switch (type) {
    case 'send':
      return 'bg-red-500';
    case 'receive':
      return 'bg-green-500';
    case 'payment':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};
