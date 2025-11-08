import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Gift, Heart, Cake, Users, TreePine, Sparkles, Leaf, Apple, Flower, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Cart } from "@/components/Cart";

interface TreeSpecies {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
}

const occasions = [
  { value: "birthday", label: "Birthday", icon: Cake },
  { value: "wedding", label: "Wedding", icon: Heart },
  { value: "anniversary", label: "Anniversary", icon: Sparkles },
  { value: "corporate", label: "Corporate Event", icon: Users },
  { value: "memorial", label: "Memorial", icon: TreePine },
  { value: "other", label: "Other Celebration", icon: Gift },
];

const categoryConfig = {
  fruit: { label: "Fruit Trees", icon: Apple, color: "text-orange-500" },
  vegetable: { label: "Vegetable Plants", icon: Leaf, color: "text-green-600" },
  herb: { label: "Herbs", icon: Flower, color: "text-purple-500" },
  indoor: { label: "Indoor/Decorative", icon: TreePine, color: "text-blue-500" },
};

const mockTreeSpecies: TreeSpecies[] = [
  { id: '1', name: 'Mango Tree', category: 'fruit', price: 1500, description: 'A sweet and juicy fruit-bearing tree.' },
  { id: '2', name: 'Neem Tree', category: 'indoor', price: 1200, description: 'Known for its medicinal properties.' },
  { id: '3', name: 'Rose Plant', category: 'herb', price: 800, description: 'A beautiful flowering plant.' },
  { id: '4', name: 'Tulsi Plant', category: 'herb', price: 500, description: 'A sacred and medicinal herb.' },
  { id: '5', name: 'Banyan Tree', category: 'indoor', price: 2500, description: 'A large, long-living shade tree.' },
  { id: '6', name: 'Peepal Tree', category: 'indoor', price: 2200, description: 'A sacred tree in many cultures.' },
  { id: '7', name: 'Guava Tree', category: 'fruit', price: 1300, description: 'A delicious and nutritious fruit tree.' },
  { id: '8', name: 'Marigold Plant', category: 'herb', price: 600, description: 'A bright and cheerful flowering plant.' },
  { id: '9', name: 'Ashoka Tree', category: 'indoor', price: 1800, description: 'An ornamental tree with beautiful flowers.' },
  { id: '10', name: 'Bamboo Plant', category: 'indoor', price: 1000, description: 'A fast-growing and versatile grass.' },
  { id: '11', name: 'Coconut Tree', category: 'fruit', price: 2000, description: 'A tropical tree with many uses.' },
  { id: '12', name: 'Jasmine Plant', category: 'herb', price: 700, description: 'A fragrant flowering plant.' },
  { id: '13', name: 'Lemon Tree', category: 'fruit', price: 1400, description: 'A citrus tree with sour fruits.' },
  { id: '14', name: 'Hibiscus Plant', category: 'herb', price: 750, description: 'A plant with large, colorful flowers.' },
  { id: '15', name: 'Aloe Vera Plant', category: 'vegetable', price: 1, description: 'A succulent plant with medicinal uses.' },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dedicationType: string;
  dedicatee: string;
  message: string;
  name: string;
  occasion: string;
  customAmount: string;
}

const Donate = () => {
  const navigate = useNavigate();
  const { state: cart, updateQuantity, addItem } = useCart();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dedicationType: "self",
    dedicatee: "",
    message: "",
    name: "",
    occasion: "",
    customAmount: "",
  });
  const [treeSpecies, setTreeSpecies] = useState<TreeSpecies[]>([]);
  const [filteredTrees, setFilteredTrees] = useState<TreeSpecies[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchTreeSpecies();
  }, []);

  useEffect(() => {
    filterTrees();
  }, [formData.customAmount, selectedCategory, treeSpecies]);

  const fetchTreeSpecies = async () => {
    // Mocking the data since there is no endpoint to fetch tree species
    setTreeSpecies(mockTreeSpecies);
    setFilteredTrees(mockTreeSpecies);
    setLoading(false);
  };

  const filterTrees = () => {
    let filtered = [...treeSpecies];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(tree => tree.category === selectedCategory);
    }

    // Filter by custom amount
    if (formData.customAmount) {
      const amount = parseInt(formData.customAmount);
      if (!isNaN(amount)) {
        filtered = filtered.filter(tree => tree.price <= amount);
      }
    }

    setFilteredTrees(filtered);
  };

  const handleAddToCart = (tree: TreeSpecies) => {
    try {
      addItem({
        id: tree.id,
        name: tree.name,
        price: tree.price,
        description: tree.description || "",
        image_url: null
      });
      toast.success(`${tree.name} added to cart`, {
        description: "You can add more trees or proceed to checkout",
        action: {
          label: "View Cart",
          onClick: () => setIsCartOpen(true)
        }
      });
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Failed to add to cart:', error);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomAmountChange = (amount: string) => {
    setFormData({
      ...formData,
      customAmount: amount,
    });
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Please add at least one tree to your cart');
      return;
    }

    const donationData = {
      donor_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      occasion: formData.occasion,
      dedication_type: formData.dedicationType,
      dedicatee: formData.dedicatee,
      amount: calculateTotal(),
      trees: cart.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        tree_id: `TREE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
      })),
      message: formData.message,
    };

    console.log("Donation data:", donationData);
    navigate('/payment', { state: { donationData } });
  };

  return (
    <>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                Celebrate with a Tree
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Make your special occasion even more meaningful by planting trees. 
                Each tree comes with a personalized certificate and geo-tagged location.
              </p>
            </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Occasion Selection */}
            <Card className="p-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="font-heading font-semibold text-2xl mb-6">Choose Your Occasion</h2>
              <div className="grid grid-cols-2 gap-4">
                {occasions.map((occasion) => {
                  const Icon = occasion.icon;
                  return (
                    <button
                      key={occasion.value}
                      onClick={() => setFormData({ ...formData, occasion: occasion.value })}
                      className={`p-4 rounded-xl border-2 transition-all text-left hover:shadow-md ${
                        formData.occasion === occasion.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${
                        formData.occasion === occasion.value ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className="font-medium">{occasion.label}</div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Cart Summary */}
            <Card className="p-4 sm:p-8 bg-gradient-to-br from-primary/5 to-primary-light/5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl sm:text-2xl">Your Cart</h2>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  View Cart
                  {cart.items.length > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm">
                      {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customAmount">Filter by Budget (Optional)</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    min="0"
                    value={formData.customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="text-lg"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {formData.customAmount 
                      ? `Showing trees up to ₹${formData.customAmount}`
                      : "Browse all trees below"}
                  </p>
                </div>
                
                {cart.items.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-primary text-white rounded-lg">
                    <div>
                      <span className="font-medium">Total Trees:</span>
                      <span className="font-bold ml-2">{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-heading font-bold text-xl ml-2">
                        ₹{calculateTotal()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tree Selection */}
          <Card className="p-4 sm:p-8 animate-fade-up mb-8" style={{ animationDelay: "0.25s" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="font-heading font-semibold text-xl sm:text-2xl">Select Your Tree</h2>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <TreePine className="h-8 w-8 animate-pulse text-primary" />
              </div>
            ) : filteredTrees.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No trees available in this price range or category.</p>
                <p className="text-sm mt-2">Try adjusting your filters or amount.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrees.map((tree) => {
                  const CategoryIcon = categoryConfig[tree.category as keyof typeof categoryConfig]?.icon || TreePine;
                  const categoryColor = categoryConfig[tree.category as keyof typeof categoryConfig]?.color || "text-green-500";
                  const isInCart = cart.items.some(item => item.id === tree.id);
                  
                  return (
                    <div
                      key={tree.id}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                        isInCart
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <CategoryIcon className={`h-6 w-6 ${isInCart ? "text-primary" : categoryColor}`} />
                        <span className="font-heading font-bold text-lg text-primary">
                          ₹{tree.price}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1">{tree.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {tree.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground capitalize">
                          {categoryConfig[tree.category as keyof typeof categoryConfig]?.label || tree.category}
                        </span>
                        <Button
                          size="sm"
                          variant={isInCart ? "secondary" : "default"}
                          onClick={() => handleAddToCart(tree)}
                          className="ml-2"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {isInCart ? "Add Again" : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Donation Form */}
          <Card className="p-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <form onSubmit={handleDonationSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Input
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Add a special message for your certificate"
                />
              </div>

              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <h3 className="font-heading font-semibold text-lg">What You'll Receive:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Personalized tree certificate with unique Tree ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Geo-tagged location of your planted tree</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Regular updates on your tree's growth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Environmental impact report (CO₂ saved, water conserved)</span>
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full font-heading font-semibold text-base sm:text-lg"
                disabled={!formData.occasion || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || cart.items.length === 0}
              >
                Proceed to Payment
              </Button>
            </form>
          </Card>
        </div>
      </div>
      </div>
      {/* Cart Dialog */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Donate;
