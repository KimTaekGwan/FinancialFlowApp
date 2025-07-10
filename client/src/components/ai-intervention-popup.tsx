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
        return "송금하시는 데 어려움이 있으신가요?";
      case "/transactions":
        return "거래내역에서 찾으시는 게 있으신가요?";
      case "/profile":
        return "설정에서 도움이 필요하신가요?";
      case "/ai-chat":
        return "AI 채팅에서 궁금한 점이 있으신가요?";
      default:
        return "혹시 어떤 작업을 하시려던 건가요?";
    }
  };

  const getSubtitle = (page: string) => {
    switch (page) {
      case "/dashboard":
        return "화면을 보고 계시더니,\n뭔가 하시고 싶은 일이 있으실텐데요";
      case "/send-money":
        return "송금이 처음이시라면\n차근차근 도와드릴게요";
      case "/transactions":
        return "거래내역이 많아서\n찾기 어려우시죠?";
      case "/profile":
        return "설정이 복잡해 보이시나요?\n필요한 것만 도와드릴게요";
      case "/ai-chat":
        return "어떤 질문이든 편하게\n말씀해 주세요";
      default:
        return "화면을 보고 계시더니,\n뭔가 하시고 싶은 일이 있으실텐데요";
    }
  };

  const getQuickActions = (page: string) => {
    switch (page) {
      case "/dashboard":
        return [
          { label: "돈 보내기", action: () => setLocation("/send-money"), icon: "💸" },
          { label: "잔액 확인", action: () => {}, icon: "💰" },
          { label: "거래내역", action: () => setLocation("/transactions"), icon: "📋" }
        ];
      case "/send-money":
        return [
          { label: "받는 사람 선택", action: () => {}, icon: "👤" },
          { label: "금액 입력 도움", action: () => {}, icon: "🔢" },
          { label: "송금 방법 안내", action: () => setLocation("/ai-chat"), icon: "❓" }
        ];
      case "/transactions":
        return [
          { label: "최근 거래 보기", action: () => {}, icon: "🕒" },
          { label: "송금 내역만", action: () => {}, icon: "📤" },
          { label: "입금 내역만", action: () => {}, icon: "📥" }
        ];
      case "/profile":
        return [
          { label: "알림 설정", action: () => {}, icon: "🔔" },
          { label: "보안 설정", action: () => {}, icon: "🔒" },
          { label: "도움말 보기", action: () => setLocation("/ai-chat"), icon: "❓" }
        ];
      case "/ai-chat":
        return [
          { label: "송금 방법", action: () => {}, icon: "💸" },
          { label: "잔액 문의", action: () => {}, icon: "💰" },
          { label: "사용법 안내", action: () => {}, icon: "📖" }
        ];
      default:
        return [
          { label: "돈 보내기", action: () => setLocation("/send-money"), icon: "💸" },
          { label: "잔액 확인", action: () => {}, icon: "💰" },
          { label: "거래내역", action: () => setLocation("/transactions"), icon: "📋" }
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
          <p className="text-sm text-gray-600 text-center whitespace-pre-line">
            {getSubtitle(currentPage)}
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
              <div className="flex items-center justify-center space-x-3">
                <span className="text-lg">{action.icon}</span>
                <span>{action.label}</span>
              </div>
            </Button>
          ))}
          
          <Button
            onClick={() => handleQuickAction(() => {})}
            className="w-full bg-white/80 text-gray-700 font-medium py-4 rounded-2xl text-base hover:bg-white hover:shadow-md transition-all duration-200 border border-white/50"
            variant="ghost"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-lg">🤔</span>
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