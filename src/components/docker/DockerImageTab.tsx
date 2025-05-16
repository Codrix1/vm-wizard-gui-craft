
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DockerImageTab = () => {
  const [dockerfiles, setDockerfiles] = useState([
    { id: '1', name: 'Dockerfile', path: '/path/to/Dockerfile' },
    { id: '2', name: 'Dockerfile.dev', path: '/path/to/Dockerfile.dev' },
    { id: '3', name: 'Dockerfile.prod', path: '/path/to/Dockerfile.prod' }
  ]);
  const [selectedDockerfile, setSelectedDockerfile] = useState('');
  const [imageName, setImageName] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  const handleBuildImage = async () => {
    if (!selectedDockerfile) {
      toast.error('Please select a Dockerfile');
      return;
    }
    
    if (!imageName) {
      toast.error('Please enter an image name');
      return;
    }
    
    try {
      setIsBuilding(true);
      
      // In a real app, this would call a local API to build the image
      // await fetch('http://localhost:3001/api/docker/build', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     dockerfilePath: selectedDockerfile,
      //     imageName: imageName 
      //   })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Image ${imageName} built successfully`);
    } catch (error) {
      console.error('Error building image:', error);
      toast.error('Failed to build Docker image');
    } finally {
      setIsBuilding(false);
    }
  };

  useEffect(() => {
    // In a real app, this would fetch available Dockerfiles
    // const fetchDockerfiles = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3001/api/docker/dockerfiles');
    //     const data = await response.json();
    //     setDockerfiles(data);
    //   } catch (error) {
    //     console.error('Error fetching Dockerfiles:', error);
    //   }
    // };
    
    // fetchDockerfiles();
  }, []);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Build Docker Image</CardTitle>
        <CardDescription>
          Create a new Docker image from an existing Dockerfile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <label htmlFor="dockerfile-select" className="block mb-2 text-sm font-medium">
            Select Dockerfile
          </label>
          <Select 
            value={selectedDockerfile} 
            onValueChange={setSelectedDockerfile}
          >
            <SelectTrigger id="dockerfile-select">
              <SelectValue placeholder="Select a Dockerfile" />
            </SelectTrigger>
            <SelectContent>
              {dockerfiles.map((file) => (
                <SelectItem key={file.id} value={file.path}>
                  {file.name} ({file.path})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="image-name" className="block mb-2 text-sm font-medium">
            Image Name
          </label>
          <Input
            id="image-name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="e.g. myapp:latest"
          />
        </div>
        
        <Button 
          onClick={handleBuildImage} 
          className="bg-[#2496ED] hover:bg-[#1d7ac1]"
          disabled={isBuilding}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {isBuilding ? 'Building...' : 'Build Image'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DockerImageTab;
