// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${filename}`,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 }); // 5 minutes

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating signed URL', error);
    return NextResponse.json({ error: 'Error generating signed URL' }, { status: 500 });
  }
}