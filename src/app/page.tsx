"use client"

import { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant, // Import BackgroundVariant type
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useTheme } from 'next-themes'

import Sidebar from './components/Sidebar'
import TextNode from './components/TextNode'
import ImageNode from './components/ImageNode'
import edgeTypes from './components/edgeTypes'

const nodeTypes = {
  textNode: TextNode,
  imageNode: ImageNode,
}

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [mounted, setMounted] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [selectedEdgeColor, setSelectedEdgeColor] = useState('#000000') // Initialize selectedEdgeColor

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        label: '', // This will be updated when an edge is selected
        style: { stroke: selectedEdgeColor, strokeWidth: 3 }, // Use the selected color from sidebar
      }
      setEdges((eds) => {
        const updatedEdges = addEdge(newEdge, eds);
        setSelectedEdge(updatedEdges[updatedEdges.length - 1]); // Automatically select the new edge
        return updatedEdges;
      });
    },
    [setEdges, selectedEdgeColor],
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(() => node)
  }, [])

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault()
    setSelectedEdge(edge)
  }, [])

  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const onChangeLabel = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: newLabel } }
        }
        return node
      })
    )
  }, [setNodes])

  if (!mounted) {
    return null
  }

  return (
    <div className="h-full w-full flex">
      <div className="flex-grow relative overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes} // Add custom edge types
          className={theme === 'dark' ? 'react-flow__dark' : ''}
        >
          <Controls />
          <MiniMap />
          <Background variant={'dots' as BackgroundVariant} gap={12} size={1} />
        </ReactFlow>
      </div>
      <Sidebar
        setNodes={setNodes}
        setEdges={setEdges}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onChangeLabel={onChangeLabel}
        selectedEdgeColor={selectedEdgeColor}
        setSelectedEdgeColor={setSelectedEdgeColor}
      />
    </div>
  )
}
