import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Register fonts once
let fontsRegistered = false;
function ensureFontsRegistered() {
  if (!fontsRegistered) {
    try {
      const robotoPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf');
      const dejavuPath = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans-Bold.ttf');
      const emojiPath = path.join(process.cwd(), 'public', 'fonts', 'NotoColorEmoji.ttf');
      
      console.log('Loading fonts...');
      
      if (fs.existsSync(robotoPath)) {
        GlobalFonts.registerFromPath(robotoPath, 'Roboto');
        console.log('✓ Roboto registered');
      }
      
      if (fs.existsSync(dejavuPath)) {
        GlobalFonts.registerFromPath(dejavuPath, 'DejaVu Sans');
        console.log('✓ DejaVu Sans registered');
      }

      if (fs.existsSync(emojiPath)) {
        GlobalFonts.registerFromPath(emojiPath, 'Noto Color Emoji');
        console.log('✓ Noto Color Emoji registered');
      }

      fontsRegistered = true;
    } catch (error) {
      console.error('Font registration error:', error);
    }
  }
  
  console.log('Registered fonts:', GlobalFonts.families.map((f: any) => typeof f === 'string' ? f : f.family));
}

interface RequestBody {
  imageUrl: string;
  text: string;
  position?: "top" | "center" | "bottom";
  fontSize?: number;
  fontColor?: "white" | "black";
  backgroundColor?: string;
  backgroundOpacity?: number;
  enableBackground?: boolean;
  enableStroke?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  enableShadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  padding?: number;
  textAlign?: "left" | "center" | "right";
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = process.env.API_SECRET_KEY;
    
    if (validApiKey && apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    ensureFontsRegistered();

    const Jimp = (await import('jimp')).default;
    
    const body: RequestBody = await req.json();
    const {
      imageUrl,
      text,
      position = 'bottom',
      fontSize = 64,
      fontColor = 'white',
      backgroundColor = '#000000',
      backgroundOpacity = 0.6,
      enableBackground = true,
      enableStroke = true,
      strokeColor = '#000000',
      strokeWidth = 3,
      enableShadow = true,
      shadowColor = 'rgba(0, 0, 0, 0.8)',
      shadowBlur = 8,
      shadowOffsetX = 2,
      shadowOffsetY = 2,
      padding = 40,
      textAlign = 'center',
    } = body;

    if (!imageUrl || !text) {
      return NextResponse.json(
        { error: 'imageUrl and text are required' },
        { status: 400 }
      );
    }

    console.log('Loading image from:', imageUrl);
    console.log('Text to render:', text);

    const image = await Jimp.read(imageUrl);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    console.log('Image loaded:', width, 'x', height);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Check which fonts are available
    const registeredFonts = GlobalFonts.families;
    const fontFamilyNames = registeredFonts.map((f: any) => typeof f === 'string' ? f : f.family);
    
    console.log('Available fonts:', fontFamilyNames);

    // Build font stack with emoji support
    let fontFamily = 'Roboto, "Noto Color Emoji", "DejaVu Sans", sans-serif';
    
    // Prioritize based on what's available
    if (fontFamilyNames.includes('Roboto') && fontFamilyNames.includes('Noto Color Emoji')) {
      fontFamily = 'Roboto, "Noto Color Emoji", sans-serif';
    } else if (fontFamilyNames.includes('DejaVu Sans') && fontFamilyNames.includes('Noto Color Emoji')) {
      fontFamily = '"DejaVu Sans", "Noto Color Emoji", sans-serif';
    } else if (fontFamilyNames.includes('Roboto')) {
      fontFamily = 'Roboto, sans-serif';
    } else if (fontFamilyNames.includes('DejaVu Sans')) {
      fontFamily = '"DejaVu Sans", sans-serif';
    }
    
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';

    console.log('Font set:', ctx.font);

    // Test measurement with emoji
    const testMeasure = ctx.measureText('Test ABC İĞÜŞÇÖ 🎉');
    console.log('Test measure width:', testMeasure.width);

    if (testMeasure.width === 0) {
      throw new Error('Font measurement failed - text width is 0');
    }

    // Text wrapping
    const bgPadding = enableBackground ? 20 : 0;
    const maxTextWidth = width - (padding * 2) - (bgPadding * 2);
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    console.log('Text wrapped into', lines.length, 'lines:', lines);

    const lineHeight = fontSize * 1.3;
    const totalTextHeight = lines.length * lineHeight;
    
    let maxLineWidth = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      if (metrics.width > maxLineWidth) {
        maxLineWidth = metrics.width;
      }
    }

    console.log('Max line width:', maxLineWidth, 'Total height:', totalTextHeight);

    let textBlockY: number;
    switch (position) {
      case 'top':
        textBlockY = padding;
        break;
      case 'center':
        textBlockY = (height - totalTextHeight) / 2;
        break;
      case 'bottom':
      default:
        textBlockY = Math.max(padding, height - totalTextHeight - padding);
        break;
    }

    let bgX: number = 0;
    let bgWidth: number = 0;
    
    if (enableBackground) {
      bgWidth = Math.min(width - (padding * 2), maxLineWidth + (bgPadding * 2));
      
      if (textAlign === 'center') {
        bgX = (width - bgWidth) / 2;
      } else if (textAlign === 'left') {
        bgX = padding;
      } else {
        bgX = width - bgWidth - padding;
      }
      
      const bgY = Math.max(0, textBlockY - bgPadding);
      const bgHeight = totalTextHeight + (bgPadding * 2);
      const finalBgY = Math.min(bgY, height - bgHeight);

      bgX = Math.max(0, Math.min(bgX, width - bgWidth));

      console.log('Background:', bgX, finalBgY, bgWidth, bgHeight);

      const r = parseInt(backgroundColor.slice(1, 3), 16);
      const g = parseInt(backgroundColor.slice(3, 5), 16);
      const b = parseInt(backgroundColor.slice(5, 7), 16);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${backgroundOpacity})`;
      const radius = 10;
      ctx.beginPath();
      ctx.moveTo(bgX + radius, finalBgY);
      ctx.lineTo(bgX + bgWidth - radius, finalBgY);
      ctx.quadraticCurveTo(bgX + bgWidth, finalBgY, bgX + bgWidth, finalBgY + radius);
      ctx.lineTo(bgX + bgWidth, finalBgY + bgHeight - radius);
      ctx.quadraticCurveTo(bgX + bgWidth, finalBgY + bgHeight, bgX + bgWidth - radius, finalBgY + bgHeight);
      ctx.lineTo(bgX + radius, finalBgY + bgHeight);
      ctx.quadraticCurveTo(bgX, finalBgY + bgHeight, bgX, finalBgY + bgHeight - radius);
      ctx.lineTo(bgX, finalBgY + radius);
      ctx.quadraticCurveTo(bgX, finalBgY, bgX + radius, finalBgY);
      ctx.closePath();
      ctx.fill();

      console.log('Background drawn');
    }

    if (enableShadow) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const metrics = ctx.measureText(line);
      const lineY = textBlockY + (i * lineHeight);
      
      let lineX: number;
      
      if (enableBackground) {
        switch (textAlign) {
          case 'left':
            lineX = bgX + bgPadding;
            break;
          case 'right':
            lineX = bgX + bgWidth - metrics.width - bgPadding;
            break;
          case 'center':
          default:
            lineX = bgX + (bgWidth - metrics.width) / 2;
            break;
        }
      } else {
        switch (textAlign) {
          case 'left':
            lineX = padding;
            break;
          case 'right':
            lineX = width - metrics.width - padding;
            break;
          case 'center':
          default:
            lineX = (width - metrics.width) / 2;
            break;
        }
      }
      
      console.log(`Drawing line ${i}: "${line}" at (${lineX}, ${lineY})`);
      
      if (enableStroke) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(line, lineX, lineY);
      }
      
      ctx.fillStyle = fontColor === 'white' ? '#FFFFFF' : '#000000';
      ctx.fillText(line, lineX, lineY);
    }

    console.log('All text drawn with emoji support');

    const textOverlayBuffer = canvas.toBuffer('image/png');
    console.log('Canvas buffer size:', textOverlayBuffer.length);

    const textOverlay = await Jimp.read(textOverlayBuffer);
    image.composite(textOverlay, 0, 0);

    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const uint8Buffer = new Uint8Array(buffer);

    console.log('Final buffer size:', uint8Buffer.length);

    return new NextResponse(uint8Buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}