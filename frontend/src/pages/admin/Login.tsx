import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/lib/adminAuth";
import { toast } from "sonner";
import { TreePine, Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(email, password);
      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4"
    >
      <Card className="w-full max-w-md p-8">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center mb-6"
        >
          <TreePine className="h-12 w-12 text-green-600" />
        </motion.div>

        <h1 className="text-3xl font-heading font-bold text-center mb-2">
          GREEN LEGACY
        </h1>
        <p className="text-center text-muted-foreground mb-6">Admin Portal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@greenlegacy.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login to Admin Panel"
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default AdminLogin;