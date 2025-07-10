import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/mock-data";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  recipient: string;
  amount: string;
}

export default function SuccessModal({
  open,
  onClose,
  recipient,
  amount,
}: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#00B894]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-[#00B894] text-3xl" />
          </div>
          <h3 className="text-2xl font-bold mb-3">송금 완료!</h3>
          <p className="text-gray-600 mb-2">{recipient}님께</p>
          <p className="text-xl font-bold text-[#00B894] mb-6">{formatCurrency(amount)}을 보냈습니다</p>
          <p className="text-sm text-gray-500 mb-8">정말 잘하셨어요! 👏</p>
          
          <Button
            onClick={onClose}
            className="w-full bg-[#6C5CE7] text-white font-semibold py-4 rounded-2xl text-lg hover:bg-[#6C5CE7]/90 transition-colors"
            size="lg"
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
