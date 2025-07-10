import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Mic } from "lucide-react";

interface AIInterventionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
}

export default function AIInterventionPopup({ 
  isOpen, 
  onClose, 
  currentPage 
}: AIInterventionPopupProps) {
  const [, setLocation] = useLocation();

  const getContextualMessage = (page: string) => {
    switch (page) {
      case "/dashboard":
        return "혹시 어떤 작업을 하시려던 건가요?";
      case "/send-money":
        return "송금에 도움이 필요하신가요?";
      case "/transactions":
        return "거래내역을 찾고 계신가요?";
      case "/profile":
        return "설정을 변경하시려고 하시나요?";
      default:
        return "혹시 어떤 작업을 하시려던 건가요?";
    }
  };

  const getQuickActions = (page: string) => {
    switch (page) {
      case "/dashboard":
        return [
          { label: "계좌이체", action: () => setLocation("/send-money") },
          { label: "예금조회", action: () => {} },
          { label: "거래내역", action: () => setLocation("/transactions") }
        ];
      case "/send-money":
        return [
          { label: "계좌이체", action: () => {} },
          { label: "연락처 찾기", action: () => {} },
          { label: "금액 입력", action: () => {} }
        ];
      case "/transactions":
        return [
          { label: "최근 거래", action: () => {} },
          { label: "송금 내역", action: () => {} },
          { label: "입금 내역", action: () => {} }
        ];
      default:
        return [
          { label: "계좌이체", action: () => setLocation("/send-money") },
          { label: "예금조회", action: () => {} },
          { label: "거래내역", action: () => setLocation("/transactions") }
        ];
    }
  };

  const handleAIChat = () => {
    onClose();
    setLocation("/ai-chat");
  };

  const handleQuickAction = (action: () => void) => {
    onClose();
    action();
  };

  const quickActions = getQuickActions(currentPage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl p-0 bg-gradient-to-b from-blue-50 to-blue-100 border-none">
        <DialogTitle className="sr-only">AI 도우미 지원</DialogTitle>
        <DialogDescription className="sr-only">
          AI 도우미가 현재 상황에서 도움을 제공하고자 합니다. 필요한 작업을 선택하거나 음성으로 질문하세요.
        </DialogDescription>
        
        {/* AI Assistant Header */}
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Bot className="text-[#6C5CE7] text-2xl" />
          </div>
        </div>

        {/* Message Bubble */}
        <div className="px-6 pb-4">
          <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm">
            <p className="text-base font-medium text-gray-800 text-center">
              {getContextualMessage(currentPage)}
            </p>
          </div>
        </div>

        {/* Subtitle */}
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 text-center">
            화면을 보고 계시더니,<br />
            뭔가 하시고 싶은 일이 있으실텐데요
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="px-6 pb-4 space-y-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="w-full bg-white/80 text-gray-700 font-medium py-4 rounded-2xl text-base hover:bg-white hover:shadow-md transition-all duration-200 border border-white/50"
              variant="ghost"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{action.label}</span>
              </div>
            </Button>
          ))}
          
          <Button
            onClick={() => handleQuickAction(() => {})}
            className="w-full bg-white/80 text-gray-700 font-medium py-4 rounded-2xl text-base hover:bg-white hover:shadow-md transition-all duration-200 border border-white/50"
            variant="ghost"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>잘 모르겠어요</span>
            </div>
          </Button>
        </div>

        {/* Voice Input */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleAIChat}
            className="w-16 h-16 bg-[#6C5CE7] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6C5CE7]/90 transition-colors"
            size="icon"
          >
            <Mic className="text-white text-2xl" />
          </Button>
        </div>

        {/* Bottom spacing */}
        <div className="h-4"></div>
      </DialogContent>
    </Dialog>
  );
}