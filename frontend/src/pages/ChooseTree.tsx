import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TreePine, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartButton } from "@/components/CartButton";
import { Cart } from "@/components/Cart";

interface TreeSpecies {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string | null;
}

const ChooseTree: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, state } = useCart();
  const [species, setSpecies] = useState<TreeSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchTreeSpecies();
  }, []);

  const fetchTreeSpecies = async () => {
    // Mocking the data since there is no endpoint to fetch tree species
    setSpecies([
      {
        id: "neem",
        name: "Neem Tree",
        price: 400,
        description: "Known for its medicinal properties and air purification.",
        image_url: null
      },
      {
        id: "banyan",
        name: "Banyan Tree",
        price: 600,
        description: "Sacred fig tree known for its expansive canopy.",
        image_url: null
      },
      {
        id: "mango",
        name: "Mango Tree",
        price: 500,
        description: "Fruit-bearing tree that provides shade and food.",
        image_url: null
      }
    ]);
    setLoading(false);
  };

  const handleAddToCart = (tree: TreeSpecies) => {
    addItem({
      id: tree.id,
      name: tree.name,
      price: tree.price,
      description: tree.description,
      image_url: tree.image_url
    });
    toast.success(`${tree.name} added to cart`, {
      description: "You can add more trees or proceed to checkout.",
      action: {
        label: "View Cart",
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TreePine className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading tree species...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/donate')}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
              <div className="animate-fade-up">
                <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                  Choose Your Trees
                </h1>
                <p className="text-lg text-muted-foreground">
                  Select multiple trees to make a bigger impact
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  View Cart
                  {state.totalQuantity > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm">
                      {state.totalQuantity}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Trees Grid */}
          {species.length === 0 ? (
            <Card className="p-8 text-center">
              <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading font-semibold text-xl mb-2">No Trees Available</h2>
              <p className="text-muted-foreground mb-6">
                Please try again later or contact support.
              </p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {species.map((tree, index) => (
                <Card
                  key={tree.id}
                  className="group p-6 transition-all hover:shadow-lg animate-fade-up border-2 hover:border-primary"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                        <TreePine className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-xl">{tree.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tree.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Price per tree</p>
                          <span className="font-heading font-bold text-primary text-2xl block">
                            ₹{tree.price}
                          </span>
                        </div>
                        <Button
                          size="lg"
                          onClick={() => handleAddToCart(tree)}
                          className="font-heading font-semibold bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-md focus:ring-2 focus:ring-green-400"
                        >
                          <ShoppingBag className="h-5 w-5 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Cart Sheet */}
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default ChooseTree;
