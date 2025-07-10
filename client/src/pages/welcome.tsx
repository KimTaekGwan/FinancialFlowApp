import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Shield, GraduationCap } from "lucide-react";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#6C5CE7] to-[#0984E3] text-white p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute bottom-32 left-8 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <div className="flex flex-col justify-center items-center flex-1">
        {/* App Logo and Title */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <Bot className="text-3xl text-[#6C5CE7]" size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-3">스무고개 금융앱</h1>
          <p className="text-lg opacity-90">AI가 도와주는 쉬운 금융 서비스</p>
        </div>

        {/* Features showcase */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center space-x-3">
            <MessageCircle className="text-white bg-white/20 p-2 rounded-full" size={32} />
            <span className="text-base">대화하듯 쉽게</span>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="text-white bg-white/20 p-2 rounded-full" size={32} />
            <span className="text-base">안전하고 신뢰할 수 있게</span>
          </div>
          <div className="flex items-center space-x-3">
            <GraduationCap className="text-white bg-white/20 p-2 rounded-full" size={32} />
            <span className="text-base">천천히 배워가며</span>
          </div>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={() => setLocation("/dashboard")}
          className="w-full bg-white text-[#6C5CE7] font-semibold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 touch-feedback"
          size="lg"
        >
          시작하기
        </Button>
        
        <p className="text-sm opacity-75 mt-4 text-center">
          처음이어도 괜찮아요. 차근차근 도와드릴게요!
        </p>
      </div>
    </div>
  );
}
