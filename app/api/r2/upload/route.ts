import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/services/storage/r2";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "未上传文件" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = `uploads/${Date.now()}-${file.name}`;

    await uploadToR2(key, buffer, {
      contentType: file.type || "application/octet-stream",
    });

    console.log("[R2] Upload API success:", key);

    return NextResponse.json({
      message: "文件上传成功",
      fileKey: key,
    });
  } catch (error) {
    console.error("[R2] 上传接口异常:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
