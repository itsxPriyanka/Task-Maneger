import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  CheckCircle,
  Calendar,
  Users,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero-tasks.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold pulse-glow">TaskMaster</div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="default">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold leading-tight">
              Master Your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent pulse-glow">
                Tasks
              </span>{" "}
              Like a Pro
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transform your productivity with our intelligent task management
              system. Organize, prioritize, and accomplish more than ever
              before.
            </p>
            <div className="flex gap-4">
              <Link to="/signup">
                <Button variant="hero" size="hero" className="group">
                  Start Your Journey
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {/* <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ users</span>
              </div> */}
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Task Management Dashboard"
              className="rounded-2xl shadow-glow float-animation"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to Stay Organized
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed for maximum productivity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass-card border-0">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Automatically organize your tasks with intelligent
                categorization and priority sorting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <Calendar className="w-12 h-12 text-accent mb-4" />
              <CardTitle>Deadline Tracking</CardTitle>
              <CardDescription>
                Never miss a deadline with our advanced scheduling and reminder
                system.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <Users className="w-12 h-12 text-primary-glow mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work seamlessly with your team through shared projects and
                real-time updates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <Zap className="w-12 h-12 text-accent-glow mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Optimized performance ensures your task management is always
                responsive and smooth.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <Star className="w-12 h-12 text-yellow-400 mb-4" />
              <CardTitle>Goal Achievement</CardTitle>
              <CardDescription>
                Track your progress and celebrate achievements with our
                goal-setting features.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <CardTitle>Cross-Platform</CardTitle>
              <CardDescription>
                Access your tasks anywhere, anytime with our responsive web and
                mobile apps.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="text-5xl font-bold text-primary mb-4">1</div>
            <p className="font-semibold">Sign Up</p>
            <p className="text-muted-foreground">
              Create your free account in seconds
            </p>
          </div>
          <div>
            <div className="text-5xl font-bold text-accent mb-4">2</div>
            <p className="font-semibold">Add Your Tasks</p>
            <p className="text-muted-foreground">
              Organize tasks with categories & deadlines
            </p>
          </div>
          <div>
            <div className="text-5xl font-bold text-primary-glow mb-4">3</div>
            <p className="font-semibold">Achieve Goals</p>
            <p className="text-muted-foreground">
              Boost productivity and hit your milestones
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <Card className="glass-card border-0 text-center">
          <CardContent className="py-12">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who have already revolutionized their task
              management
            </p>
            <Link to="/signup">
              <Button variant="hero" size="hero" className="group">
                Get Started for Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
