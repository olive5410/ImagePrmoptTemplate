import { NextRequest, NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/services/storage/r2";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const fileKey = request.nextUrl.searchParams.get("fileKey");
  if (!fileKey) {
    return NextResponse.json({ error: "缺少 fileKey 参数" }, { status: 400 });
  }

  const expiresInParam = request.nextUrl.searchParams.get("expiresIn");
  const expiresIn = expiresInParam ? Number(expiresInParam) : undefined;

  try {
    const signedUrl = await getPresignedDownloadUrl(fileKey, {
      expiresIn: Number.isFinite(expiresIn) ? expiresIn : undefined,
    });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error("[R2] 生成预签名 URL 失败:", error);
    return NextResponse.json({ error: "生成预签名 URL 失败" }, { status: 500 });
  }
}
