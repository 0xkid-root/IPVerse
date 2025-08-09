"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Users, Star, Vault, Coins, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import LandingHeader from "@/components/LandingHeader";
import LandingHero from "@/components/LandingHero";
import LandingFeatures from "@/components/LandingFeatures";
import LandingStats from "@/components/LandingStats";
import LandingTestimonials from "@/components/LandingTestimonials";
import LandingCTA from "@/components/LandingCTA";
import LandingFooter from "@/components/LandingFooter";


export default function LandingPage() {

	return (
		<div className="min-h-screen bg-white">
			<LandingHeader />
			<LandingHero />
			<LandingFeatures />
			<LandingStats />
			<LandingTestimonials />
			<LandingCTA />
			<LandingFooter />
		</div>
	);
}