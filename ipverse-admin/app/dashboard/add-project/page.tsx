"use client"

import { useState } from "react"
import LayoutDashboard from "@/components/LayoutDashboard"
import ProjectForm from "@/components/ProjectForm"
import { CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { apiFetch } from "@/lib/api"
import useIPFSUpload from "@/hooks/useIPFSUpload"

export default function AddProjectPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
      const {uploadProjectFiles,loading} = useIPFSUpload()


  const handleProjectSubmit = async (projectData: any) => {
    setError("")
    console.log("Project data submitted:", projectData)
    try {
      // Call your backend API using apiFetch
      const res = await apiFetch<{ success: boolean; message: string; data: any }>(
        "/projects/createproject",
        {
          method: "POST",
          body: JSON.stringify(projectData),
        }
      )
      console.log("res is here why you fear ", res);
      if (res.success) {
        setShowSuccess(true);

        // Use the Cloudinary image URL from backend response
        const projectMetadata = {
          projectName: projectData.title,
          category: projectData.category,
          iptype: projectData.ipType,
          description: projectData.description,
          totalToken: String(projectData.totalTokens),
          tokenPrice: String(projectData.tokenPrice),
          proImage: res.data.project.images[0] || "", // Cloudinary URL
        };

        // Upload metadata to IPFS
        const fileUrl = await uploadProjectFiles(projectMetadata);
        console.log("File uploaded to IPFS:", fileUrl);

        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create project")
      setTimeout(() => setError(""), 5000)
    }
  }

  return (
    <LayoutDashboard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            {/* <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-6">
              <Sparkles className="h-8 w-8 text-indigo-600" />
            </div> */}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Create Your IP Project
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your intellectual property into tokenized assets and unlock new possibilities for funding and collaboration.
            </p>
            <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure & Transparent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Blockchain Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Global Access</span>
              </div>
            </div>
          </div>

          {/* Enhanced Success Toast */}
          {showSuccess && (
            <div className="fixed top-6 right-6 z-50 transform transition-all duration-500 ease-out">
              <div className="bg-white border border-green-200 rounded-2xl shadow-2xl p-6 flex items-center space-x-4 max-w-md">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Success!</h3>
                  <p className="text-sm text-gray-600 mt-1">Your project has been created successfully and is now live on the platform.</p>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Error Toast */}
          {error && (
            <div className="fixed top-6 right-6 z-50 transform transition-all duration-500 ease-out">
              <div className="bg-white border border-red-200 rounded-2xl shadow-2xl p-6 flex items-center space-x-4 max-w-md">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Error</h3>
                  <p className="text-sm text-gray-600 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Form Container */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0  transform rotate-1"></div>
            <div className="relative">
              <ProjectForm onSubmit={handleProjectSubmit} />
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Secure & Protected</h3>
                <p className="text-sm text-gray-600">Your intellectual property is protected by blockchain technology and smart contracts.</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Fast Funding</h3>
                <p className="text-sm text-gray-600">Get your project funded quickly through our global network of investors and supporters.</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Global Community</h3>
                <p className="text-sm text-gray-600">Connect with a worldwide community of creators, investors, and innovators.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  )
}