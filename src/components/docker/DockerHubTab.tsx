
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DockerHubImage {
  name: string;
  description: string;
  stars: number;
  official: boolean;
  pulls: string;
}

const DockerHubTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPulling, setPulling] = useState<{ [key: string]: boolean }>({});
  const [searchResults, setSearchResults] = useState<DockerHubImage[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setIsSearching(true);
      
      // In a real app, this would call the Docker Hub API
      // const response = await fetch(`https://hub.docker.com/v2/search/repositories/?query=${searchQuery}&page_size=10`);
      // const data = await response.json();
      // const formattedResults = data.results.map(result => ({
      //   name: result.repo_name,
      //   description: result.short_description,
      //   stars: result.star_count,
      //   official: result.is_official,
      //   pulls: result.pull_count
      // }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults: DockerHubImage[] = [
        { name: 'nginx', description: 'Official build of Nginx', stars: 15000, official: true, pulls: '1B+' },
        { name: 'node', description: 'Node.js is a JavaScript runtime', stars: 12000, official: true, pulls: '1B+' },
        { name: 'mysql', description: 'MySQL Server', stars: 11000, official: true, pulls: '1B+' },
        { name: 'redis', description: 'Redis is an open source key-value store', stars: 9800, official: true, pulls: '1B+' },
        { name: 'mongo', description: 'MongoDB document databases', stars: 8500, official: true, pulls: '500M+' }
      ].filter(img => img.name.includes(searchQuery.toLowerCase()));
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching Docker Hub:', error);
      toast.error('Failed to search Docker Hub');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePullImage = async (imageName: string) => {
    try {
      setPulling(prev => ({ ...prev, [imageName]: true }));
      
      // In a real app, this would call a local API to pull the image
      // await fetch('http://localhost:3001/api/docker/pull', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ imageName })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully pulled ${imageName}`);
    } catch (error) {
      console.error('Error pulling image:', error);
      toast.error(`Failed to pull ${imageName}`);
    } finally {
      setPulling(prev => ({ ...prev, [imageName]: false }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Docker Hub</CardTitle>
        <CardDescription>
          Search and pull Docker images from Docker Hub
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Docker Hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-8"
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-[#2496ED] hover:bg-[#1d7ac1]"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Stars</TableHead>
                <TableHead>Pulls</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.length > 0 ? (
                searchResults.map((image) => (
                  <TableRow key={image.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {image.name}
                        {image.official && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            Official
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{image.description}</TableCell>
                    <TableCell>{image.stars.toLocaleString()}</TableCell>
                    <TableCell>{image.pulls}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1"
                        onClick={() => handlePullImage(image.name)}
                        disabled={isPulling[image.name]}
                      >
                        <Download className="h-4 w-4" />
                        {isPulling[image.name] ? 'Pulling...' : 'Pull'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    {searchQuery ? 'No results found' : 'Search Docker Hub for images'}
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

export default DockerHubTab;
