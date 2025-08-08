import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface RequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const airports = [
  { code: "JFK", name: "John F. Kennedy International" },
  { code: "LAX", name: "Los Angeles International" },
  { code: "LHR", name: "London Heathrow" },
  { code: "CDG", name: "Charles de Gaulle" },
  { code: "NRT", name: "Narita International" },
  { code: "SYD", name: "Sydney Airport" },
  { code: "DXB", name: "Dubai International" },
  { code: "SIN", name: "Singapore Changi" },
  { code: "FRA", name: "Frankfurt am Main" },
  { code: "AMS", name: "Amsterdam Schiphol" },
];

export default function RequestModal({ open, onOpenChange }: RequestModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '',
    additionalNotes: '',
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('POST', '/api/point-requests', data);
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your point request has been submitted successfully!",
      });
      onOpenChange(false);
      setFormData({
        flightNumber: '',
        departureAirport: '',
        arrivalAirport: '',
        departureDate: '',
        additionalNotes: '',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/point-requests'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Submission Failed",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.flightNumber || !formData.departureAirport || !formData.arrivalAirport || !formData.departureDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createRequestMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-screen overflow-y-auto animate-slide-in" data-testid="modal-create-request">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Create Point Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Flight Number
            </Label>
            <Input
              id="flightNumber"
              type="text"
              value={formData.flightNumber}
              onChange={(e) => handleInputChange('flightNumber', e.target.value)}
              placeholder="SA1234"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-all"
              data-testid="input-flight-number"
            />
          </div>
          
          <div>
            <Label htmlFor="departureAirport" className="block text-sm font-medium text-gray-700 mb-2">
              Departure Airport
            </Label>
            <Select value={formData.departureAirport} onValueChange={(value) => handleInputChange('departureAirport', value)}>
              <SelectTrigger className="w-full px-4 py-3" data-testid="select-departure-airport">
                <SelectValue placeholder="Select departure airport" />
              </SelectTrigger>
              <SelectContent>
                {airports.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="arrivalAirport" className="block text-sm font-medium text-gray-700 mb-2">
              Arrival Airport
            </Label>
            <Select value={formData.arrivalAirport} onValueChange={(value) => handleInputChange('arrivalAirport', value)}>
              <SelectTrigger className="w-full px-4 py-3" data-testid="select-arrival-airport">
                <SelectValue placeholder="Select arrival airport" />
              </SelectTrigger>
              <SelectContent>
                {airports.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </Label>
            <Input
              id="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={(e) => handleInputChange('departureDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-all"
              data-testid="input-departure-date"
            />
          </div>
          
          <div>
            <Label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </Label>
            <Textarea
              id="additionalNotes"
              rows={3}
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any additional information about your flight..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-all"
              data-testid="textarea-additional-notes"
            />
          </div>
          
          <Button
            type="submit"
            disabled={createRequestMutation.isPending}
            className="w-full bg-gradient-to-r from-airline-blue to-airline-gold text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-yellow-600 transition-all transform hover:scale-105 ripple-effect disabled:opacity-50"
            data-testid="button-submit-request"
          >
            {createRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
