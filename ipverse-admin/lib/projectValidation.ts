export function validateProjectForm(formData: any, selectedCompanyId: string) {
  if (!selectedCompanyId) return "Please select a company.";
  if (!formData.title?.trim()) return "Project name is required.";
  if (!formData.category) return "Category is required.";
  if (!formData.ipType?.trim()) return "IP Type is required.";
  if (!formData.description?.trim()) return "Description is required.";
  if (!formData.totalTokens || Number(formData.totalTokens) <= 0) return "Total tokens must be greater than 0.";
  if (!formData.tokenPrice || Number(formData.tokenPrice) <= 0) return "Token price must be greater than 0.";
  if (!formData.FundingGoal || Number(formData.FundingGoal) <= 0) return "Funding goal must be greater than 0.";
  if (!formData.expectedReturns || Number(formData.expectedReturns) < 0) return "Expected returns must be 0 or more.";
  if (!formData.startDate) return "Start date is required.";
  if (!formData.endDate) return "End date is required.";
  if (!formData.riskLevel) return "Risk level is required.";
  if (!formData.images || formData.images.length === 0) return "Project image is required.";

  return null;
}