import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";

const recentAssets = [
  {
    tokenId: "#1234",
    name: "Graduation Certificate",
    owner: "0x1234...5678",
    status: "Verified",
    date: "2025-01-10",
  },
  {
    tokenId: "#1235",
    name: "Digital Art NFT",
    owner: "0xabcd...ef01",
    status: "Active",
    date: "2025-01-09",
  },
  {
    tokenId: "#1236",
    name: "Course Completion",
    owner: "0x9876...5432",
    status: "Verified",
    date: "2025-01-08",
  },
  {
    tokenId: "#1237",
    name: "Achievement Badge",
    owner: "0x5555...6666",
    status: "Pending",
    date: "2025-01-07",
  },
];

export const DashboardContent = () => {
  return (
    <div className="space-y-6 px-8">
      {/* header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your blockchain certificates and NFTs
        </p>
      </div>

      {/* total assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Certificates
            </CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,247</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Creatives
            </CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,247</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Files
            </CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,247</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* recent assets table */}
      <Card className="">
        <CardHeader>
          <CardTitle>Recent Minted Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table >
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Token ID</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Owner</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAssets.map((asset) => (
                  <TableRow key={asset.tokenId}>
                    <TableCell className="font-mono text-primary">{asset.tokenId}</TableCell>
                    <TableCell className="font-medium text-foreground">{asset.name}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{asset.owner}</TableCell>
                    <TableCell>
                      <Badge variant={asset.status === "Verified" ? "default" : asset.status === "Active" ? "secondary" : "outline"}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">{asset.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
