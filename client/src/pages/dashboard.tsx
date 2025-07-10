import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/bottom-navigation";
import AIInterventionPopup from "@/components/ai-intervention-popup";
import { useAIIntervention } from "@/hooks/use-ai-intervention";
import { Bot, Send, List, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/mock-data";
import type { User, Transaction } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/1"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/1"],
  });

  const recentTransactions = transactions.slice(0, 2);

  // AI Intervention system - triggers popup after 5 seconds of inactivity
  const { showIntervention, dismissIntervention } = useAIIntervention({
    triggerDelayMs: 5000,
    enabled: true
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#6C5CE7] text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-base opacity-90">안녕하세요!</p>
            <h2 className="text-xl font-bold">{user?.name || "김순자"}님</h2>
          </div>
          <Button
            onClick={() => setLocation("/ai-chat")}
            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
            size="icon"
          >
            <Bot className="text-xl" />
          </Button>
        </div>
        
        {/* Account Balance Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-none">
          <CardContent className="p-4">
            <p className="text-sm opacity-80 mb-1">총 잔액</p>
            <h3 className="text-2xl font-bold mb-2">
              {user?.balance ? formatCurrency(user.balance) : "0원"}
            </h3>
            <div className="flex items-center space-x-2">
              <Eye className="text-sm" />
              <span className="text-sm">{user?.bankAccount || "KB국민은행 ****1234"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="p-6 -mt-4 flex-1">
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">자주 하는 일</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setLocation("/send-money")}
                variant="ghost"
                className="flex flex-col items-center p-4 bg-[#F8F9FA] rounded-xl hover:bg-gray-100 transition-colors h-auto touch-feedback"
              >
                <div className="w-12 h-12 bg-[#6C5CE7] rounded-full flex items-center justify-center mb-2">
                  <Send className="text-white" />
                </div>
                <span className="text-sm font-medium">송금하기</span>
              </Button>
              <Button
                onClick={() => setLocation("/transactions")}
                variant="ghost"
                className="flex flex-col items-center p-4 bg-[#F8F9FA] rounded-xl hover:bg-gray-100 transition-colors h-auto touch-feedback"
              >
                <div className="w-12 h-12 bg-[#0984E3] rounded-full flex items-center justify-center mb-2">
                  <List className="text-white" />
                </div>
                <span className="text-sm font-medium">거래내역</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">최근 거래</h3>
              <Button
                onClick={() => setLocation("/transactions")}
                variant="ghost"
                className="text-[#6C5CE7] text-sm font-medium p-0 h-auto"
              >
                전체보기
              </Button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${transaction.type === 'send' ? 'bg-red-500' : transaction.type === 'receive' ? 'bg-green-500' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                      <Send className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.recipient}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.createdAt!)}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${transaction.type === 'send' ? 'text-red-500' : 'text-green-500'}`}>
                    {transaction.type === 'send' ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation currentPage="dashboard" />

      {/* AI Intervention Popup */}
      <AIInterventionPopup
        isOpen={showIntervention}
        onClose={dismissIntervention}
        currentPage="/dashboard"
      />
    </div>
  );
}
