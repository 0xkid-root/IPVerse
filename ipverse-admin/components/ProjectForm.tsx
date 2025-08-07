"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Calendar, Upload, X, Building2, Coins, Target, TrendingUp, AlertTriangle, FileText, Image as ImageIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { validateProjectForm } from "../lib/projectValidation";

interface ProjectFormProps {
  onSubmit: (projectData: any) => Promise<void>;
  initialData?: any;
  isEditing?: boolean;
}

export default function ProjectForm({
  onSubmit,
  initialData,
  isEditing = false,
}: ProjectFormProps) {
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    ipType: initialData?.ipType || "",
    totalTokens: initialData?.totalTokens || "",
    tokenPrice: initialData?.tokenPrice || "",
    FundingGoal: initialData?.FundingGoal || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    expectedReturns: initialData?.expectedReturns || "",
    riskLevel: initialData?.riskLevel || "",
    images: initialData?.images || [],
    documents: initialData?.documents || [],
  });
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          images: [result],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, images: [] }));
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await apiFetch<{ success: boolean; data: Array<{ id: string; name: string }> }>(
          "/companies/names-and-ids"
        );
        if (response.success) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate first!
    const errorMsg = validateProjectForm(formData, selectedCompanyId);
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      companyId: selectedCompanyId,
      totalTokens: Number(formData.totalTokens),
      tokenPrice: Number(formData.tokenPrice),
      FundingGoal: Number(formData.FundingGoal),
      expectedReturns: Number(formData.expectedReturns),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    console.log("payload is formdata is here :", payload);


    await onSubmit(payload);


    setIsSubmitting(false);
    if (!isEditing) {
      // Reset form for new projects
      setFormData({
        title: "",
        description: "",
        category: "",
        ipType: "",
        totalTokens: "",
        tokenPrice: "",
        FundingGoal: "",
        startDate: "",
        endDate: "",
        expectedReturns: "",
        riskLevel: "",
        images: [],
        documents: [],
      });
      setImagePreview(null);
    }
  };

  const steps = [
    { id: 1, name: "Basic Info", icon: FileText },
    { id: 2, name: "Financial", icon: Coins },
    { id: 3, name: "Media & Review", icon: ImageIcon },
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Company Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  <p className="text-sm text-gray-600">Select the company associated with this project</p>
                </div>
              </div>
              <Select onValueChange={setSelectedCompanyId} value={selectedCompanyId}>
                <SelectTrigger className="w-full bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-3">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter an engaging project name"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-3">
                  Category *
                </label>
                <Select
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  value={formData.category}
                >
                  <SelectTrigger className="w-full border-2 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 py-4">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Music",
                      "Games",
                      "Characters",
                      "Art",
                      "Patents",
                      "Antiques",
                      "Technology",
                      "Culture",
                    ].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="ipType" className="block text-sm font-semibold text-gray-800 mb-3">
                  IP Type *
                </label>
                <input
                  type="text"
                  id="ipType"
                  name="ipType"
                  required
                  value={formData.ipType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200"
                  placeholder="e.g., Patent, Trademark, Copyright"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-3">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200 resize-none"
                placeholder="Provide a detailed description of your IP tokenization project, its value proposition, and potential impact..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Token Economics */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Coins className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Token Economics</h3>
                  <p className="text-sm text-gray-600">Define the tokenization parameters</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="totalTokens" className="block text-sm font-semibold text-gray-800 mb-3">
                    Total Tokens *
                  </label>
                  <input
                    type="number"
                    id="totalTokens"
                    name="totalTokens"
                    required
                    value={formData.totalTokens}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label htmlFor="tokenPrice" className="block text-sm font-semibold text-gray-800 mb-3">
                    Token Price (ETH) *
                  </label>
                  <input
                    type="number"
                    id="tokenPrice"
                    name="tokenPrice"
                    required
                    step="0.001"
                    value={formData.tokenPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200"
                    placeholder="0.001"
                  />
                </div>
              </div>
            </div>

            {/* Funding & Returns */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Funding & Returns</h3>
                  <p className="text-sm text-gray-600">Set financial goals and expectations</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="FundingGoal" className="block text-sm font-semibold text-gray-800 mb-3">
                    Funding Goal (USD) *
                  </label>
                  <input
                    type="number"
                    id="FundingGoal"
                    name="FundingGoal"
                    required
                    value={formData.FundingGoal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label htmlFor="expectedReturns" className="block text-sm font-semibold text-gray-800 mb-3">
                    Expected Returns (%) *
                  </label>
                  <input
                    type="number"
                    id="expectedReturns"
                    name="expectedReturns"
                    required
                    value={formData.expectedReturns}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200"
                    placeholder="15"
                  />
                </div>
              </div>
            </div>

            {/* Timeline & Risk */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-800 mb-3">
                  Start Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-gray-800 mb-3">
                  End Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200"
                  />
                  <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="riskLevel" className="block text-sm font-semibold text-gray-800 mb-3">
                  Risk Level *
                </label>
                <Select
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, riskLevel: value }))}
                  value={formData.riskLevel}
                >
                  <SelectTrigger className={`w-full border-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 py-4 ${getRiskLevelColor(formData.riskLevel)}`}>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {["low", "medium", "high"].map((level) => (
                      <SelectItem key={level} value={level}>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            level === 'low' ? 'text-green-500' :
                            level === 'medium' ? 'text-yellow-500' : 'text-red-500'
                          }`} />
                          <span className="capitalize">{level} Risk</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                Project Image
              </label>
              {imagePreview ? (
                <div className="relative inline-block group">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Project preview"
                    className="w-full max-w-md h-64 object-cover rounded-2xl border-4 border-gray-100 shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-2xl transition-all duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group cursor-pointer">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-indigo-100 rounded-2xl group-hover:bg-indigo-200 transition-colors duration-200">
                      <Upload className="h-12 w-12 text-indigo-600" />
                    </div>
                    <div>
                      <label htmlFor="image" className="cursor-pointer">
                        <div className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                          Upload project image
                        </div>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                        <input
                          type="file"
                          id="image"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Project Summary */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-indigo-600" />
                Project Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-medium text-gray-700">Project Name:</span>
                    <span className="text-gray-900">{formData.title || "Not set"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="text-gray-900">{formData.category || "Not set"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-medium text-gray-700">Total Tokens:</span>
                    <span className="text-gray-900">{formData.totalTokens || "Not set"}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-medium text-gray-700">Funding Goal:</span>
                    <span className="text-gray-900">${formData.FundingGoal || "Not set"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-medium text-gray-700">Expected Returns:</span>
                    <span className="text-gray-900">{formData.expectedReturns || "Not set"}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                    <span className="font-medium text-gray-700">Risk Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRiskLevelColor(formData.riskLevel)}`}>
                      {formData.riskLevel || "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      Step {step.id}
                    </p>
                    <p className={`text-sm ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.name}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-8 rounded-full transition-all duration-200 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < totalSteps ? (
              <button
                type="button" // <-- This prevents form submission!
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit" // <-- Only submit on last step!
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  isEditing ? "Update Project" : "Create Project"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}