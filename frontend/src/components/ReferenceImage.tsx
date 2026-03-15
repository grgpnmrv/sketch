import { useRef, useState } from 'react'

export default function ReferenceImage() {
  const [src, setSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSrc(URL.createObjectURL(file))
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.label}>Reference image</span>
        <span style={styles.hint}>(optional, stays on your device)</span>
      </div>
      {src ? (
        <div style={styles.previewWrap}>
          <img src={src} alt="reference" style={styles.preview} />
          <button style={styles.clear} onClick={() => { setSrc(null); if (inputRef.current) inputRef.current.value = '' }}>
            Remove
          </button>
        </div>
      ) : (
        <button style={styles.addBtn} onClick={() => inputRef.current?.click()}>
          + Add reference
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  header: { display: 'flex', alignItems: 'baseline', gap: 8 },
  label: { fontWeight: 600, fontSize: 14 },
  hint: { fontSize: 12, color: '#9ca3af' },
  previewWrap: { position: 'relative', display: 'inline-block' },
  preview: { maxWidth: 180, maxHeight: 160, borderRadius: 8, border: '1.5px solid #e5e7eb', objectFit: 'contain' },
  clear: { position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 12 },
  addBtn: { alignSelf: 'flex-start', padding: '6px 14px', borderRadius: 6, border: '1.5px dashed #d1d5db', cursor: 'pointer', background: '#fff', fontSize: 13, color: '#6b7280' },
}
