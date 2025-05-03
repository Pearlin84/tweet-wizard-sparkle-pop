
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Twitter, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const AuthPage = () => {
  const { user, signIn, signUp, resetPassword } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get("tab") === "signup" ? "signup" : "signin";
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSignInSubmit = async (values: SignInValues) => {
    setIsLoading(true);
    await signIn(values.email, values.password);
    setIsLoading(false);
  };

  const onSignUpSubmit = async (values: SignUpValues) => {
    setIsLoading(true);
    await signUp(values.email, values.password, values.firstName, values.lastName);
    setIsLoading(false);
  };

  const onForgotPasswordSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    await resetPassword(values.email);
    setIsLoading(false);
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <div className="flex min-h-[calc(100vh-180px)] items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md p-6 shadow-lg border-tweet-purple/30">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-tweet-purple">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>
          
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-6">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-tweet-purple hover:bg-tweet-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={isLoading}
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-md p-6 shadow-lg border-tweet-purple/30">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to home</span>
          </Link>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tweet-purple relative">
            <Twitter className="h-6 w-6 text-white" />
            <span className="absolute text-xs font-bold text-white">X</span>
            <div className="absolute inset-0 bg-tweet-purple rounded-full blur-sm -z-10"></div>
          </div>
          <div className="w-24"></div> {/* This empty div helps center the logo */}
        </div>
        
        <h1 className="mb-8 text-center text-2xl font-bold bg-gradient-to-r from-tweet-purple to-tweet-blue bg-clip-text text-transparent">
          Welcome to TweetMode
        </h1>
        
        <Tabs
          defaultValue="signin"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-xs text-tweet-purple"
                          onClick={() => setShowForgotPassword(true)}
                          disabled={isLoading}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-tweet-purple hover:bg-tweet-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 text-tweet-purple"
                onClick={() => setActiveTab("signup")}
              >
                Sign up
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={signUpForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-tweet-purple hover:bg-tweet-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 text-tweet-purple"
                onClick={() => setActiveTab("signin")}
              >
                Sign in
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
