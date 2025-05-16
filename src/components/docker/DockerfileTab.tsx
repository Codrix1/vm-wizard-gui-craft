
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { FolderOpen, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DockerfileTab = () => {
  const [dockerfileContent, setDockerfileContent] = useState('FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]');
  const [filePath, setFilePath] = useState('/path/to/Dockerfile');

  const handleSaveDockerfile = async () => {
    try {
      // In a real app, this would call a local API to save the file
      // await fetch('http://localhost:3001/api/dockerfile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: dockerfileContent, path: filePath })
      // });
      toast.success('Dockerfile saved successfully');
    } catch (error) {
      console.error('Error saving Dockerfile:', error);
      toast.error('Failed to save Dockerfile');
    }
  };

  const handleBrowsePath = () => {
    // In a real app, this would open a file browser dialog
    toast.info('File browser would open here');
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Create Dockerfile</CardTitle>
        <CardDescription>
          Create and save a Dockerfile to build your Docker image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <label htmlFor="filePath" className="block mb-2 text-sm font-medium">
              File Path
            </label>
            <div className="flex gap-2">
              <Input
                id="filePath"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="Enter file path"
                className="flex-1"
              />
              <Button variant="outline" onClick={handleBrowsePath} title="Browse">
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="dockerfile" className="block mb-2 text-sm font-medium">
            Dockerfile Content
          </label>
          <Textarea
            id="dockerfile"
            value={dockerfileContent}
            onChange={(e) => setDockerfileContent(e.target.value)}
            placeholder="Enter your Dockerfile content here"
            className="font-mono h-80"
          />
        </div>

        <Button onClick={handleSaveDockerfile} className="bg-[#2496ED] hover:bg-[#1d7ac1]">
          <Save className="h-4 w-4 mr-2" />
          Save Dockerfile
        </Button>
      </CardContent>
    </Card>
  );
};

export default DockerfileTab;
