import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Info, DollarSign, ArrowRight } from "lucide-react";
import Layout from "@/components/layout";
import RequestModal from "@/components/request-modal";
import { useState } from "react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);

  const { data: pointRequests } = useQuery({
    queryKey: ["/api/point-requests"],
  });

  const getStatusCounts = () => {
    if (!pointRequests) return { approved: 0, pending: 0, rejected: 0 };
    
    return pointRequests.reduce((acc: any, request: any) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, { approved: 0, pending: 0, rejected: 0 });
  };

  const statusCounts = getStatusCounts();
  const progressToNextTier = user?.currentPoints ? Math.min((user.currentPoints % 30000) / 30000 * 100, 100) : 0;
  const pointsToNextTier = user?.currentPoints ? 30000 - (user.currentPoints % 30000) : 30000;

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="dashboard-main">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=400" 
            alt="Premium airline cabin interior" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-airline-blue/80 to-airline-gold/60"></div>
          <div className="absolute inset-0 flex items-center p-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2" data-testid="text-welcome">
                Welcome back, <span>{user?.firstName || 'Traveler'}</span>!
              </h2>
              <div className="flex items-center space-x-6 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Current Points</p>
                  <p className="text-2xl font-bold" data-testid="text-current-points">
                    {user?.currentPoints?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm opacity-90">Membership</p>
                  <p className="text-lg font-semibold text-airline-gold" data-testid="text-membership-tier">
                    {user?.membershipTier || 'Silver'} Member
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2">Next tier:</span>
                <div className="bg-white/30 rounded-full h-2 w-32 mr-3">
                  <div 
                    className="bg-airline-gold h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progressToNextTier}%` }}
                  ></div>
                </div>
                <span data-testid="text-points-to-next-tier">
                  {pointsToNextTier?.toLocaleString()} points to Platinum
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => setShowRequestModal(true)}
            data-testid="card-create-request"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Create Request</h3>
                <p className="text-gray-600">Submit new point request</p>
              </div>
              <div className="w-12 h-12 bg-airline-blue rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-earning-rules">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Earning Rules</h3>
                <p className="text-gray-600">View how to earn points</p>
              </div>
              <div className="w-12 h-12 bg-airline-gold rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-redeem-points">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Redeem Points</h3>
                <p className="text-gray-600">Browse rewards catalog</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Requests Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6" data-testid="card-approved-requests">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-approved-count">
                  {statusCounts.approved}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-pending-requests">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-pending-count">
                  {statusCounts.pending}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-rejected-requests">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600" data-testid="text-rejected-count">
                  {statusCounts.rejected}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Earning Programs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Earning Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105" data-testid="card-adventure-program">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200" 
                alt="Mountain landscape destination" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Adventure Destinations</h3>
                <p className="text-gray-600 mb-4">Earn double points on mountain and adventure destinations</p>
                <Button className="w-full bg-airline-blue text-white hover:bg-blue-700" data-testid="button-join-adventure">
                  Join Program
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105" data-testid="card-beach-program">
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200" 
                alt="Tropical beach paradise" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Beach Getaways</h3>
                <p className="text-gray-600 mb-4">Special rates and bonus points for beach destinations</p>
                <Button className="w-full bg-airline-blue text-white hover:bg-blue-700" data-testid="button-join-beach">
                  Join Program
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105" data-testid="card-business-program">
              <img 
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200" 
                alt="Urban city skyline" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Business Travel</h3>
                <p className="text-gray-600 mb-4">Enhanced benefits for frequent business travelers</p>
                <Button className="w-full bg-airline-blue text-white hover:bg-blue-700" data-testid="button-join-business">
                  Join Program
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Voucher Redemption */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Redeem for Vouchers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-4 text-center hover:shadow-lg transition-shadow" data-testid="card-flight-voucher">
              <div className="w-16 h-16 bg-airline-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">$50</span>
              </div>
              <h3 className="font-semibold mb-2">Flight Voucher</h3>
              <p className="text-sm text-gray-600 mb-3">$50 off your next flight</p>
              <p className="text-airline-blue font-bold mb-3">5,000 points</p>
              <Button className="w-full bg-airline-gold text-white hover:bg-yellow-600" data-testid="button-redeem-flight">
                Redeem
              </Button>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow" data-testid="card-hotel-voucher">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">$25</span>
              </div>
              <h3 className="font-semibold mb-2">Hotel Voucher</h3>
              <p className="text-sm text-gray-600 mb-3">$25 hotel credit</p>
              <p className="text-airline-blue font-bold mb-3">2,500 points</p>
              <Button className="w-full bg-green-500 text-white hover:bg-green-600" data-testid="button-redeem-hotel">
                Redeem
              </Button>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow" data-testid="card-upgrade-voucher">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">$100</span>
              </div>
              <h3 className="font-semibold mb-2">Upgrade Voucher</h3>
              <p className="text-sm text-gray-600 mb-3">Business class upgrade</p>
              <p className="text-airline-blue font-bold mb-3">12,000 points</p>
              <Button className="w-full bg-purple-500 text-white hover:bg-purple-600" data-testid="button-redeem-upgrade">
                Redeem
              </Button>
            </Card>

            <Card className="p-4 text-center hover:shadow-lg transition-shadow" data-testid="card-gift-voucher">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">$200</span>
              </div>
              <h3 className="font-semibold mb-2">Gift Card</h3>
              <p className="text-sm text-gray-600 mb-3">$200 travel gift card</p>
              <p className="text-airline-blue font-bold mb-3">18,000 points</p>
              <Button className="w-full bg-red-500 text-white hover:bg-red-600" data-testid="button-redeem-gift">
                Redeem
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowRequestModal(true)}
          className="w-16 h-16 bg-gradient-to-r from-airline-blue to-airline-gold text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-float ripple-effect"
          data-testid="button-fab-request"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      {/* Request Modal */}
      <RequestModal 
        open={showRequestModal} 
        onOpenChange={setShowRequestModal}
      />
    </Layout>
  );
}
