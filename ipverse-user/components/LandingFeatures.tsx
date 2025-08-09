import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vault, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Vault,
    title: "Secure IP Tokenization",
    description: "Blockchain-secured intellectual property tokens with transparent ownership and trading history.",
  },
  {
    icon: TrendingUp,
    title: "Premium Returns",
    description: "Earn from successful entertainment franchises with potential returns of 15-35%.",
  },
  {
    icon: Users,
    title: "Institutional Grade",
    description: "Join institutional investors backing the next generation of entertainment assets.",
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-20">
      {/* ...features code here... */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional IP Investment</h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Advanced tokenization technology meets institutional-grade investment infrastructure.
                  </p>
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, index: number) => (
                    <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 transform transition-transform hover:scale-110">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
    </section>
  );
}