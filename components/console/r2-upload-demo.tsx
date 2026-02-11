"use client";

import { ChangeEvent, useCallback, useState } from "react";

export default function R2UploadDemo() {
  const [status, setStatus] = useState<string>("等待上传");
  const [fileKey, setFileKey] = useState<string>("");

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setStatus("正在上传...");
    setFileKey("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/r2/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("文件上传成功！");
        setFileKey(data.fileKey ?? "");
      } else {
        setStatus(`上传失败：${data.error ?? "未知错误"}`);
      }
    } catch (error) {
      console.error("上传请求出错:", error);
      setStatus("上传请求失败，请稍后重试");
    }
  }, []);

  return (
    <div className="space-y-4">
      <input id="file-upload" type="file" onChange={handleFileChange} className="block" />
      <p id="upload-status" className="text-sm text-muted-foreground">
        {status}
      </p>
      {fileKey && (
        <div className="text-sm">
          <div>文件唯一标识：</div>
          <code className="break-all text-xs">{fileKey}</code>
        </div>
      )}
    </div>
  );
}
