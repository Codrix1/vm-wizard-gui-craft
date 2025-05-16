
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface DockerHubImage {
  name: string;
  description: string;
  stars: number;
  official: boolean;
  pulls: string;
}

interface DockerHubResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    repo_name: string;
    short_description: string | null;
    star_count: number;
    is_official: boolean;
    pull_count: number;
  }>;
}

const formatPullCount = (count: number): string => {
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B+`;
  } else if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M+`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  return count.toString();
};

const DockerHubTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isPulling, setPulling] = useState<{ [key: string]: boolean }>({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dockerHubImages', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return { results: [], count: 0 };
      
      const response = await fetch(`https://hub.docker.com/v2/search/repositories/?query=${encodeURIComponent(searchQuery)}&page_size=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from Docker Hub');
      }
      
      return await response.json() as DockerHubResponse;
    },
    enabled: searchSubmitted && !!searchQuery.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const searchResults: DockerHubImage[] = data?.results?.map(result => ({
    name: result.repo_name,
    description: result.short_description || 'No description available',
    stars: result.star_count,
    official: result.is_official,
    pulls: formatPullCount(result.pull_count)
  })) || [];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setSearchSubmitted(true);
    await refetch();
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
            disabled={isLoading}
            className="bg-[#2496ED] hover:bg-[#1d7ac1]"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            Failed to fetch images from Docker Hub. Please try again later.
          </div>
        )}
        
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading images...
                  </TableCell>
                </TableRow>
              ) : searchResults.length > 0 ? (
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
                    {searchSubmitted ? 'No results found' : 'Search Docker Hub for images'}
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
