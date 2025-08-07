/** @format */

import { useState } from 'react';
import { PinataFileManager } from '@/lib/ipfs';
import toast from 'react-hot-toast';

interface CompanyMetadata {
  name: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  description:string;
}

interface ProjectMetadata {
  projectName: string;
  category: string;
  iptype: string;
  description: string;
  totalToken:string;
  tokenPrice:string;
  proImage: string;

}

const useIPFSUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pinataManager = new PinataFileManager();

  const uploadCompanyFiles = async (
    metadata: CompanyMetadata
  ): Promise<{ [key: string]: string }> => {
    setLoading(true);
    setError(null);
    const fileUrls: { [key: string]: string } = {};

    try {
      // Upload company metadata to IPFS
      const metadataCID = await pinataManager.uploadJSON(metadata, 'public', {
        name: `${metadata.name}-metadata`,
        keyvalues: {
          type: 'company_metadata',
          company_name: metadata.name,
        },
      });
      console.log('Company metadata uploaded to IPFS:', metadataCID);

      // Return the metadata CID (no file uploads)
      fileUrls['metadata'] = metadataCID; // Store metadata CID instead of file URLs

      return fileUrls;
    } catch (err: any) {
      const errorMessage =
        err.message || 'An error occurred while uploading metadata to IPFS';
      toast.error(errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const uploadProjectFiles = async (
    metadata: ProjectMetadata
  ): Promise<{ [key: string]: string }> => {
    setLoading(true);
    setError(null);
    const fileUrls: { [key: string]: string } = {};

    try {
      // Upload company metadata to IPFS
      const metadataCID = await pinataManager.uploadJSON(metadata, 'public', {
        name: `${metadata.projectName}-metadata`,
        keyvalues: {
          type: 'project_metadata',
          project_name: metadata.projectName,
        },
      });

      // Return the metadata CID (no file uploads)
      fileUrls['metadata'] = metadataCID; // Store metadata CID instead of file URLs

      return fileUrls;
    } catch (err: any) {
      const errorMessage =
        err.message || 'An error occurred while uploading metadata to IPFS';
      toast.error(errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  


  return { uploadCompanyFiles,uploadProjectFiles, loading, error };
};

export default useIPFSUpload;