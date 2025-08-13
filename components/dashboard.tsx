'use client'

import { useAuth } from "@/lib/auth"
import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Info, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react"
import { Layout } from "@/components/layout"
import { RequestModal } from "@/components/request-modal"
import { useState } from "react"
import Link from "next/link"

export function Dashboard() {
  const { user } = useAuth()
  const [showRequestModal, setShowRequestModal] = useState(false)

  const { data: pointRequests } = useQuery({
    queryKey: ["/api/point-requests"],
    queryFn: async () => {
      const response = await fetch("/api/point-requests")
      if (!response.ok) throw new Error("Failed to fetch point requests")
      return response.json()
    },
  })

  const getStatusCounts = () => {
    if (!pointRequests) return { approved: 0, pending: 0, rejected: 0 }
    
    return pointRequests.reduce((acc: any, request: any) => {
      acc[request.status] = (acc[request.status] || 0) + 1
      return acc
    }, { approved: 0, pending: 0, rejected: 0 })
  }

  const statusCounts = getStatusCounts()
  const progressToNextTier = user?.currentPoints ? Math.min((user.currentPoints % 30000) / 30000 * 100, 100) : 0
  const pointsToNextTier = user?.currentPoints ? 30000 - (user.currentPoints % 30000) : 30000

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
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-green-600" data-testid="text-approved-count">
                  {statusCounts.approved}
                </p>
                <p className="text-gray-600">Approved Requests</p>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-pending-requests">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-pending-count">
                  {statusCounts.pending}
                </p>
                <p className="text-gray-600">Pending Requests</p>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-rejected-requests">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-red-600" data-testid="text-rejected-count">
                  {statusCounts.rejected}
                </p>
                <p className="text-gray-600">Rejected Requests</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800" data-testid="text-recent-activity">Recent Activity</h3>
            <Link href="/requests">
              <Button variant="outline" size="sm" data-testid="button-view-all-requests">
                View All Requests
              </Button>
            </Link>
          </div>
          
          {pointRequests && pointRequests.length > 0 ? (
            <div className="space-y-4">
              {pointRequests.slice(0, 3).map((request: any) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid={`request-item-${request.id}`}>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Flight {request.flightNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.departureAirport} → {request.arrivalAirport}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium status-${request.status}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500" data-testid="text-no-requests">
              <p>No recent activity. Start by creating your first point request!</p>
              <Button 
                className="mt-4" 
                onClick={() => setShowRequestModal(true)}
                data-testid="button-create-first-request"
              >
                Create Request
              </Button>
            </div>
          )}
        </Card>

        {/* Request Modal */}
        <RequestModal 
          isOpen={showRequestModal} 
          onClose={() => setShowRequestModal(false)} 
        />
      </main>
    </Layout>
  )
}