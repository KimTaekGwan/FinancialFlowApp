import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bot, Send, Mic } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { AIConversation } from "@shared/schema";

export default function AiChat() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery<AIConversation[]>({
    queryKey: ["/api/conversations/1"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { userId: number; message: string; type: string }) => {
      const response = await apiRequest("POST", "/api/conversations", messageData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations/1"] });
      setMessage("");
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      userId: 1,
      message: message.trim(),
      type: "chat",
    });
  };

  const quickQuestions = [
    "잔액이 얼마인지 알려주세요",
    "어제 거래내역을 보여주세요", 
    "송금하는 방법을 알려주세요"
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#6C5CE7] text-white p-6 flex items-center">
        <Button
          onClick={() => setLocation("/dashboard")}
          variant="ghost"
          size="icon"
          className="mr-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="text-xl" />
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot />
          </div>
          <div>
            <h2 className="text-lg font-bold">AI 도우미</h2>
            <p className="text-sm opacity-80">무엇이든 물어보세요</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#00B894] rounded-full animate-pulse"></div>
          <span className="text-sm">대화중</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#F8F9FA]">
        {/* Welcome Message */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-[#6C5CE7] rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="text-white text-sm" />
          </div>
          <Card className="bg-white rounded-2xl rounded-tl-md max-w-xs shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm">안녕하세요! 김순자님 😊 오늘 어떤 일을 도와드릴까요?</p>
            </CardContent>
          </Card>
        </div>

        {/* Conversation History */}
        {conversations.map((conversation) => (
          <div key={conversation.id} className="space-y-4">
            {/* User Message */}
            <div className="flex items-start space-x-3 justify-end">
              <Card className="bg-[#6C5CE7] text-white rounded-2xl rounded-tr-md max-w-xs">
                <CardContent className="p-4">
                  <p className="text-sm">{conversation.message}</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Response */}
            {conversation.response && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#6C5CE7] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white text-sm" />
                </div>
                <Card className="bg-white rounded-2xl rounded-tl-md max-w-xs shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-sm">{conversation.response}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}

        {/* Quick Actions */}
        {conversations.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">자주 하는 질문</h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setMessage(question);
                      sendMessageMutation.mutate({
                        userId: 1,
                        message: question,
                        type: "chat",
                      });
                    }}
                    variant="ghost"
                    className="w-full text-left p-3 bg-[#F8F9FA] rounded-xl text-sm hover:bg-gray-100 transition-colors justify-start"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-[#F8F9FA] rounded-2xl px-4 py-3 flex items-center space-x-3">
            <Input
              type="text"
              placeholder="궁금한 것을 말씀해주세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 outline-none bg-transparent text-sm border-none shadow-none"
            />
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Mic className="text-lg" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="w-12 h-12 bg-[#6C5CE7] rounded-full flex items-center justify-center text-white hover:bg-[#6C5CE7]/90"
            size="icon"
          >
            <Send />
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">음성으로도 말씀하실 수 있어요</p>
      </div>
    </div>
  );
}
