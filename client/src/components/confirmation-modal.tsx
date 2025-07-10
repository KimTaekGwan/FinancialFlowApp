import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipient: string;
  amount: string;
  message: string;
  isLoading: boolean;
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  recipient,
  amount,
  message,
  isLoading,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#6C5CE7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-[#6C5CE7] text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">송금을 확인해주세요</h3>
          <p className="text-gray-600 text-sm">한 번 더 확인해보겠습니다</p>
        </div>
        
        <div className="bg-[#F8F9FA] rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">받는 분</span>
            <span className="font-medium">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">금액</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          {message && (
            <div className="flex justify-between">
              <span className="text-gray-600">메시지</span>
              <span className="font-medium">{message}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-[#6C5CE7] text-white font-semibold py-4 rounded-2xl text-lg hover:bg-[#6C5CE7]/90 transition-colors"
            size="lg"
          >
            {isLoading ? "처리중..." : "네, 송금하겠습니다"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full bg-[#F8F9FA] text-gray-600 font-semibold py-4 rounded-2xl text-lg hover:bg-gray-100 transition-colors"
            size="lg"
          >
            다시 확인하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
