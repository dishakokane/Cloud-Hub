import { useState } from "react";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIssues, IssueType } from "@/hooks/use-issues";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2, MapPin, UploadCloud, Image as ImageIcon, X } from "lucide-react";

export default function ReportIssuePage() {
  const { reportIssue } = useIssues();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<IssueType | "">("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocationCoords({ lat, lng });
          setLocationLabel(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          setGettingLocation(false);
          toast.success("Location captured");
        },
        (error) => {
          toast.error("Failed to get location. Please enter manually.");
          setGettingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
      toast.error("Please select an issue type");
      return;
    }
    if (description.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const loc = locationCoords ? { ...locationCoords, label: locationLabel || `${locationCoords.lat}, ${locationCoords.lng}` } : (locationLabel ? { lat: 0, lng: 0, label: locationLabel } : null);
      
      const ticketId = await reportIssue({
        type: type as IssueType,
        description,
        imageFile,
        location: loc
      });
      
      toast.success(`Ticket ${ticketId} created successfully`);
      setLocation("/user/issues");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit issue");
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Report New Issue" subtitle="Provide details about the problem you're experiencing.">
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="type">Issue Type <span className="text-red-500">*</span></Label>
              <Select value={type} onValueChange={(val) => setType(val as IssueType)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Describe the issue in detail..." 
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length} / 10 min chars
              </p>
            </div>

            <div className="space-y-2">
              <Label>Screenshot (Optional)</Label>
              {imagePreview ? (
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6" 
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('image')?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <span className="text-sm text-muted-foreground">PNG, JPG up to 5MB</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Location (Optional)</Label>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                  Use My Location
                </Button>
                <div className="flex-1">
                  <Input 
                    placeholder="Or enter location manually..." 
                    value={locationLabel}
                    onChange={(e) => setLocationLabel(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t">
              <Button type="button" variant="ghost" onClick={() => setLocation("/user/dashboard")} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Ticket
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
