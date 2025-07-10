import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ConfirmationModal from "@/components/confirmation-modal";
import SuccessModal from "@/components/success-modal";
import { ArrowLeft, Bot, Mic, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/mock-data";
import type { Contact } from "@shared/schema";

export default function SendMoney() {
  const [, setLocation] = useLocation();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/contacts/1/frequent"],
  });

  const sendMoneyMutation = useMutation({
    mutationFn: async (transactionData: any) => {
      const response = await apiRequest("POST", "/api/transactions", transactionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/1"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/1"] });
      setShowConfirmation(false);
      setShowSuccess(true);
    },
  });

  const handleSendMoney = () => {
    if (!selectedContact || !amount) return;
    
    setShowConfirmation(true);
  };

  const confirmSend = () => {
    if (!selectedContact || !amount) return;

    sendMoneyMutation.mutate({
      userId: 1,
      type: "send",
      amount: amount,
      recipient: selectedContact.name,
      recipientAccount: selectedContact.account,
      description: message || "송금",
      status: "completed",
    });
  };

  const quickAmounts = ["50000", "100000", "200000"];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-6 flex items-center">
        <Button
          onClick={() => setLocation("/dashboard")}
          variant="ghost"
          size="icon"
          className="mr-4 text-gray-600"
        >
          <ArrowLeft className="text-xl" />
        </Button>
        <h2 className="text-xl font-bold">송금하기</h2>
      </div>

      {/* AI Assistant Prompt */}
      <div className="bg-gradient-to-r from-[#6C5CE7]/10 to-[#0984E3]/10 p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#6C5CE7] rounded-full flex items-center justify-center">
            <Bot className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm mb-1">AI 도우미가 도와드릴게요!</p>
            <p className="text-xs text-gray-600">누구에게 얼마를 보내실 건가요?</p>
          </div>
          <Button
            onClick={() => setLocation("/ai-chat")}
            variant="ghost"
            size="icon"
            className="text-[#6C5CE7]"
          >
            <Mic className="text-lg" />
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Recipient Selection */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">받는 분</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">자주 보내는 분</p>
              <div className="grid grid-cols-3 gap-3">
                {contacts.map((contact) => (
                  <Button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    variant="ghost"
                    className={`flex flex-col items-center p-3 rounded-xl h-auto transition-colors touch-feedback ${
                      selectedContact?.id === contact.id 
                        ? 'bg-[#6C5CE7]/10 border-2 border-[#6C5CE7]' 
                        : 'bg-[#F8F9FA] hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-12 h-12 ${contact.name.includes('민수') ? 'bg-[#00B894]' : 'bg-[#0984E3]'} rounded-full flex items-center justify-center mb-2`}>
                      <span className="text-white font-semibold">
                        {contact.name.charAt(contact.name.length - 1)}
                      </span>
                    </div>
                    <span className="text-xs font-medium">{contact.name}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="flex flex-col items-center p-3 bg-[#F8F9FA] rounded-xl hover:bg-gray-100 transition-colors h-auto"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <Plus className="text-gray-600" />
                  </div>
                  <span className="text-xs">새로 추가</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">보낼 금액</h3>
            <div className="text-center mb-4">
              <Input
                type="text"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="text-3xl font-bold text-center border-none outline-none shadow-none text-center"
              />
              <p className="text-lg text-gray-600 mt-1">원</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  variant="outline"
                  className="py-3 bg-[#F8F9FA] rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors"
                >
                  {formatCurrency(quickAmount)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">보내는 말 (선택사항)</h3>
            <Input
              type="text"
              placeholder="예: 용돈입니다"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 bg-[#F8F9FA] rounded-xl border-none outline-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Send Button */}
      <div className="p-6 bg-white border-t border-gray-100">
        <Button
          onClick={handleSendMoney}
          disabled={!selectedContact || !amount || sendMoneyMutation.isPending}
          className="w-full bg-[#6C5CE7] text-white font-semibold py-4 rounded-2xl text-lg hover:bg-[#6C5CE7]/90 transition-colors touch-feedback"
          size="lg"
        >
          {sendMoneyMutation.isPending ? "처리중..." : "송금하기"}
        </Button>
      </div>

      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSend}
        recipient={selectedContact?.name || ""}
        amount={amount}
        message={message}
        isLoading={sendMoneyMutation.isPending}
      />

      <SuccessModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setLocation("/dashboard");
        }}
        recipient={selectedContact?.name || ""}
        amount={amount}
      />
    </div>
  );
}
