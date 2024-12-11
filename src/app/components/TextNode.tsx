import { useState, useEffect, useRef } from 'react'
import { Handle, Position } from 'reactflow'

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    if (data.onChangeLabel) {
      data.onChangeLabel(newText)
    }
  }

  return (
    <div className="p-2 rounded shadow border border-border" style={{ backgroundColor: data.backgroundColor }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ width: 12, height: 12 }} />
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleInputChange}
        onClick={handleInputClick}
        className="nodrag bg-transparent text-lg w-full h-full"
        style={{ color: data.textColor, resize: 'both' }}
        rows={2}
      />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ width: 12, height: 12 }} />
    </div>
  )
}
