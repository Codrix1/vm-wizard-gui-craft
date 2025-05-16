
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  created: string;
  size: string;
}

const DockerImagesTab = () => {
  const [images, setImages] = useState<DockerImage[]>([
    { id: '123abc', repository: 'nginx', tag: 'latest', created: '2 days ago', size: '135MB' },
    { id: '456def', repository: 'node', tag: '18-alpine', created: '1 week ago', size: '167MB' },
    { id: '789ghi', repository: 'python', tag: '3.9', created: '3 days ago', size: '885MB' },
    { id: '101jkl', repository: 'ubuntu', tag: '20.04', created: '2 weeks ago', size: '72MB' },
    { id: '112mno', repository: 'redis', tag: 'alpine', created: '5 days ago', size: '32MB' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would call a local API to get Docker images
      // const response = await fetch('http://localhost:3001/api/docker/images');
      // const data = await response.json();
      // setImages(data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Docker images refreshed');
    } catch (error) {
      console.error('Error fetching Docker images:', error);
      toast.error('Failed to fetch Docker images');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteImage = async (id: string) => {
    try {
      // In a real app, this would call a local API to delete the image
      // await fetch(`http://localhost:3001/api/docker/images/${id}`, {
      //   method: 'DELETE'
      // });
      
      setImages(images.filter(image => image.id !== id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  useEffect(() => {
    // Initial fetch of Docker images
    // fetchImages();
  }, []);

  const filteredImages = images.filter(image => 
    image.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Docker Images</CardTitle>
        <CardDescription>
          List and manage Docker images on your local machine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button 
            variant="outline"
            onClick={fetchImages}
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell className="font-medium">{image.repository}</TableCell>
                    <TableCell>{image.tag}</TableCell>
                    <TableCell>{image.created}</TableCell>
                    <TableCell>{image.size}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    {searchTerm ? 'No images match your search' : 'No Docker images found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DockerImagesTab;
