'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Users, Gift, Star } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function AuthPage() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Authentication Forms */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-airline-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Smile Airlines</h1>
            <p className="text-gray-600 mt-2">Your journey to the skies begins here</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome to Smile Airlines</CardTitle>
              <CardDescription>Sign in with your Replit account to access your loyalty program</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={login}
                className="w-full bg-airline-blue hover:bg-airline-blue/90"
                data-testid="button-login"
              >
                Sign in with Replit
              </Button>
              <p className="text-sm text-gray-600 mt-4 text-center">
                New to Smile Airlines? Your account will be created automatically when you sign in.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Hero Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Soar Higher with 
            <span className="text-airline-blue block">Smile Airlines</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join millions of travelers earning points, unlocking exclusive benefits, 
            and experiencing premium service that makes every journey memorable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-airline-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Points</h3>
              <p className="text-gray-600 text-sm">Every flight earns you valuable points toward free trips and upgrades</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-airline-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Exclusive Perks</h3>
              <p className="text-gray-600 text-sm">Priority boarding, lounge access, and special member-only deals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-airline-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Service</h3>
              <p className="text-gray-600 text-sm">Dedicated customer support and personalized travel experiences</p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-airline-blue">2M+</div>
                <div className="text-gray-600 text-sm">Happy Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-airline-blue">150+</div>
                <div className="text-gray-600 text-sm">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-airline-blue">98%</div>
                <div className="text-gray-600 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}