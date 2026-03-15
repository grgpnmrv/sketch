import { useRef, useState } from 'react'

const MAX_PX = 1200
const JPEG_QUALITY = 0.82

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > MAX_PX || height > MAX_PX) {
        if (width > height) {
          height = Math.round((height / width) * MAX_PX)
          width = MAX_PX
        } else {
          width = Math.round((width / height) * MAX_PX)
          height = MAX_PX
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/jpeg',
        JPEG_QUALITY,
      )
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

interface Props {
  onReady: (blob: Blob, preview: string) => void
}

export default function ImageUpload({ onReady }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setCompressing(true)
    try {
      const blob = await compressImage(file)
      const url = URL.createObjectURL(blob)
      setPreview(url)
      onReady(blob, url)
    } catch (e) {
      console.error(e)
    } finally {
      setCompressing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      style={{ ...styles.zone, borderColor: preview ? '#22c55e' : '#d1d5db' }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      {compressing && <p style={styles.msg}>Compressing…</p>}
      {!compressing && preview && (
        <img src={preview} alt="your sketch" style={styles.preview} />
      )}
      {!compressing && !preview && (
        <p style={styles.msg}>📷 Tap or drag to upload your sketch photo</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  zone: {
    border: '2px dashed',
    borderRadius: 12,
    minHeight: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    background: '#fafaf8',
    transition: 'border-color 0.2s',
  },
  preview: { maxWidth: '100%', maxHeight: 400, objectFit: 'contain' },
  msg: { color: '#6b7280', fontSize: 15, textAlign: 'center', padding: 24 },
}
