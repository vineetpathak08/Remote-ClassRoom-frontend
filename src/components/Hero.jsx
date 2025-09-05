import { ArrowRight, Zap } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { getData } from "@/context/userContext";

const Hero = () => {
  const { user } = getData();
  const navigate = useNavigate();
  return (
    <div className="relative w-full md:h-[700px] h-screen bg-gradient-to-br from-background via-muted to-accent/20 overflow-hidden">
      <section className=" w-full py-12 md:py-24 lg:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            {user && (
              <h1 className="font-accent font-bold text-2xl text-primary">
                Welcome {user.username}
              </h1>
            )}

            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="mb-4 border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 font-secondary"
              >
                <Zap className="w-3 h-3 mr-1" />
                New: AI-powered Remote Class Room organization
              </Badge>
              <h1 className="text-gradient font-accent text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Transform Your Learning Experience
                <span className="text-foreground"> With Smart Classrooms</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-secondary">
                Connect, learn, and collaborate seamlessly with our AI-powered
                virtual classroom platform. Experience the future of education
                with interactive features and intelligent assistance.
              </p>
            </div>
            <div className="space-x-4">
              <Button
                onClick={() => navigate("/virtual-classroom")}
                size="lg"
                className="h-12 px-8 relative bg-primary hover:bg-primary/90 text-primary-foreground font-primary font-semibold"
              >
                Virtual ClassRoom
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 border-primary/30 text-primary hover:bg-primary/10 font-secondary"
              >
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-secondary">
              Free forever • No credit card required • 2 minutes setup
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
