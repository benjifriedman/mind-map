import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

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
        <ResizableBox
          width={200}
          height={200}
          minConstraints={[100, 100]}
          maxConstraints={[400, 400]}
          resizeHandles={['se']}
          className="resizable-box"
        >
          <img src={imageUrl} alt="Node" className="w-full h-full object-contain" />
        </ResizableBox>
      )}
      <Handle type="source" position={Position.Bottom} style={{ width: 12, height: 12 }} />
    </div>
  )
}
