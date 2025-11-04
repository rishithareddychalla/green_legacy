import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplet, Wind, Download, MapPin, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import Certificate from "@/components/Certificate";

interface TreeData {
  _id: string;
  donor_name: string;
  species_name: string;
  tree_id: string;
  location: string;
  payment_id: string;
}

interface Profile {
  full_name: string | null;
  email: string | null;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const res = await fetch('http://localhost:5000/my-trees', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch trees');
        }
        const data = await res.json();
        setTrees(data);
      } catch (error) {
        toast.error('Failed to fetch trees');
      } finally {
        setLoading(false);
      }
    };

    fetchTrees();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const totalTrees = trees.length;
  const co2Absorbed = totalTrees * 22; // kg per year
  const oxygenReleased = totalTrees * 118; // kg per year
  const waterSaved = totalTrees * 140; // liters per year

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name || "Donor"}!
          </h1>
          <p className="text-muted-foreground">Track your environmental impact</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Trees Planted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold">{totalTrees}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CO₂ Absorbed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wind className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold">{co2Absorbed} kg</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">per year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Oxygen Released
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wind className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold">{oxygenReleased} kg</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">per year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Water Conserved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold">{waterSaved} L</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">per year</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trees" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trees">My Trees</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>

        {/* Trees Tab */}
        <TabsContent value="trees" className="space-y-4">
          {trees.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't planted any trees yet
                </p>
                <Button onClick={() => navigate("/donate")}>Plant Your First Tree</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end">
                <Button onClick={() => navigate("/donate")}>
                  Make new plantation
                </Button>
              </div>
              {trees.map((tree) => (
                <Card key={tree._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-primary" />
                        {tree.species_name}
                      </CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Tree ID</div>
                      <div className="font-mono text-sm">{tree.tree_id}</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              ))}
            </>
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          <Certificate donorName={profile?.full_name || "Esteemed Donor"} />
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <div className="mt-1 text-muted-foreground">
                  {profile?.full_name || "Not set"}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="mt-1 text-muted-foreground">
                  {profile?.email}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
