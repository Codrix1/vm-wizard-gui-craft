
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw, Play, Square, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'exited';
  created: string;
  ports: string;
}

const DockerContainersTab = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([
    { id: 'abc123', name: 'happy_newton', image: 'nginx:latest', status: 'running', created: '3 hours ago', ports: '80:80' },
    { id: 'def456', name: 'nervous_feynman', image: 'node:18', status: 'exited', created: '2 days ago', ports: '3000:3000' },
    { id: 'ghi789', name: 'eager_einstein', image: 'redis:alpine', status: 'running', created: '5 hours ago', ports: '6379:6379' },
    { id: 'jkl101', name: 'focused_turing', image: 'postgres:13', status: 'running', created: '1 day ago', ports: '5432:5432' },
    { id: 'mno112', name: 'hopeful_hopper', image: 'python:3.9', status: 'stopped', created: '3 days ago', ports: '8000:8000' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyRunning, setShowOnlyRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContainers = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would call a local API to get Docker containers
      // const response = await fetch('http://localhost:3001/api/docker/containers');
      // const data = await response.json();
      // setContainers(data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Container list refreshed');
    } catch (error) {
      console.error('Error fetching Docker containers:', error);
      toast.error('Failed to fetch Docker containers');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartContainer = async (id: string) => {
    try {
      // In a real app, this would call a local API to start the container
      // await fetch(`http://localhost:3001/api/docker/containers/${id}/start`, {
      //   method: 'POST'
      // });
      
      setContainers(containers.map(container => 
        container.id === id ? { ...container, status: 'running' } : container
      ));
      
      toast.success('Container started');
    } catch (error) {
      console.error('Error starting container:', error);
      toast.error('Failed to start container');
    }
  };
  
  const handleStopContainer = async (id: string) => {
    try {
      // In a real app, this would call a local API to stop the container
      // await fetch(`http://localhost:3001/api/docker/containers/${id}/stop`, {
      //   method: 'POST'
      // });
      
      setContainers(containers.map(container => 
        container.id === id ? { ...container, status: 'stopped' } : container
      ));
      
      toast.success('Container stopped');
    } catch (error) {
      console.error('Error stopping container:', error);
      toast.error('Failed to stop container');
    }
  };
  
  const handleDeleteContainer = async (id: string) => {
    try {
      // In a real app, this would call a local API to delete the container
      // await fetch(`http://localhost:3001/api/docker/containers/${id}`, {
      //   method: 'DELETE'
      // });
      
      setContainers(containers.filter(container => container.id !== id));
      
      toast.success('Container removed');
    } catch (error) {
      console.error('Error removing container:', error);
      toast.error('Failed to remove container');
    }
  };

  useEffect(() => {
    // Initial fetch of Docker containers
    // fetchContainers();
  }, []);

  const filteredContainers = containers
    .filter(container => 
      (showOnlyRunning ? container.status === 'running' : true) &&
      (container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.image.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Docker Containers</CardTitle>
        <CardDescription>
          List and manage Docker containers on your local machine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search containers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-running"
                checked={showOnlyRunning}
                onCheckedChange={setShowOnlyRunning}
              />
              <Label htmlFor="show-running">Running only</Label>
            </div>
            <Button 
              variant="outline"
              onClick={fetchContainers}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Ports</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContainers.length > 0 ? (
                filteredContainers.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell className="font-medium">{container.name}</TableCell>
                    <TableCell>{container.image}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={container.status === 'running' ? 'default' : 'secondary'} 
                        className={
                          container.status === 'running' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gray-500 hover:bg-gray-600'
                        }
                      >
                        {container.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{container.created}</TableCell>
                    <TableCell>{container.ports}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {container.status !== 'running' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartContainer(container.id)}
                            title="Start"
                          >
                            <Play className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        {container.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStopContainer(container.id)}
                            title="Stop"
                          >
                            <Square className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteContainer(container.id)}
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    {searchTerm ? 'No containers match your search' : 'No Docker containers found'}
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

export default DockerContainersTab;
