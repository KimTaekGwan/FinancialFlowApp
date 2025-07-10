import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/bottom-navigation";
import AIInterventionPopup from "@/components/ai-intervention-popup";
import { useAIIntervention } from "@/hooks/use-ai-intervention";
import { User, Bell, Shield, Volume2, HelpCircle, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";
import type { User as UserType } from "@shared/schema";

export default function Profile() {
  const [, setLocation] = useLocation();

  // AI Intervention system - triggers popup after 5 seconds of inactivity
  const { showIntervention, dismissIntervention } = useAIIntervention({
    triggerDelayMs: 5000,
    enabled: true
  });

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user/1"],
  });

  const learningProgress = [
    { skill: "송금하기", progress: 100, status: "완료!" },
    { skill: "거래내역 확인", progress: 100, status: "완료!" },
    { skill: "공과금 납부", progress: 75, status: "75%" },
  ];

  const settingsOptions = [
    { icon: Bell, label: "알림 설정" },
    { icon: Shield, label: "보안 설정" },
    { icon: Volume2, label: "음성 설정" },
    { icon: HelpCircle, label: "도움말" },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#6C5CE7] text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || "김순자"}님</h2>
            <p className="text-base opacity-90">KB국민은행 고객</p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Account Info */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">계좌 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">주 계좌</span>
                <span className="font-medium">{user?.bankAccount || "KB국민은행 ****1234"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">잔액</span>
                <span className="font-medium">
                  {user?.balance ? formatCurrency(user.balance) : "0원"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">등급</span>
                <span className="font-medium text-[#6C5CE7]">골드 고객</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Learning Progress */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">학습 진행 상황</h3>
            <div className="space-y-4">
              {learningProgress.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">{item.skill}</span>
                    <span className={`text-sm font-medium ${
                      item.progress === 100 ? 'text-[#6C5CE7]' : 'text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="w-full bg-[#F8F9FA] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.progress === 100 ? 'bg-[#00B894]' : 'bg-[#0984E3]'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">설정</h3>
            <div className="space-y-4">
              {settingsOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full flex items-center justify-between p-3 hover:bg-[#F8F9FA] rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className="text-gray-600 w-5 h-5" />
                    <span>{option.label}</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation currentPage="profile" />

      {/* AI Intervention Popup */}
      <AIInterventionPopup
        isOpen={showIntervention}
        onClose={dismissIntervention}
        currentPage="/profile"
      />
    </div>
  );
}
