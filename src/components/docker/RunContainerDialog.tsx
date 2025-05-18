
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface RunContainerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageId: string;
  imageName: string;
}

interface PortMapping {
  hostPort: string;
  containerPort: string;
  protocol: string;
}

interface VolumeMapping {
  hostPath: string;
  containerPath: string;
}

interface EnvVariable {
  name: string;
  value: string;
}

const RunContainerDialog = ({ open, onOpenChange, imageId, imageName }: RunContainerDialogProps) => {
  const [containerName, setContainerName] = useState('');
  const [ports, setPorts] = useState<PortMapping[]>([{ hostPort: '', containerPort: '8000', protocol: 'tcp' }]);
  const [volumes, setVolumes] = useState<VolumeMapping[]>([{ hostPath: '', containerPath: '' }]);
  const [envVars, setEnvVars] = useState<EnvVariable[]>([{ name: '', value: '' }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPort = () => {
    setPorts([...ports, { hostPort: '', containerPort: '', protocol: 'tcp' }]);
  };

  const handleAddVolume = () => {
    setVolumes([...volumes, { hostPath: '', containerPath: '' }]);
  };

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { name: '', value: '' }]);
  };

  const updatePort = (index: number, field: keyof PortMapping, value: string) => {
    const newPorts = [...ports];
    newPorts[index][field] = value;
    setPorts(newPorts);
  };

  const updateVolume = (index: number, field: keyof VolumeMapping, value: string) => {
    const newVolumes = [...volumes];
    newVolumes[index][field] = value;
    setVolumes(newVolumes);
  };

  const updateEnvVar = (index: number, field: keyof EnvVariable, value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  const handleRunContainer = async () => {
    try {
      setIsLoading(true);
      
      // Filter out empty entries
      const filteredPorts = ports.filter(p => p.hostPort || p.containerPort);
      const filteredVolumes = volumes.filter(v => v.hostPath && v.containerPath);
      const filteredEnvVars = envVars.filter(e => e.name && e.value);

      const payload = {
        imageId,
        containerName: containerName || undefined,
        ports: filteredPorts.length > 0 ? filteredPorts : undefined,
        volumes: filteredVolumes.length > 0 ? filteredVolumes : undefined,
        envVars: filteredEnvVars.length > 0 ? filteredEnvVars : undefined
      };

      const response = await fetch('http://localhost:5000/api/docker/containers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create container');
      }

      const data = await response.json();
      toast.success('Container created successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating container:', error);
      toast.error('Failed to create container: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="text-2xl">Run a new container</div>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">{imageName}</div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Optional settings</h3>
            <div className="space-y-2">
              <label htmlFor="container-name" className="text-sm font-medium">Container name</label>
              <Input 
                id="container-name"
                placeholder="Container name" 
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">A random name is generated if you do not provide one.</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Ports</h3>
            <p className="text-xs text-muted-foreground mb-2">Enter "0" to assign randomly generated host ports.</p>
            <div className="space-y-2">
              {ports.map((port, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Host port" 
                    value={port.hostPort}
                    onChange={(e) => updatePort(index, 'hostPort', e.target.value)}
                    className="w-1/3"
                  />
                  <span className="text-muted-foreground">:</span>
                  <Input 
                    placeholder="Container port" 
                    value={port.containerPort}
                    onChange={(e) => updatePort(index, 'containerPort', e.target.value)}
                    className="w-1/3"
                  />
                  <span className="text-muted-foreground">/</span>
                  <select 
                    value={port.protocol}
                    onChange={(e) => updatePort(index, 'protocol', e.target.value)}
                    className="border rounded px-2 py-2 bg-background w-1/4"
                  >
                    <option value="tcp">tcp</option>
                    <option value="udp">udp</option>
                  </select>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddPort} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add port
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Volumes</h3>
            <div className="space-y-2">
              {volumes.map((volume, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Host path" 
                    value={volume.hostPath}
                    onChange={(e) => updateVolume(index, 'hostPath', e.target.value)}
                    className="w-1/2"
                  />
                  <span className="text-muted-foreground">:</span>
                  <Input 
                    placeholder="Container path" 
                    value={volume.containerPath}
                    onChange={(e) => updateVolume(index, 'containerPath', e.target.value)}
                    className="w-1/2"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddVolume} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add volume
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Environment variables</h3>
            <div className="space-y-2">
              {envVars.map((envVar, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input 
                    placeholder="Variable" 
                    value={envVar.name}
                    onChange={(e) => updateEnvVar(index, 'name', e.target.value)}
                    className="w-1/2"
                  />
                  <span className="text-muted-foreground">=</span>
                  <Input 
                    placeholder="Value" 
                    value={envVar.value}
                    onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                    className="w-1/2"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddEnvVar} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add variable
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRunContainer} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Run'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RunContainerDialog;
