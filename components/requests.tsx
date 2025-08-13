'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { RequestModal } from "@/components/request-modal"
import { useState } from "react"
import { format } from "date-fns"
import { Plus, CalendarDays, MapPin, Plane } from "lucide-react"

export function Requests() {
  const [showRequestModal, setShowRequestModal] = useState(false)

  const { data: pointRequests, isLoading } = useQuery({
    queryKey: ["/api/point-requests"],
    queryFn: async () => {
      const response = await fetch("/api/point-requests")
      if (!response.ok) throw new Error("Failed to fetch point requests")
      return response.json()
    },
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'pending': return 'secondary'
      case 'rejected': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="title-my-requests">
              My Requests
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your point requests
            </p>
          </div>
          <Button 
            onClick={() => setShowRequestModal(true)}
            className="bg-airline-blue hover:bg-airline-blue/90"
            data-testid="button-create-request"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Request
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pointRequests && pointRequests.length > 0 ? (
          <div className="grid gap-6">
            {pointRequests.map((request: any) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow" data-testid={`request-card-${request.id}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Plane className="w-5 h-5 text-airline-blue" />
                        Flight {request.flightNumber}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.departureAirport} → {request.arrivalAirport}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          <span>{format(new Date(request.departureDate), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={getStatusVariant(request.status)}
                      className={`status-${request.status}`}
                      data-testid={`status-${request.status}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {request.additionalNotes && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Additional Notes:</p>
                      <p className="text-gray-600">{request.additionalNotes}</p>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Submitted on {format(new Date(request.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="text-no-requests">
                No requests yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start earning points by submitting your first flight request
              </p>
              <Button 
                onClick={() => setShowRequestModal(true)}
                className="bg-airline-blue hover:bg-airline-blue/90"
                data-testid="button-create-first-request"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Request
              </Button>
            </CardContent>
          </Card>
        )}

        <RequestModal 
          isOpen={showRequestModal} 
          onClose={() => setShowRequestModal(false)} 
        />
      </main>
    </Layout>
  )
}