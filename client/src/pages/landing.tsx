import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex" data-testid="landing-page">
      {/* Left Panel with Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-airline-blue/20 to-airline-gold/20"></div>
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Airplane flying over scenic landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-airline-gold rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-bold">Smile Airlines</h1>
          </div>
          <h2 className="text-4xl font-light mb-4">
            Fly More, Earn More,<br />
            <span className="text-airline-gold font-semibold">Smile Always</span>
          </h2>
          <p className="text-lg opacity-90">Join millions of happy travelers earning rewards with every journey</p>
        </div>
      </div>

      {/* Right Panel with Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-airline-blue rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-airline-blue">Smile Airlines</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your loyalty account</p>
            </div>

            <form className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </Label>
                <Input 
                  id="email"
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                  placeholder="your.email@example.com"
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </Label>
                <Input 
                  id="password"
                  type="password" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-airline-blue focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" 
                  placeholder="Enter your password"
                  data-testid="input-password"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-airline-blue to-airline-gold text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 ripple-effect"
                data-testid="button-signin"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <a href="#" className="text-airline-blue hover:text-blue-700 font-medium" data-testid="link-forgot-password">
                Forgot Password?
              </a>
              <div className="text-gray-600">
                Don't have an account? 
                <a href="#" className="text-airline-blue hover:text-blue-700 font-medium ml-1" data-testid="link-register">
                  Register here
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
