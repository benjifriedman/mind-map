import React, { useState, useEffect } from 'react';
import CustomEdge from './CustomEdge';
import { EdgeText, ReactFlow, ReactFlowProvider, EdgeProps, getBezierPath } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Image, Type, Link } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { toJpeg } from 'html-to-image';
import { Node, Edge } from 'reactflow';

// Define edgeTypes outside the component
const edgeTypes = {
  custom: CustomEdge,
  default: (props: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      sourcePosition: props.sourcePosition,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition,
    });

    return (
      <EdgeText 
        {...props} 
        x={labelX} 
        y={labelY} 
        style={{ whiteSpace: 'pre-wrap' }} 
      />
    );
  },
};

// Define color palette type
interface ColorPair {
  bg: string;
  text: string;
}

const colorPalette: ColorPair[] = [
  { bg: '#FF0000', text: '#FFFFFF' }, // Red
  { bg: '#FF4500', text: '#FFFFFF' }, // Orange-Red
  { bg: '#FF7F00', text: '#000000' }, // Orange
  { bg: '#FFBF00', text: '#000000' }, // Yellow-Orange
  { bg: '#FFFF00', text: '#000000' }, // Yellow
  { bg: '#BFFF00', text: '#000000' }, // Yellow-Green
  { bg: '#00FF00', text: '#000000' }, // Green
  { bg: '#00FF7F', text: '#000000' }, // Spring Green
  { bg: '#00FFFF', text: '#000000' }, // Cyan
  { bg: '#007FFF', text: '#FFFFFF' }, // Azure
  { bg: '#0000FF', text: '#FFFFFF' }, // Blue
  { bg: '#4B0082', text: '#FFFFFF' }, // Indigo
  { bg: '#8A2BE2', text: '#FFFFFF' }, // Blue-Violet
  { bg: '#8B00FF', text: '#FFFFFF' }, // Violet
  { bg: '#DDA0DD', text: '#000000' }, // Plum
  { bg: '#FFFFFF', text: '#000000' }, // White
  { bg: '#C0C0C0', text: '#000000' }, // Light Gray
  { bg: '#808080', text: '#FFFFFF' }, // Gray
  { bg: '#404040', text: '#FFFFFF' }, // Dark Gray
  { bg: '#000000', text: '#FFFFFF' }  // Black
];

interface SidebarProps {
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onChangeLabel: (nodeId: string, label: string) => void;
  selectedEdgeColor: string;
  setSelectedEdgeColor: (color: string) => void;
}

export default function Sidebar({ 
  setNodes, 
  setEdges, 
  selectedNode, 
  selectedEdge, 
  onChangeLabel, 
  selectedEdgeColor, 
  setSelectedEdgeColor 
}: SidebarProps) {
  const [edgeLabel, setEdgeLabel] = useState('');
  const [selectedNodeColor, setSelectedNodeColor] = useState<ColorPair>(colorPalette[0]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(String(selectedEdge.label || ''));
    }
  }, [selectedEdge]);

  const addNode = (type: 'textNode' | 'imageNode') => {
    const newNode: Node = {
      id: Date.now().toString(),
      type,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { 
        label: `New ${type} node`, 
        backgroundColor: selectedNodeColor.bg,
        textColor: selectedNodeColor.text,
        onChangeLabel: (newLabel: string) => onChangeLabel(newNode.id, newLabel)
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateEdgeLabel = () => {
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === selectedEdge.id) {
            return {
              ...edge,
              label: edgeLabel,
            };
          }
          return edge;
        })
      );
    }
  };

  const updateNodeColor = () => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                backgroundColor: selectedNodeColor.bg,
                textColor: selectedNodeColor.text,
              },
            };
          }
          return node;
        })
      );
    }
  };

  const handleEdgeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setEdgeLabel(newLabel);

    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === selectedEdge.id) {
            return {
              ...edge,
              label: newLabel,
            };
          }
          return edge;
        })
      );
    }
  };

  const downloadImage = () => {
    const reactFlowElement = document.querySelector('.react-flow') as HTMLElement;
    if (reactFlowElement) {
      toJpeg(reactFlowElement, { quality: 0.95 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'mind-map.jpg';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error generating image:', error);
        });
    }
  };

  const addCustomEdge = () => {
    if (!selectedNode) {
      console.error('No node selected to create an edge.');
      return;
    }

    const sourceNodeId = selectedNode.id;
    const targetNodeId = 'someTargetNodeId'; // Replace with logic to determine the target node ID

    const newEdge: Edge = {
      id: `e${Date.now()}`,
      source: sourceNodeId,
      target: targetNodeId,
      type: 'custom',
      data: { label: 'Line 1\nLine 2\nLine 3' }, // Multiline label
    };

    setEdges((eds) => eds.concat(newEdge));
  };

  return (
    <div className="w-72 flex-shrink-0 border-l border-border bg-background text-foreground overflow-y-auto h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Add Node</h2>
        <div className="space-y-2">
          <Button onClick={() => addNode('textNode')} className="w-full">
            <Type className="mr-2 h-4 w-4" /> Add Text Node
          </Button>
          <Button onClick={() => addNode('imageNode')} className="w-full">
            <Image className="mr-2 h-4 w-4" /> Add Image Node
          </Button>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Node Color</h2>
          <div className="grid grid-cols-5 gap-2">
            {colorPalette.map((color) => (
              <button
                key={color.bg}
                className={`w-8 h-8 rounded ${color === selectedNodeColor ? 'ring-2 ring-primary' : ''}`}
                style={{ backgroundColor: color.bg }}
                onClick={() => setSelectedNodeColor(color)}
              />
            ))}
          </div>
          <Button onClick={updateNodeColor} className="w-full mt-2">
            Update Node
          </Button>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Edge Color</h2>
          <div className="grid grid-cols-5 gap-2">
            {colorPalette.map((color) => (
              <button
                key={color.bg}
                className={`w-8 h-8 rounded ${color.bg === selectedEdgeColor ? 'ring-2 ring-primary' : ''}`}
                style={{ backgroundColor: color.bg }}
                onClick={() => {
                  setSelectedEdgeColor(color.bg);
                  if (selectedEdge) {
                    setEdges((eds) =>
                      eds.map((edge) => {
                        if (edge.id === selectedEdge.id) {
                          return {
                            ...edge,
                            style: { ...edge.style, stroke: color.bg },
                          };
                        }
                        return edge;
                      })
                    );
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Edge Label</h2>
          <textarea
            value={edgeLabel}
            onChange={handleEdgeLabelChange}
            placeholder="Enter edge label"
            className="mb-2 w-full p-2 border rounded"
            rows={3}
          />
          <Button 
            onClick={updateEdgeLabel} 
            className="w-full"
            disabled={!selectedEdge}
          >
            <Link className="mr-2 h-4 w-4" /> Update Edge
          </Button>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Theme</h2>
          <ThemeToggle />
        </div>
        <div className="mt-8">
          <Button onClick={downloadImage} className="w-full">
            Download Mind Map as JPG
          </Button>
        </div>
        <Button onClick={addCustomEdge} className="w-full mt-2">
          Add Custom Edge
        </Button>
        <div style={{ width: '100%', height: '400px' }}>
          <ReactFlowProvider>
            <ReactFlow edgeTypes={edgeTypes} />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
