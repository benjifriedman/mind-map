import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Image, Type, Link } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Node, Edge } from 'reactflow'
import { toJpeg } from 'html-to-image';

// Define color palette type
interface ColorPair {
  bg: string
  text: string
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
]

interface SidebarProps {
  setNodes: (updater: (nodes: Node[]) => Node[]) => void
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void
  selectedNode: Node | null
  selectedEdge: Edge | null
  onChangeLabel: (nodeId: string, label: string) => void
  selectedEdgeColor: string
  setSelectedEdgeColor: (color: string) => void
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
  const [edgeLabel, setEdgeLabel] = useState('')
  const [selectedNodeColor, setSelectedNodeColor] = useState<ColorPair>(colorPalette[0])

  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(selectedEdge.label || '')
    }
  }, [selectedEdge])

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
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const handleEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation()
    console.log('Edge clicked:', edge)
  }

  const updateEdgeLabel = () => {
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === selectedEdge.id) {
            return {
              ...edge,
              label: edgeLabel,
            }
          }
          return edge
        })
      )
    }
  }

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
            }
          }
          return node
        })
      )
    }
  }

  const handleEdgeLabelChange = (e) => {
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
    const reactFlowElement = document.querySelector('.react-flow');
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
                  setSelectedEdgeColor(color.bg)
                  if (selectedEdge) {
                    setEdges((eds) =>
                      eds.map((edge) => {
                        if (edge.id === selectedEdge.id) {
                          return {
                            ...edge,
                            style: { ...edge.style, stroke: color.bg },
                          }
                        }
                        return edge
                      })
                    )
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Edge Label</h2>
          <Input
            value={edgeLabel}
            onChange={handleEdgeLabelChange}
            placeholder="Enter edge label"
            className="mb-2"
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
      </div>
    </div>
  )
}
