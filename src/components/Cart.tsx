import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { TreePine, Minus, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart = ({ isOpen, onClose }: CartProps) => {
  const { state, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, change: number) => {
    const item = state.items.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/donate", { state: { amount: state.totalAmount } });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-2 pb-4 border-b">
          <SheetTitle className="text-2xl">Your Cart</SheetTitle>
          <SheetClose className="absolute right-4 top-4" />
        </SheetHeader>

        <div className="mt-8 space-y-4 flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <TreePine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            state.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-heading font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading font-semibold">
                    ₹{item.price * item.quantity}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {state.items.length > 0 && (
          <SheetFooter className="mt-auto">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between py-4 border-t">
                <div>
                  <p className="font-medium">Total Trees</p>
                  <p className="text-2xl font-heading font-bold">
                    {state.totalQuantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Total Amount</p>
                  <p className="text-2xl font-heading font-bold text-primary">
                    ₹{state.totalAmount}
                  </p>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};