import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplet, Wind, Download, MapPin, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "../lib/fetchWithAuth";

interface TreeData {
  id: string;
  tree_id: string;
  amount: number;
  planted_date: string;
  occasion: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  tree_species: {
    name: string;
    category: string;
  } | null;
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
    // Mocking the data since there is no endpoint to fetch dashboard data
    setProfile({ full_name: "Donor", email: "donor@example.com" });
    setTrees([]);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleExport = async (dataType: string) => {
    try {
      const res = await fetchWithAuth(`http://localhost:5000/export-${dataType}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to export data' }));
        throw new Error(err.error);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} exported successfully!`);
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
    }
  };

  const totalTrees = trees.length;
  const totalAmount = trees.reduce((sum, tree) => sum + tree.amount, 0);
  
  // Impact calculations (example values per tree)
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
          <TabsTrigger value="admin">Admin</TabsTrigger>
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
            trees.map((tree) => (
              <Card key={tree.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-primary" />
                        {tree.tree_species?.name || "Tree"}
                      </CardTitle>
                      <CardDescription>
                        Planted on {new Date(tree.planted_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Tree ID</div>
                      <div className="font-mono text-sm">{tree.tree_id}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Occasion</div>
                      <div className="font-medium">{tree.occasion}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="font-medium">{tree.tree_species?.category || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="font-medium">₹{tree.amount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-medium flex items-center gap-1">
                        {tree.location || "N/A"}
                        {tree.latitude && tree.longitude && (
                          <a
                            href={`https://maps.google.com/?q=${tree.latitude},${tree.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                          >
                            <MapPin className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Certificate generation coming soon!
              </p>
              <p className="text-sm text-muted-foreground">
                You'll be able to download and share your tree planting certificates
              </p>
            </CardContent>
          </Card>
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
              <div>
                <label className="text-sm font-medium">Total Contribution</label>
                <div className="mt-1 text-muted-foreground">
                  ₹{totalAmount}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tab */}
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Export data from the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button onClick={() => handleExport("contacts")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Contacts
                </Button>
                <Button onClick={() => handleExport("volunteers")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Volunteers
                </Button>
                <Button onClick={() => handleExport("csrs")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSRs
                </Button>
                <Button onClick={() => handleExport("signups")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Signups
                </Button>
                <Button onClick={() => handleExport("donations")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Donations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
