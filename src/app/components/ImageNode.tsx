import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'

type ImageNodeData = {
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
};

export default function ImageNode({ data }: { data: ImageNodeData }) {
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '')

  return (
    <div className="p-2 rounded shadow border border-border" style={{ backgroundColor: data.backgroundColor }}>
      <Handle type="target" position={Position.Top} style={{ width: 12, height: 12 }} />
      <Input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter image URL"
        className="nodrag mb-2 bg-transparent text-lg"
        style={{ color: data.textColor }}
      />
      {imageUrl && (
        <img src={imageUrl} alt="Node" className="max-w-[200px] max-h-[200px] object-contain" />
      )}
      <Handle type="source" position={Position.Bottom} style={{ width: 12, height: 12 }} />
    </div>
  )
}
