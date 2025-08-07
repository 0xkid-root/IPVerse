"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building2, Mail, Phone, MapPin, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { apiFetch } from "@/lib/api";
import LayoutDashboard from "@/components/LayoutDashboard";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Contact phone must be at least 10 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

export default function ManageCompaniesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({  
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await apiFetch<{ success?: boolean; message?: string; error?: string; data?: any }>(
        "/companies/createcompany",
        {
          method: "POST",
          body: JSON.stringify({
            name: values.name,
            description: values.description,
            contactEmail: values.contactEmail,
            contactPhone: values.contactPhone,
            address: values.address,
          })
        }
      );

      console.log("API Response:", response);
      if (response.success) {
        form.reset();
        toast.success(`Company "${response.data.name}" created successfully!`, {
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      } else if (response.error) {
        toast.error(`Failed to create company: ${response.error}`, {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      } else {
        toast.error("Failed to create company: Unknown error occurred", {
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(`Failed to create company: ${error.message || "Network or server error"}`, {
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <LayoutDashboard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Company Management
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Create and manage your business partnerships
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
                <Badge variant="outline">
                  Companies Module
                </Badge>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-3">
                      <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        Add New Company
                      </CardTitle>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                      Fill in the company details below to add them to your network
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Company Name */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Company Name
                              </FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                  <Input 
                                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder="e.g., Acme Corporation" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Description */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Company Description
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  className="min-h-[100px] bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 resize-none" 
                                  placeholder="Brief description of the company's business, services, or products..."
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Contact Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Contact Email
                                </FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input 
                                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                      type="email" 
                                      placeholder="contact@company.com" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Contact Phone
                                </FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input 
                                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                      placeholder="+1 (555) 123-4567" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Address */}
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Company Address
                              </FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                  <Input 
                                    className="pl-10 h-12 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20" 
                                    placeholder="123 Business St, City, State 12345" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Submit Button */}
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            size="lg"
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium px-8 py-3 h-12 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Creating Company...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Create Company
                              </div>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              {/* Info Panel */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Quick Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Company Name</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Use the official company name for consistency</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Description</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Keep it concise but informative</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">Contact Info</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Double-check email and phone accuracy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Need Help?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Check our documentation for detailed guidance on company management.
                      </p>
                      <Button variant="outline" size="sm" className="border-blue-200 dark:border-blue-800">
                        View Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </LayoutDashboard>
    </>
  );
}