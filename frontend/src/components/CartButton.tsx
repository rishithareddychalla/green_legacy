import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

export const CartButton = ({ onClick }: CartButtonProps) => {
  const { state } = useCart();

  return (
    <Button
      variant="outline"
      className="relative flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border-2 border-green-500 bg-white hover:bg-green-50 transition-all duration-200 text-green-700 font-semibold text-base md:text-base lg:text-base"
      style={{ minWidth: 64 }}
      onClick={onClick}
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="hidden sm:inline">Cart</span>
      {state.totalQuantity > 0 && (
        <span className="ml-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full absolute -top-2 -right-2 shadow-lg">
          {state.totalQuantity}
        </span>
      )}
    </Button>
  );
};