'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('https://euhcjhewpsfkqnouslxj.supabase.co/storage/v1/object/public/generated_images/post-64-1760967875705.jpeg');
  const [text, setText] = useState('Merhaba Dünya 🎉');
  const [fontSize, setFontSize] = useState(64);
  const [fontColor, setFontColor] = useState<'white' | 'black'>('white');
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('bottom');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  
  const [enableBackground, setEnableBackground] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.6);
  
  const [enableStroke, setEnableStroke] = useState(true);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  
  const [enableShadow, setEnableShadow] = useState(true);
  const [shadowBlur, setShadowBlur] = useState(8);
  const [shadowOffsetX, setShadowOffsetX] = useState(2);
  const [shadowOffsetY, setShadowOffsetY] = useState(2);
  
  const [padding, setPadding] = useState(40);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sliderTrigger, setSliderTrigger] = useState(0);
  const isDraggingRef = useRef(false);

  // Generate image function
  const generateImage = async () => {
    if (!imageUrl || !text) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/text-overlay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          text,
          fontSize,
          fontColor,
          position,
          textAlign,
          enableBackground,
          backgroundColor,
          backgroundOpacity,
          enableStroke,
          strokeColor,
          strokeWidth,
          enableShadow,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
          shadowBlur,
          shadowOffsetX,
          shadowOffsetY,
          padding,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultImage(url);
    } catch (err: any) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger on immediate changes
  useEffect(() => {
    if (!isDraggingRef.current) {
      generateImage();
    }
  }, [
    imageUrl,
    text, 
    fontColor, 
    position, 
    textAlign, 
    enableBackground, 
    backgroundColor, 
    backgroundOpacity, 
    enableStroke, 
    strokeColor, 
    enableShadow,
    sliderTrigger
  ]);

  // Slider handlers
  const handleSliderChange = (setter: (val: number) => void, value: number) => {
    isDraggingRef.current = true;
    setter(value);
  };

  const handleSliderRelease = () => {
    isDraggingRef.current = false;
    setSliderTrigger(prev => prev + 1);
  };

  return (
    <>
      <div style={{ 
        height: '100vh',
        display: 'flex',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden'
      }}>
        {/* Sol Panel - Form */}
        <div style={{ 
          width: '380px',
          backgroundColor: 'white', 
          padding: '20px',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#333' }}>
            🎨 Image Text Overlay
          </h1>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>
              📸 Görsel URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px'
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>
              ✍️ Metin
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Türkçe + Emoji 🎉"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>
                📏 Boyut: {fontSize}px
              </label>
              <input
                type="range"
                min="20"
                max="150"
                value={fontSize}
                onChange={(e) => handleSliderChange(setFontSize, Number(e.target.value))}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>
                📐 Padding: {padding}px
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={padding}
                onChange={(e) => handleSliderChange(setPadding, Number(e.target.value))}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Renk</label>
              <select 
                value={fontColor} 
                onChange={(e) => setFontColor(e.target.value as any)} 
                style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px' }}
              >
                <option value="white">⚪ Beyaz</option>
                <option value="black">⚫ Siyah</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Pozisyon</label>
              <select 
                value={position} 
                onChange={(e) => setPosition(e.target.value as any)} 
                style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px' }}
              >
                <option value="top">⬆️ Üst</option>
                <option value="center">⏺️ Orta</option>
                <option value="bottom">⬇️ Alt</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '13px' }}>Hizalama</label>
              <select 
                value={textAlign} 
                onChange={(e) => setTextAlign(e.target.value as any)} 
                style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px' }}
              >
                <option value="left">⬅️ Sol</option>
                <option value="center">↔️ Orta</option>
                <option value="right">➡️ Sağ</option>
              </select>
            </div>
          </div>

          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />

          {/* Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '15px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '12px', 
              cursor: 'pointer', 
              padding: '8px', 
              backgroundColor: enableBackground ? '#e3f2fd' : '#f5f5f5', 
              borderRadius: '6px', 
              border: '1px solid #ddd' 
            }}>
              <input 
                type="checkbox" 
                checked={enableBackground} 
                onChange={(e) => setEnableBackground(e.target.checked)} 
                style={{ width: '16px', height: '16px' }} 
              />
              <span>🎨 Arka Plan</span>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '12px', 
              cursor: 'pointer', 
              padding: '8px', 
              backgroundColor: enableStroke ? '#e3f2fd' : '#f5f5f5', 
              borderRadius: '6px', 
              border: '1px solid #ddd' 
            }}>
              <input 
                type="checkbox" 
                checked={enableStroke} 
                onChange={(e) => setEnableStroke(e.target.checked)} 
                style={{ width: '16px', height: '16px' }} 
              />
              <span>✏️ Kenarlık</span>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '12px', 
              cursor: 'pointer', 
              padding: '8px', 
              backgroundColor: enableShadow ? '#e3f2fd' : '#f5f5f5', 
              borderRadius: '6px', 
              border: '1px solid #ddd' 
            }}>
              <input 
                type="checkbox" 
                checked={enableShadow} 
                onChange={(e) => setEnableShadow(e.target.checked)} 
                style={{ width: '16px', height: '16px' }} 
              />
              <span>🌑 Gölge</span>
            </label>
          </div>

          {enableBackground && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={backgroundColor} 
                  onChange={(e) => setBackgroundColor(e.target.value)} 
                  style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} 
                />
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '3px' }}>
                    Opaklık: {backgroundOpacity.toFixed(1)}
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={backgroundOpacity} 
                    onChange={(e) => handleSliderChange(setBackgroundOpacity, Number(e.target.value))}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>
            </div>
          )}

          {enableStroke && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={strokeColor} 
                  onChange={(e) => setStrokeColor(e.target.value)} 
                  style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} 
                />
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '3px' }}>
                    Kalınlık: {strokeWidth}px
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={strokeWidth} 
                    onChange={(e) => handleSliderChange(setStrokeWidth, Number(e.target.value))}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>
            </div>
          )}

          {enableShadow && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '3px' }}>
                    Blur: {shadowBlur}
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    value={shadowBlur} 
                    onChange={(e) => handleSliderChange(setShadowBlur, Number(e.target.value))}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    style={{ width: '100%' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '3px' }}>
                    X: {shadowOffsetX}
                  </label>
                  <input 
                    type="range" 
                    min="-20" 
                    max="20" 
                    value={shadowOffsetX} 
                    onChange={(e) => handleSliderChange(setShadowOffsetX, Number(e.target.value))}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    style={{ width: '100%' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '3px' }}>
                    Y: {shadowOffsetY}
                  </label>
                  <input 
                    type="range" 
                    min="-20" 
                    max="20" 
                    value={shadowOffsetY} 
                    onChange={(e) => handleSliderChange(setShadowOffsetY, Number(e.target.value))}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    style={{ width: '100%' }} 
                  />
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '6px', 
              textAlign: 'center',
              fontSize: '13px',
              color: '#0070f3'
            }}>
              ⏳ Güncelleniyor...
            </div>
          )}
        </div>

        {/* Sağ Panel - Önizleme */}
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          overflow: 'hidden'
        }}>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>👁️ Önizleme</h2>

          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fee', 
              color: '#c00', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              fontSize: '13px' 
            }}>
              <strong>❌ Hata:</strong> {error}
            </div>
          )}

          <div style={{ 
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {resultImage ? (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img
                    src={resultImage}
                    alt="Result"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                </div>
                <a
                  href={resultImage}
                  download="text-overlay.png"
                  style={{
                    padding: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  💾 İndir
                </a>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '15px' }}>Yükleniyor...</p>
                  </>
                ) : (
                  'Ayarları değiştirin...'
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0070f3;
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}