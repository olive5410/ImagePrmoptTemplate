import { NextRequest, NextResponse } from 'next/server';
import { getGenerations, insertGeneration, updateGeneration } from '@/services/generation';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ message: 'missing userId' }, { status: 400 });
  }

  const data = await getGenerations(userId);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const { prompt, result, userId } = await request.json();
  if (!prompt || !result || !userId) {
    return NextResponse.json({ message: 'prompt, result, and userId are required' }, { status: 400 });
  }

  const record = await insertGeneration(prompt, result, userId);
  if (!record) {
    return NextResponse.json({ message: 'failed to insert record' }, { status: 500 });
  }

  return NextResponse.json({ data: record });
}

export async function PUT(request: NextRequest) {
  const { id, result, userId } = await request.json();
  if (!id || !result || !userId) {
    return NextResponse.json({ message: 'id, result, and userId are required' }, { status: 400 });
  }

  const record = await updateGeneration(id, result, userId);
  if (!record) {
    return NextResponse.json({ message: 'failed to update record' }, { status: 500 });
  }

  return NextResponse.json({ data: record });
}
