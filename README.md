# 🎨 Image Text Overlay API

Görseller üzerine Türkçe karakter ve emoji destekli metin ekleme API'si.

## 🚀 Özellikler

- ✅ Türkçe karakter desteği (İ, Ş, Ğ, Ü, Ö, Ç)
- ✅ Emoji desteği 🎉
- ✅ Özelleştirilebilir font boyutu
- ✅ Arka plan rengi ve opaklık
- ✅ Kenarlık (stroke) ekleme
- ✅ Gölge efekti
- ✅ Text hizalama (sol, orta, sağ)
- ✅ Pozisyon seçimi (üst, orta, alt)
- ✅ Gerçek zamanlı önizleme

## 🛠️ Teknolojiler

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **@napi-rs/canvas** - Canvas rendering
- **Jimp** - Image processing
- **Vercel** - Deployment

## 📦 Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) açın.

## 🌐 API Kullanımı

### POST `/api/text-overlay`

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "text": "Merhaba Dünya 🎉",
  "fontSize": 64,
  "fontColor": "white",
  "position": "bottom",
  "textAlign": "center",
  "enableBackground": true,
  "backgroundColor": "#000000",
  "backgroundOpacity": 0.6,
  "enableStroke": true,
  "strokeColor": "#000000",
  "strokeWidth": 3,
  "enableShadow": true,
  "shadowBlur": 8,
  "shadowOffsetX": 2,
  "shadowOffsetY": 2,
  "padding": 40
}
```

**Response:**
- PNG image (binary data)

### cURL Örneği

```bash
curl -X POST https://your-domain.vercel.app/api/text-overlay \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://picsum.photos/800/600",
    "text": "Merhaba Dünya 🎉",
    "fontSize": 64
  }' \
  --output result.png
```

## 🔐 API Key (Opsiyonel)

Güvenlik için API key eklemek isterseniz:

1. `.env.local` dosyası oluşturun:
```env
API_SECRET_KEY=your-secret-key-here
```

2. Request header'ına ekleyin:
```bash
curl -X POST https://your-domain.vercel.app/api/text-overlay \
  -H "x-api-key: your-secret-key-here" \
  -H "Content-Type: application/json" \
  ...
```

## 🎨 Font'lar

Proje 3 font kullanır:
- **Roboto Bold** - Ana font
- **DejaVu Sans Bold** - Fallback
- **Noto Color Emoji** - Emoji desteği

Font'lar `public/fonts/` klasöründe bulunur.

## 📝 Parametreler

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `imageUrl` | string | - | Görsel URL'i (zorunlu) |
| `text` | string | - | Eklenecek metin (zorunlu) |
| `fontSize` | number | 64 | Font boyutu (20-150) |
| `fontColor` | string | "white" | Yazı rengi (white/black) |
| `position` | string | "bottom" | Pozisyon (top/center/bottom) |
| `textAlign` | string | "center" | Hizalama (left/center/right) |
| `enableBackground` | boolean | true | Arka plan aktif |
| `backgroundColor` | string | "#000000" | Arka plan rengi (hex) |
| `backgroundOpacity` | number | 0.6 | Arka plan opaklık (0-1) |
| `enableStroke` | boolean | true | Kenarlık aktif |
| `strokeColor` | string | "#000000" | Kenarlık rengi (hex) |
| `strokeWidth` | number | 3 | Kenarlık kalınlığı (1-10) |
| `enableShadow` | boolean | true | Gölge aktif |
| `shadowBlur` | number | 8 | Gölge bulanıklık (0-30) |
| `shadowOffsetX` | number | 2 | Gölge X offset (-20 - 20) |
| `shadowOffsetY` | number | 2 | Gölge Y offset (-20 - 20) |
| `padding` | number | 40 | İç boşluk (10-100) |

## 🚀 Deploy

```bash
# Vercel'e deploy
vercel --prod
```

## 📄 Lisans

MIT

## 👤 Geliştirici

[@bahadirtortop](https://github.com/bahadirtortop)