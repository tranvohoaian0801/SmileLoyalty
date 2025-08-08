import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format } from "date-fns";

export default function Requests() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: pointRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/point-requests"],
    retry: false,
  });

  if (requestsLoading) {
    return (
      <Layout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </main>
      </Layout>
    );
  }

  const getStatusCounts = () => {
    if (!pointRequests) return { approved: 0, pending: 0, rejected: 0 };
    
    return pointRequests.reduce((acc: any, request: any) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, { approved: 0, pending: 0, rejected: 0 });
  };

  const statusCounts = getStatusCounts();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default'; // Green
      case 'pending':
        return 'secondary'; // Yellow
      case 'rejected':
        return 'destructive'; // Red
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-800 bg-green-100';
      case 'pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'rejected':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="requests-main">
        <h1 className="text-2xl font-bold text-gray-800 mb-8" data-testid="text-page-title">My Point Requests</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6" data-testid="card-stats-approved">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-stats-approved">
                  {statusCounts.approved}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-stats-pending">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-stats-pending">
                  {statusCounts.pending}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-stats-rejected">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600" data-testid="text-stats-rejected">
                  {statusCounts.rejected}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Requests Table */}
        <Card className="overflow-hidden" data-testid="card-requests-table">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Request History</h2>
          </div>
          
          {!pointRequests || pointRequests.length === 0 ? (
            <div className="p-8 text-center" data-testid="empty-state-requests">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-500">You haven't submitted any point requests. Create your first request to start earning points!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pointRequests.map((request: any) => (
                    <tr key={request.id} className="hover:bg-gray-50" data-testid={`row-request-${request.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-date-${request.id}`}>
                        {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-flight-${request.id}`}>
                        {request.flightNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-route-${request.id}`}>
                        {request.departureAirport} → {request.arrivalAirport}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" data-testid={`status-${request.id}`}>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-points-${request.id}`}>
                        {request.pointsAwarded > 0 ? `+${request.pointsAwarded}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </Layout>
  );
}
