import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
	{
		name: "Sarah Chen",
		role: "Portfolio Manager",
		company: "Goldman Sachs",
		content: "I've earned 28% returns on my Marvel IP tokens. IPVerse makes entertainment investing institutional-grade.",
		rating: 5,
		image: "SC"
	},
	{
		name: "Michael Rodriguez",
		role: "Investment Advisor",
		company: "Morgan Stanley",
		content: "The transparency and professional-grade analytics are exceptional. Real-time portfolio tracking at its finest.",
		rating: 5,
		image: "MR"
	},
	{
		name: "Emily Johnson",
		role: "Fund Manager",
		company: "BlackRock",
		content: "Finally, a sophisticated platform for IP investments. The due diligence tools are industry-leading.",
		rating: 5,
		image: "EJ"
	},
	{
		name: "David Park",
		role: "Senior Analyst",
		company: "JP Morgan",
		content: "The tokenization process is seamless and the returns have exceeded our expectations by 40%.",
		rating: 5,
		image: "DP"
	},
	{
		name: "Lisa Williams",
		role: "Investment Director",
		company: "Vanguard",
		content: "IPVerse has revolutionized how we approach intellectual property investments. Outstanding platform.",
		rating: 5,
		image: "LW"
	},
	{
		name: "Robert Kim",
		role: "Portfolio Strategist",
		company: "Fidelity",
		content: "The risk assessment tools and market insights have helped us achieve consistent 25%+ returns.",
		rating: 5,
		image: "RK"
	}
]

export default function LandingTestimonials() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
    useEffect(() => {
      if (!isAutoPlaying) return
  
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 4000) // Auto-advance every 4 seconds
  
      return () => clearInterval(interval)
    }, [isAutoPlaying])
  
    const nextTestimonial = () => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      setIsAutoPlaying(false)
      setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
    }
  
    const prevTestimonial = () => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setIsAutoPlaying(false)
      setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
    }
  
    const goToTestimonial = (index:any) => {
      setCurrentTestimonial(index)
      setIsAutoPlaying(false)
      setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
    }
  

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Investment Professionals</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Leading financial institutions trust IPVerse for superior returns and professional-grade analytics.
              </p>
            </div>
  
            <div className="relative">
              {/* Main Testimonial Card */}
              <div className="max-w-4xl mx-auto mb-8">
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm transform transition-all duration-500 hover:shadow-3xl">
                  <CardContent className="pt-8 pb-8 px-8">
                    <div className="text-center">
                      {/* Profile Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                        {testimonials[currentTestimonial].image}
                      </div>
                      
                      {/* Stars */}
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i: number) => (
                          <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      {/* Quote */}
                      <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic leading-relaxed">
                        "{testimonials[currentTestimonial].content}"
                      </blockquote>
                      
                      {/* Author Info */}
                      <div className="text-center">
                        <div className="font-semibold text-lg text-gray-900">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {testimonials[currentTestimonial].role}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
  
              {/* Navigation Controls */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
  
                {/* Dots Indicator */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index: number) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? 'bg-blue-600 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
  
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
  
              {/* Auto-play Indicator */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
                </div>
              </div>
  
              {/* Small Testimonial Cards Preview */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                {testimonials.slice(0, 3).map((testimonial, index: number) => (
                  <Card 
                    key={index} 
                    className={`border-0 shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg hover:opacity-100 ${
                      index === currentTestimonial % 3 ? 'opacity-100 ring-2 ring-blue-300' : ''
                    }`}
                    onClick={() => goToTestimonial(index)}
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3">
                        {testimonial.image}
                      </div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
  );
}