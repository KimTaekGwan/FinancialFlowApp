import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/bottom-navigation";
import { ArrowLeft, Search, ArrowUp, ArrowDown, Coffee } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/mock-data";
import type { Transaction } from "@shared/schema";

export default function Transactions() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState("전체");

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/1"],
  });

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === "전체") return true;
    if (activeFilter === "송금") return transaction.type === "send";
    if (activeFilter === "입금") return transaction.type === "receive";
    return true;
  });

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt!);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      if (date.toDateString() === today.toDateString()) {
        groupKey = "오늘";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "어제";
      } else {
        groupKey = date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(transaction);
    });
    
    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return <ArrowUp className="text-white" />;
      case 'receive':
        return <ArrowDown className="text-white" />;
      case 'payment':
        return <Coffee className="text-white" />;
      default:
        return <ArrowUp className="text-white" />;
    }
  };

  const getTransactionColor = (type: string) => {
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={() => setLocation("/dashboard")}
            variant="ghost"
            size="icon"
            className="mr-4 text-gray-600"
          >
            <ArrowLeft className="text-xl" />
          </Button>
          <h2 className="text-xl font-bold">거래내역</h2>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Search className="text-xl" />
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 p-6 pt-3">
        <div className="flex space-x-4">
          {["전체", "송금", "입금"].map((filter) => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              variant={activeFilter === filter ? "default" : "outline"}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === filter
                  ? "bg-[#6C5CE7] text-white"
                  : "bg-[#F8F9FA] text-gray-600"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date}>
            <h3 className="font-semibold text-base mb-3 text-gray-700">{date}</h3>
            <Card className="shadow-lg divide-y divide-gray-100">
              <CardContent className="p-0">
                {dayTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${getTransactionColor(transaction.type)} rounded-full flex items-center justify-center`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.recipient}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt!)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'send' ? 'text-red-500' : 'text-green-500'}`}>
                        {transaction.type === 'send' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">완료</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <BottomNavigation currentPage="transactions" />
    </div>
  );
}
