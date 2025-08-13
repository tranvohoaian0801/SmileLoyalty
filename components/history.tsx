'use client'

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { format } from "date-fns"
import { History as HistoryIcon, TrendingUp, Plus, Minus } from "lucide-react"

export function History() {
  const { data: pointHistory, isLoading } = useQuery({
    queryKey: ["/api/point-history"],
    queryFn: async () => {
      const response = await fetch("/api/point-history")
      if (!response.ok) throw new Error("Failed to fetch point history")
      return response.json()
    },
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'earned': return <Plus className="w-4 h-4 text-green-600" />
      case 'redeemed': return <Minus className="w-4 h-4 text-red-600" />
      case 'bonus': return <TrendingUp className="w-4 h-4 text-blue-600" />
      default: return <HistoryIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600'
      case 'redeemed': return 'text-red-600'
      case 'bonus': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="title-point-history">
            Point History
          </h1>
          <p className="text-gray-600 mt-2">
            Track all your point earnings and redemptions
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pointHistory && pointHistory.length > 0 ? (
          <div className="grid gap-4">
            {pointHistory.map((entry: any) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow" data-testid={`history-entry-${entry.id}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTypeIcon(entry.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900" data-testid={`entry-description-${entry.id}`}>
                          {entry.description}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(entry.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTypeColor(entry.type)}`} data-testid={`entry-points-${entry.id}`}>
                        {entry.type === 'redeemed' ? '-' : '+'}{entry.points.toLocaleString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HistoryIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="text-no-history">
                No point history yet
              </h3>
              <p className="text-gray-600">
                Your point transactions will appear here once you start earning or redeeming points
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </Layout>
  )
}