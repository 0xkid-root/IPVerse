"use client";

import { useState, useEffect } from "react";
import LayoutDashboard from "@/components/LayoutDashboard";
import ProjectTable from "@/components/ProjectTable";
import { Plus, Search, Filter, TrendingUp, DollarSign, Target, Calendar } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  tokenPrice: number;
  totalTokens: number;
  soldTokens: number;
  status: "Active" | "Completed" | "Upcoming";
  startDate: string;
  endDate: string;
}

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiFetch<{
          success: boolean;
          data: {
            projects: Array<{
              _id: string;
              title: string;
              tokenPrice: number;
              totalTokens: number;
              soldTokens: number;
              status: string;
              startDate: string;
              endDate: string;
            }>;
          };
        }>("/projects/allprojectlist");
        if (response.success) {
          const mappedProjects = response.data.projects.map((project) => ({
            id: project._id,
            name: project.title,
            tokenPrice: project.tokenPrice,
            totalTokens: project.totalTokens,
            soldTokens: project.soldTokens,
            status: mapStatus(project.status),
            startDate: new Date(project.startDate).toISOString().split("T")[0],
            endDate: new Date(project.endDate).toISOString().split("T")[0],
          }));
          setProjects(mappedProjects);
          setFilteredProjects(mappedProjects);
        }
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => 
        project.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    setFilteredProjects(filtered);
  }, [searchTerm, projects, statusFilter]);

  const handleEdit = (project: Project) => {
    console.log("Edit project:", project);
    alert(`Edit functionality for "${project.name}" would be implemented here`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      console.log("Deleted project:", id);
    }
  };

  const mapStatus = (status: string): "Active" | "Completed" | "Upcoming" => {
    switch (status.toLowerCase()) {
      case "active":
        return "Active";
      case "funded":
      case "closed":
        return "Completed";
      case "draft":
      case "upcoming":
        return "Upcoming";
      default:
        return "Upcoming";
    }
  };

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "Active").length,
    totalValue: projects.reduce((acc, p) => acc + (p.tokenPrice * p.totalTokens), 0),
    avgProgress: projects.length > 0 
      ? projects.reduce((acc, p) => acc + (p.soldTokens / p.totalTokens), 0) / projects.length * 100 
      : 0
  };

  if (loading) {
    return (
      <LayoutDashboard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 text-lg">Loading your projects...</p>
          </div>
        </div>
      </LayoutDashboard>
    );
  }

  if (error) {
    return (
      <LayoutDashboard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <div className="space-y-8 animate-fadeIn">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Manage Projects
                </h1>
                <p className="text-gray-600 text-lg">
                  Oversee and manage all your IP tokenization projects in one place.
                </p>
              </div>
              <Link
                href="/dashboard/add-project"
                className="group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-fit"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Create New Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Projects",
              value: stats.totalProjects,
              icon: Target,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50",
              textColor: "text-blue-700"
            },
            {
              label: "Active Projects", 
              value: stats.activeProjects,
              icon: TrendingUp,
              color: "from-green-500 to-green-600",
              bgColor: "bg-green-50",
              textColor: "text-green-700"
            },
            {
              label: "Total Value",
              value: `$${(stats.totalValue / 1000000).toFixed(1)}M`,
              icon: DollarSign,
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-50",
              textColor: "text-purple-700"
            },
            {
              label: "Avg Progress",
              value: `${stats.avgProgress.toFixed(1)}%`,
              icon: Calendar,
              color: "from-orange-500 to-orange-600",
              bgColor: "bg-orange-50",
              textColor: "text-orange-700"
            }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Enhanced Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="font-medium text-gray-700">{filteredProjects.length}</span> of{" "}
                <span className="font-medium text-gray-700">{projects.length}</span> projects
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Projects Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by creating your first project."
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  href="/dashboard/add-project"
                  className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Project</span>
                </Link>
              )}
            </div>
          ) : (
            <ProjectTable
              projects={filteredProjects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </LayoutDashboard>
  );
}