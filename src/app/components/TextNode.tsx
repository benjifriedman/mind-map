import { useState, useEffect, useRef } from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'

type TextNodeData = {
  label?: string;
  backgroundColor: string;
  textColor: string;
  onChangeLabel?: (newText: string) => void;
};

export default function TextNode({ data, isConnectable }: { data: TextNodeData; isConnectable: boolean }) {
  const [text, setText] = useState(data.label || '')
  const [isFirstClick, setIsFirstClick] = useState(true)
  const inputRef = useRef(null)

  useEffect(() => {
    setText(data.label || '')
  }, [data.label])

  const handleInputClick = () => {
    if (isFirstClick && text === 'New textNode node') {
      setText('')
      setIsFirstClick(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value
    setText(newText)
    if (data.onChangeLabel) {
      data.onChangeLabel(newText)
    }
  }

  return (
    <div className="p-2 rounded shadow border border-border" style={{ backgroundColor: data.backgroundColor }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ width: 12, height: 12 }} />
      <Input
        ref={inputRef}
        value={text}
        onChange={handleInputChange}
        onClick={handleInputClick}
        className="nodrag bg-transparent text-lg"
        style={{ color: data.textColor }}
      />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ width: 12, height: 12 }} />
    </div>
  )
}
