'use client'

import { useAuth } from "@/lib/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { useToast } from "@/components/hooks/use-toast"
import { apiRequest } from "@/lib/api"
import { useState } from "react"
import { User, Star, Calendar, Edit3, Save, X } from "lucide-react"

export function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('PATCH', '/api/profile', data)
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      })
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] })
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(formData)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    })
    setIsEditing(false)
  }

  const getTierInfo = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'silver':
        return { color: 'bg-gray-100 text-gray-800', benefits: ['Basic point earning', 'Standard customer support', 'Annual statement'] }
      case 'gold':
        return { color: 'bg-yellow-100 text-yellow-800', benefits: ['1.5x point earning', 'Priority check-in', 'Lounge access', 'Priority customer support'] }
      case 'platinum':
        return { color: 'bg-purple-100 text-purple-800', benefits: ['2x point earning', 'Priority boarding', 'Premium lounge access', 'Dedicated support', 'Upgrade preferences'] }
      default:
        return { color: 'bg-gray-100 text-gray-800', benefits: ['Basic point earning'] }
    }
  }

  const tierInfo = getTierInfo(user?.membershipTier || 'silver')

  return (
    <Layout>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="title-profile">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and membership details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      data-testid="button-edit-profile"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancel}
                        data-testid="button-cancel-edit"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSubmit}
                        disabled={updateProfileMutation.isPending}
                        data-testid="button-save-profile"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={isEditing ? formData.firstName : user?.firstName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={isEditing ? formData.lastName : user?.lastName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-last-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={isEditing ? formData.email : user?.email || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={isEditing ? formData.phoneNumber : user?.phoneNumber || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Optional"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Membership Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Tier</Label>
                  <Badge className={`mt-1 ${tierInfo.color} tier-${user?.membershipTier?.toLowerCase()}`} data-testid="badge-membership-tier">
                    {user?.membershipTier || 'Silver'} Member
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Points</Label>
                  <p className="text-2xl font-bold text-airline-blue" data-testid="text-current-points">
                    {user?.currentPoints?.toLocaleString() || '0'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Member Since</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900" data-testid="text-member-since">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tier Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tierInfo.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-airline-blue rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  )
}