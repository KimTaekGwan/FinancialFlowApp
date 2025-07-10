import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeftRight, Send, User } from "lucide-react";

interface BottomNavigationProps {
  currentPage: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { id: "dashboard", label: "홈", icon: Home, path: "/dashboard" },
    { id: "transactions", label: "거래내역", icon: ArrowLeftRight, path: "/transactions" },
    { id: "send-money", label: "송금", icon: Send, path: "/send-money" },
    { id: "profile", label: "내정보", icon: User, path: "/profile" },
  ];

  return (
    <div className="bg-white border-t border-gray-100 p-4">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setLocation(item.path)}
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-2 ${
              currentPage === item.id ? "text-[#6C5CE7]" : "text-gray-400"
            }`}
          >
            <item.icon className="text-xl" />
            <span className={`text-xs ${currentPage === item.id ? "font-medium" : ""}`}>
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
